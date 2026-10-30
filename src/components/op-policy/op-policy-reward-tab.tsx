'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { merchantAPI, ticketAPI } from 'src/api';
import type { IAffiliateMall, IAffiliateMallSource } from 'src/types/config/ticket_accrual_config';
import { toAffiliateMall } from 'src/utils/ticket-accrual';
import { DEFAULT_TICKET_VALUE } from 'src/utils/ticket-value';
import { TicketChip, TicketChipOnlyName } from '../common/ticket-chip';

/* 티켓 단일화(2026-10-14) — 브론즈·실버·골드가 「티켓」 하나로 합쳐졌다. 정책 문구는 고정이지만
   장수·금액 계산은 「티켓 가치 설정」(ticket_value_config)의 티켓 1장 값을 따라간다.
   설정을 못 읽으면 기본값(10원)으로 계산한다. */

// 검증 예시 — 적립액(= 구매확정금액 × 적립률 계산 후 값)을 티켓 1장 값으로 나눈다
const verifyRows = [
  { amount: 15, note: '' },
  { amount: 36, note: '(예: G마켓 10,000원×0.36%)' },
  { amount: 72, note: '(예: G마켓 20,000원×0.36%)' },
  { amount: 220, note: '' },
  { amount: 340, note: '' },
];

// 기프티콘 구매 카탈로그 — 필요 장수는 가격 ÷ 티켓 1장 값(올림)으로 계산한다
const catalogItems = [
  { name: 'CU 음료 1.5L', price: 1100 },
  { name: '빽다방 아메리카노', price: 1500, strong: true },
  { name: '컴포즈 아메리카노', price: 2000 },
  { name: 'GS25 도시락', price: 3000 },
  { name: '이디야 아메리카노', price: 3200 },
  { name: '던킨 글레이즈드 6P', price: 3600 },
  { name: '스타벅스 아메리카노 T', price: 4500 },
  { name: '스타벅스 카페라떼 T', price: 5800 },
  { name: '던킨 도넛 4P 세트', price: 6500 },
  { name: '배스킨라빈스 파인트', price: 8500 },
  { name: 'CGV 영화관람권', price: 14000 },
  { name: 'BHC 뿌링클', price: 19000 },
];

// 시뮬레이터 입력 상한. 이 값을 넘으면 부동소수점 오차로 티켓 수량이 깨져 보이므로 계산 전에 clamp한다.
const MAX_SIM_AMOUNT = 100_000_000;
const MALL_LIST_LIMIT = 200;

const won = (n: number) => `${n.toLocaleString()}원`;

// 적립액을 티켓 1장 값으로 나눈다 — 나머지(잔돈)는 지급하지 않는다
const splitTickets = (accrual: number, ticketValue: number) => {
  const tickets = ticketValue > 0 ? Math.floor(accrual / ticketValue) : 0;
  const reward = tickets * ticketValue;
  return { tickets, reward, remainder: accrual - reward };
};

const formulaStyle: React.CSSProperties = {
  background: 'var(--surface-2)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '12px',
};

const simLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-2)',
  fontWeight: 600,
  display: 'block',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '.4px',
};

const noteBoxStyle: React.CSSProperties = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-md)',
  padding: '14px',
};

// 시뮬레이터 제휴몰 목록 — 적립이 켜진(applied) 몰만, 대표 제휴몰(쿠팡 등)을 앞에 둔다
const fetchAppliedMalls = async (): Promise<IAffiliateMall[]> => {
  const load = async (source: IAffiliateMallSource) => {
    const res = await merchantAPI.getList({
      page: 1,
      limit: MALL_LIST_LIMIT,
      filter: { merchant_source: source },
      order: [['commission_rate', 'desc']],
    });
    return (res?.result?.object?.rows ?? []).map((m) => toAffiliateMall(m, source));
  };
  const [manual, linkprice] = await Promise.all([load('MANUAL'), load('LINKPRICE')]);
  return [...manual, ...linkprice].filter((m) => m.applied);
};

export const OpPolicyRewardTab: React.FC = () => {
  const [ticketValue, setTicketValue] = useState(DEFAULT_TICKET_VALUE.ticket);
  const [malls, setMalls] = useState<IAffiliateMall[]>([]);
  const [mallId, setMallId] = useState('');
  const [simInput, setSimInput] = useState('154000');
  const [simAmount, setSimAmount] = useState(154000);

  useEffect(() => {
    let cancelled = false;
    ticketAPI
      .getTicketValueConfig()
      .then((res) => {
        const value = res?.result?.object?.values?.TICKET;
        if (!cancelled && typeof value === 'number' && value > 0) setTicketValue(value);
      })
      .catch(() => {
        // 설정을 못 읽으면 기본값으로 계산한다
      });
    fetchAppliedMalls()
      .then((rows) => {
        if (cancelled) return;
        setMalls(rows);
        setMallId((prev) => prev || rows[0]?.id || '');
      })
      .catch(() => {
        // 제휴몰을 못 읽으면 시뮬레이터 결과를 비워 둔다
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMall = malls.find((m) => m.id === mallId) ?? null;

  const simResult = useMemo(() => {
    if (!selectedMall || simAmount <= 0) return null;
    const accrual = Math.floor((simAmount * selectedMall.accrualRate) / 100);
    const split = splitTickets(accrual, ticketValue);
    const rate = ((split.reward / simAmount) * 100).toFixed(2);
    return { accrual, ...split, rate };
  }, [selectedMall, simAmount, ticketValue]);

  const handleSimulate = () => {
    const parsed = Number(simInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setSimInput('0');
      setSimAmount(0);
      return;
    }
    const clamped = Math.min(Math.floor(parsed), MAX_SIM_AMOUNT);
    setSimInput(String(clamped));
    setSimAmount(clamped);
  };

  return (
    <div>
      <div className="card-header" style={{ padding: 0, border: 'none', marginBottom: '10px' }}>
        <div className="card-title">티켓 환산가치</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>종류</th>
            <th>환산가치 (1장)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TicketChipOnlyName grade="TICKET" bare />
            </td>
            <td>{won(ticketValue)}</td>
          </tr>
        </tbody>
      </table>
      <div className="info-box" style={{ marginTop: '12px' }}>
        <strong>적립액 산정</strong> — 적립액 = 구매확정금액 × 해당 제휴몰의 적립률. 적립률은
        제휴몰마다 다르며 <strong>티켓 적립 설정</strong> 화면에서 관리합니다(정책상 고정 비율
        없음). 최소 구매 금액 문턱은 없습니다 — 구매 금액과 무관하게 모든 경유구매에 적립률을
        적용합니다.
      </div>

      <div className="card-header" style={{ padding: 0, border: 'none', margin: '18px 0 10px' }}>
        <div className="card-title">적립 산정 — 티켓 장수</div>
      </div>
      <div className="info-box">
        <strong>알고리즘 공식</strong> — 위에서 산정한 적립액을 티켓 1장 값으로 나눠 티켓 장수를
        결정합니다.
        <br />
        <code style={formulaStyle}>
          티켓 = ⌊적립액 / {ticketValue}⌋ → {won(ticketValue)} 미만 잔돈은 지급 안 함
        </code>
      </div>

      <div
        style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', margin: '16px 0 10px' }}
      >
        검증 예시{' '}
        <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>
          (적립액 = 구매확정금액 × 적립률 계산 후 값)
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>적립액</th>
            <th>티켓</th>
            <th>잔여 (무지급)</th>
            <th>총 지급가치</th>
          </tr>
        </thead>
        <tbody>
          {verifyRows.map((row) => {
            const { tickets, reward, remainder } = splitTickets(row.amount, ticketValue);
            return (
              <tr key={row.amount}>
                <td style={{ fontWeight: 700 }}>
                  {won(row.amount)}
                  {row.note && (
                    <span style={{ color: 'var(--text-3)', fontWeight: 400 }}> {row.note}</span>
                  )}
                </td>
                <td style={{ color: 'var(--text-3)' }}>
                  {tickets > 0 ? (
                    <TicketChip
                      grade="TICKET"
                      quantity={tickets}
                      prefixAfter="장"
                      bare
                      showName={false}
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td style={{ color: 'var(--text-3)' }}>{won(remainder)}</td>
                <td style={{ color: 'var(--success)', fontWeight: 700 }}>{won(reward)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="card-grid" style={{ marginTop: '16px' }}>
        <div style={noteBoxStyle}>
          <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
            잔여 금액 처리
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            티켓 1장 값({won(ticketValue)}) 미만으로 남는 잔돈은 지급하지 않습니다(&quot;거스름돈&quot;
            방식). 적립률이 낮은 제휴몰에서 소액 구매 시 티켓이 아예 안 나갈 수 있습니다.
          </div>
        </div>
        <div style={noteBoxStyle}>
          <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
            적립 제외 금액
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            배송비, 쿠폰, 캐시, 적립 제외 상품가는 계산 대상에서 제외 후 알고리즘 적용.
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div className="card-title">티켓 지급 정책</div>
          <div className="card-sub">조회 전용 — 포스트백 수신부터 티켓 확정까지의 흐름</div>
        </div>
        <div>
          <div className="policy-item">
            <div className="policy-label">포스트백 수신 즉시</div>
            <div className="policy-value">
              가지급 랜덤 티켓 1장{' '}
              <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                (유저 화면: 장수 미정)
              </span>{' '}
              → <span style={{ color: 'var(--amber)' }}>적립예정</span>
            </div>
            <div className="policy-desc">
              장수는 구매 금액 기준으로 <strong>내부 확정</strong> — 위 적립 기준(적립액 ÷ 티켓 1장
              값) 적용. 적립률 비공개 정책에 따라 유저 앱에는 확정 전까지 &lsquo;랜덤(미정)&rsquo;으로
              표시해 기대감 부여. 운영자는 회원 목록의 &lsquo;전환예정&rsquo; 컬럼에서 확정 장수를
              미리 확인. 확정 시 티켓으로 전환되어 기프티콘 구매에 사용.{' '}
              <span style={{ color: 'var(--text-3)' }}>(경품 응모는 별도 이벤트 티켓 전용)</span>
            </div>
          </div>
          <div className="policy-item">
            <div className="policy-label">구매확정 후 — 전환 대기일 수 경과</div>
            <div className="policy-value" style={{ color: 'var(--success)' }}>
              사용 가능 전환 + 구매 금액 기준 티켓 지급
            </div>
            <div className="policy-desc">
              적립 확정 대기 = 쿠팡은 카카오톡 연동 D+7 / 미연동 D+30(고정), 링크프라이스 제휴몰은
              익익월 6일 확정 후(「티켓 적립 설정」과 같은 기준). 해당 기간 내 취소
              없으면 자동 처리되어 가지급 랜덤 티켓이 구매 금액 기준 티켓으로 전환.
            </div>
          </div>
          <div className="policy-item">
            <div className="policy-label">취소 / 반품 처리</div>
            <div className="policy-value" style={{ color: 'var(--danger)' }}>
              적립예정 티켓 즉시 환수 + 티켓 미지급
            </div>
            <div className="policy-desc">
              대기 기간 내 취소·반품 감지 시 적립예정 티켓 환수, 티켓 미발행
            </div>
          </div>
          <div className="policy-item">
            <div className="policy-label">1일 적립 한도</div>
            <div className="policy-value">5장 / 일 (적립예정 기준)</div>
            <div className="policy-desc">부정 이용 방지 기준값</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">월 적립 한도</div>
            <div className="policy-value">50장 / 월</div>
            <div className="policy-desc">매월 1일 00:00 초기화</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">티켓 유효기간</div>
            <div className="policy-value">적립일(랜덤 티켓 받은 날)로부터 1년</div>
            <div className="policy-desc">
              기산일 = 구매로 랜덤 티켓을 받은 적립일. 적립일 기준 1년 경과 시 만료(티켓 확정 시점
              아님). 만료 30일·7일 전 알림 유지, 기한 경과 시 자동 소멸(복구 불가). 이벤트 티켓은
              발급일+100일 고정 소멸 만료로 별도 처리.
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div className="card-title">티켓 구매 정책</div>
          <div className="card-sub">조회 전용 — 2026-10-14 티켓 1종 통합</div>
        </div>
        <div style={{ padding: '18px' }}>
          <div className="info-box" style={{ marginBottom: '16px' }}>
            <strong>기프티콘은 티켓 장수로 구매</strong> — 필요 장수 = 기프티콘 가격 ÷ 티켓 1장
            값({won(ticketValue)}). 나눠떨어지지 않으면 1장 더(올림). 등급 구매는 등급 티켓 1종
            통합으로 폐기했습니다.
          </div>
          <div className="info-box" style={{ marginBottom: '16px' }}>
            <strong>포인트 → 티켓 구매는 단방향 · 등가 · 수수료 없음</strong> — 10P로 티켓 1장을
            받을 수 있습니다. 필요 포인트가 모자라면 구매하지 않습니다.{' '}
            <strong>티켓 → 포인트 역방향은 2026-08 확정으로 중단</strong>했습니다 — 앱에서는 숨김
            처리만 했을 뿐 로직·데이터는 그대로라 필요 시 복구할 수 있습니다.
          </div>
          <div
            className="info-box"
            style={{ borderColor: '#f2ddb4', background: '#fdf3e2', color: '#8a5a12' }}
          >
            <strong>이벤트 티켓은 단방향 전환만</strong> —{' '}
            <strong>이벤트 티켓 1장 → 티켓 2장</strong>(1장 단위)은 허용하지만,{' '}
            <strong>티켓 → 이벤트 티켓 역방향은 금지</strong>합니다. 티켓 2장(20원)을 이벤트 티켓
            1장으로 되돌리면 랜덤 선물 상자 1회(기대값 40원)로 가치가 2배 증식되기 때문입니다.
            앱에도 역방향 전환 기능이 없으며, 전환 실행 로직의 허용 방향 화이트리스트에서
            차단됩니다(UI 우회 불가).
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div className="card-title">기프티콘 구매 카탈로그</div>
          <div className="card-sub">조회 전용 — 상품·구매 티켓은 기프티콘 상품목록에서 관리</div>
        </div>
        <div style={{ padding: '18px' }}>
          <div className="info-box" style={{ marginBottom: '16px' }}>
            <strong>설계 원칙</strong> — 필요 장수 = 기프티콘 가격 ÷ 티켓 1장 값(
            {won(ticketValue)}). 나눠떨어지지 않으면 1장 더(올림).
            <br />
            <strong style={{ color: 'var(--text)' }}>구매 방식:</strong> 티켓 장수 하나로 결제
          </div>
          <div
            style={{
              background: 'rgba(255,209,102,.08)',
              border: '1px solid rgba(255,209,102,.3)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>필요</th>
                  <th>기프티콘</th>
                  <th>실가</th>
                </tr>
              </thead>
              <tbody>
                {catalogItems.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <TicketChip
                        grade="TICKET"
                        quantity={Math.ceil(item.price / ticketValue)}
                        prefixAfter="장"
                        bare
                        showName={false}
                      />
                    </td>
                    <td>{item.strong ? <strong>{item.name}</strong> : item.name}</td>
                    <td style={{ color: 'var(--text-2)' }}>{won(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              background: 'var(--surface-2)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12px',
            }}
          >
            <div>
              <div style={{ color: 'var(--text-2)', marginBottom: '4px', fontSize: '11px' }}>
                기프티콘 유효기간
              </div>
              <div style={{ color: 'var(--text)', fontWeight: 600 }}>발급일로부터 30일</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-2)', marginBottom: '4px', fontSize: '11px' }}>
                부분 환불
              </div>
              <div style={{ color: 'var(--text)', fontWeight: 600 }}>티켓 환수 불가</div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '18px',
          background: 'linear-gradient(135deg,rgba(132,94,238,.08),rgba(217,119,6,.06))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
            티켓 시뮬레이터
          </div>
          <span className="ds-tag calc" style={{ marginLeft: 'auto' }}>
            실시간 계산
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="op-policy-tk-sim-mall" style={simLabelStyle}>
              제휴몰
            </label>
            <select
              id="op-policy-tk-sim-mall"
              className="form-select"
              value={mallId}
              onChange={(e) => setMallId(e.target.value)}
            >
              {malls.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="op-policy-tk-sim" style={simLabelStyle}>
              구매 확정가 (원)
            </label>
            <input
              id="op-policy-tk-sim"
              type="number"
              className="search-box"
              value={simInput}
              placeholder="예: 50000"
              min={0}
              max={MAX_SIM_AMOUNT}
              style={{ minWidth: 0, width: '100%' }}
              onChange={(e) => setSimInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSimulate}>
            계산
          </button>
        </div>
        {simResult && selectedMall && (
          <div
            style={{
              marginTop: '14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: '14px',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-2)', marginBottom: '8px' }}>
              {won(simAmount)} 구매 시 지급
            </div>
            <div style={{ marginBottom: '10px' }}>
              {simResult.tickets > 0 ? (
                <span className="tk-bronze">티켓 {simResult.tickets.toLocaleString()}장</span>
              ) : (
                <span style={{ color: 'var(--text-2)' }}>
                  지급 티켓 없음 (적립액 {won(ticketValue)} 미만)
                </span>
              )}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border)',
                fontSize: '11px',
              }}
            >
              <div>
                <div style={{ color: 'var(--text-2)', marginBottom: '2px' }}>총 보상</div>
                <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '14px' }}>
                  {won(simResult.reward)}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-2)', marginBottom: '2px' }}>실 보상률</div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{simResult.rate}%</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-2)', marginBottom: '2px' }}>잔여 (무지급)</div>
                <div style={{ color: 'var(--text-2)', fontWeight: 700, fontSize: '14px' }}>
                  {won(simResult.remainder)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
