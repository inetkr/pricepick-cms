'use client';

import React, { useMemo, useState } from 'react';
import { TicketChip, TicketChipOnlyName } from '../common/ticket-chip';
import type { TicketGrade } from 'src/types/common';

const gradeRows = [
  { grade: 'bronze', label: '브론즈', unit: '5,000원당', value: '100원' },
  { grade: 'silver', label: '실버', unit: '50,000원당', value: '1,000원' },
  { grade: 'gold', label: '골드', unit: '100,000원당', value: '2,000원' },
];

const verifyRows = [
  {
    amount: '22,000원',
    gold: '-',
    silver: '-',
    bronze: '4',
    remain: '2,000원',
    reward: '400원',
    rate: '1.82%',
  },
  {
    amount: '55,000원',
    gold: '-',
    silver: '1',
    bronze: '1',
    remain: '0원',
    reward: '1,100원',
    rate: '2.00%',
  },
  {
    amount: '99,000원',
    gold: '-',
    silver: '1',
    bronze: '9',
    remain: '4,000원',
    reward: '1,900원',
    rate: '1.92%',
  },
  {
    amount: '126,000원',
    gold: '1',
    silver: '-',
    bronze: '5',
    remain: '1,000원',
    reward: '2,500원',
    rate: '1.98%',
  },
  {
    amount: '154,000원',
    gold: '1',
    silver: '1',
    bronze: '-',
    remain: '4,000원',
    reward: '3,000원',
    rate: '1.95%',
  },
];

const catalogGroups = [
  {
    grade: 'bronze',
    label: '브론즈 교환',
    subLabel: '(저가대 1,000~3,000원)',
    items: [
      { name: 'CU 음료 1.5L', qty: 12, price: '1,100원' },
      { name: '빽다방 아메리카노', qty: 17, price: '1,500원' },
      { name: '컴포즈 아메리카노', qty: 22, price: '2,000원' },
      { name: 'GS25 도시락', qty: 33, price: '3,000원' },
    ],
    note: '1장 = 100원 환산. 소액 적립 사용자의 첫 보상 경험에 적합.',
  },
  {
    grade: 'silver',
    label: '실버 교환',
    subLabel: '(중가대 3,000~7,000원)',
    items: [
      { name: '이디야 아메리카노', qty: 3, price: '3,200원' },
      { name: '던킨 글레이즈드 6P', qty: 4, price: '3,600원' },
      { name: '스타벅스 아메리카노 T', qty: 5, price: '4,500원' },
      { name: '던킨 도넛 4P 세트', qty: 7, price: '6,500원' },
    ],
    note: '1장 = 1,000원 환산. 메인 교환 등급. 적립 빈도 vs 보상 가치의 균형점.',
  },
  {
    grade: 'gold',
    label: '골드 교환',
    subLabel: '(고가대 5,000~22,000원)',
    items: [
      { name: '스타벅스 카페라떼 T', qty: 3, price: '5,800원' },
      { name: '배스킨라빈스 파인트', qty: 5, price: '8,500원' },
      { name: 'CGV 영화관람권', qty: 8, price: '14,000원' },
      { name: 'BHC 뿌링클', qty: 11, price: '19,000원' },
    ],
    note: '1장 = 2,000원 환산. 큰 보상감으로 적립 동기 부여 (게이미피케이션).',
  },
];

const GRADE_VALUE = { gold: 2000, silver: 1000, bronze: 100 };
// 시뮬레이터 입력 상한. 이 값을 넘으면 부동소수점 오차로 티켓 수량이 깨져 보이므로 계산 전에 clamp한다.
const MAX_SIM_AMOUNT = 100_000_000;

function calcGreedyTickets(amount: number) {
  let remain = amount;
  const gold = Math.floor(remain / 100000);
  remain -= gold * 100000;
  const silver = Math.floor(remain / 50000);
  remain -= silver * 50000;
  const bronze = Math.floor(remain / 5000);
  remain -= bronze * 5000;
  const reward =
    gold * GRADE_VALUE.gold + silver * GRADE_VALUE.silver + bronze * GRADE_VALUE.bronze;
  const rate = amount > 0 ? ((reward / amount) * 100).toFixed(2) : '0.00';
  return { gold, silver, bronze, remainder: remain, reward, rate };
}

export const OpPolicyRewardTab: React.FC = () => {
  const [simInput, setSimInput] = useState('154000');
  const [simAmount, setSimAmount] = useState(154000);
  const simResult = useMemo(
    () => (simAmount > 0 ? calcGreedyTickets(simAmount) : null),
    [simAmount]
  );

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
        <div className="card-title">등급별 적립 기준</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>등급</th>
            <th>적립 단위</th>
            <th>지급</th>
            <th>환산가치</th>
            <th>보상률</th>
          </tr>
        </thead>
        <tbody>
          {gradeRows.map((row) => (
            <tr key={row.grade}>
              <td>
                <TicketChipOnlyName grade={row.grade.toUpperCase() as TicketGrade} bare />
              </td>
              <td>{row.unit}</td>
              <td>1장</td>
              <td>{row.value}</td>
              <td style={{ color: 'var(--success)' }}>2.0%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card-header" style={{ padding: 0, border: 'none', margin: '18px 0 10px' }}>
        <div className="card-title">적립 산정 — Greedy (큰 단위 우선)</div>
      </div>
      <div className="info-box">
        <strong>알고리즘 공식</strong> — 구매 확정 금액에서 큰 단위(골드)부터 차례로 차감하며 티켓
        수량을 결정합니다.
        <br />
        <code
          style={{
            background: 'var(--surface-2)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          골드 = ⌊금액 / 100,000⌋ → 잔여 = 금액 mod 100,000
        </code>
        <br />
        <code
          style={{
            background: 'var(--surface-2)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          실버 = ⌊잔여 / 50,000⌋ → 잔여 = 잔여 mod 50,000
        </code>
        <br />
        <code
          style={{
            background: 'var(--surface-2)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          브론즈 = ⌊잔여 / 5,000⌋ → 5,000원 미만 잔돈은 지급 안 함
        </code>
      </div>

      <div style={{ fontSize: '13px', fontWeight: 700, margin: '16px 0 10px' }}>검증 예시</div>
      <table>
        <thead>
          <tr>
            <th>구매 확정가</th>
            <th>골드</th>
            <th>실버</th>
            <th>브론즈</th>
            <th>잔여 (무지급)</th>
            <th>총 보상</th>
            <th>총 보상률</th>
          </tr>
        </thead>
        <tbody>
          {verifyRows.map((row) => (
            <tr key={row.amount}>
              <td style={{ fontWeight: 700 }}>{row.amount}</td>
              <td style={{ color: 'var(--text-3)' }}>
                {row.gold === '-' ? (
                  <span style={{ color: 'var(--text-3)' }}>—</span>
                ) : (
                  <TicketChip
                    grade="GOLD"
                    quantity={Number(row.gold)}
                    prefixAfter="장"
                    bare
                    showName={false}
                  />
                )}
              </td>
              <td style={{ color: 'var(--text-3)' }}>
                {row.silver === '-' ? (
                  <span style={{ color: 'var(--text-3)' }}>—</span>
                ) : (
                  <TicketChip
                    grade="SILVER"
                    quantity={Number(row.silver)}
                    prefixAfter="장"
                    bare
                    showName={false}
                  />
                )}
              </td>
              <td style={{ color: 'var(--text-3)' }}>
                {row.bronze === '-' ? (
                  <span style={{ color: 'var(--text-3)' }}>—</span>
                ) : (
                  <TicketChip
                    grade="BRONZE"
                    quantity={Number(row.bronze)}
                    prefixAfter="장"
                    bare
                    showName={false}
                  />
                )}
              </td>
              <td style={{ color: 'var(--text-3)' }}>{row.remain}</td>
              <td style={{ color: 'var(--success)', fontWeight: 700 }}>{row.reward}</td>
              <td>{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card-grid" style={{ marginTop: '16px' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
            잔여 금액 처리
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            브론즈 단위(5,000원) 미만 잔돈은 지급하지 않습니다. 이로 인해 실 보상률은 정책
            보상률(2%)보다 최대 0.18%p 낮을 수 있습니다.
          </div>
        </div>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '14px',
          }}
        >
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
          <div className="card-sub">조회 전용 — 포스트백 수신부터 등급 티켓 확정까지의 흐름</div>
        </div>
        <div>
          <div className="policy-item">
            <div className="policy-label">포스트백 수신 즉시</div>
            <div className="policy-value">
              가지급 랜덤 티켓 1장{' '}
              <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                (유저 화면: 등급 미정)
              </span>{' '}
              → <span style={{ color: 'var(--amber)' }}>적립예정</span>
            </div>
            <div className="policy-desc">
              등급은 구매 금액 기준으로 <strong>내부 확정</strong> — 위 등급별 적립 기준(Greedy)
              적용. 적립률 비공개 정책에 따라 유저 앱에는 확정(연동 D+7 / 미연동 D+30) 전까지
              &lsquo;랜덤(미정)&rsquo;으로 표시해 기대감 부여. 운영자는 회원 목록의
              &lsquo;전환예정&rsquo; 컬럼에서 확정 등급을 미리 확인. 확정 시 등급 티켓으로 전환되어
              기프티콘 교환에 사용.{' '}
              <span style={{ color: 'var(--text-3)' }}>(경품 응모는 별도 이벤트 티켓 전용)</span>
            </div>
          </div>
          <div className="policy-item">
            <div className="policy-label">구매확정 후 — 연동 D+7 / 미연동 D+30</div>
            <div className="policy-value" style={{ color: 'var(--success)' }}>
              사용 가능 전환 + 구매 금액 기준 등급 티켓 지급
            </div>
            <div className="policy-desc">
              적립 확정 대기 = 카카오 연동 회원 D+7 / 미연동 회원 D+30. 로그인 정책 변경으로 미연동
              유저가 부활하여 미연동은 30일 대기 적용. 해당 기간 내 취소 없으면 자동 처리되어 가지급
              랜덤 티켓이 구매 금액 기준 등급 티켓으로 전환.
            </div>
          </div>
          <div className="policy-item">
            <div className="policy-label">취소 / 반품 처리</div>
            <div className="policy-value" style={{ color: 'var(--danger)' }}>
              적립예정 티켓 즉시 회수 + 등급 티켓 미지급
            </div>
            <div className="policy-desc">
              대기 기간 내 취소·반품 감지 시 적립예정 티켓 회수, 등급 티켓 미발행
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
            <div className="policy-label">등급 티켓 유효기간</div>
            <div className="policy-value">적립일(랜덤 티켓 받은 날)로부터 1년</div>
            <div className="policy-desc">
              기산일 = 구매로 랜덤 티켓을 받은 적립일. 적립일 기준 1년 경과 시 만료(등급 확정 D+7
              시점 아님). 만료 30일·7일 전 알림 유지, 기한 경과 시 자동 소멸(복구 불가). 이벤트
              티켓은 발급일+100일 고정 소멸 만료로 별도 처리.
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div className="card-title">티켓 등급 간 교환 정책</div>
          <div className="card-sub">
            조회 전용 — 교환 비율은 등급별 적립 기준(환산가치)에서 자동 산출
          </div>
        </div>
        <div style={{ padding: '18px' }}>
          <div className="info-box" style={{ marginBottom: '16px' }}>
            <strong>단일 등급 결정 + 양방향 교환</strong> — 기프티콘 교환은 단일 등급으로만 가능.
            부족하거나 남는 등급은 자유롭게 교환할 수 있도록 허용. 환산가치가 동일하므로 운영 손익에
            영향 없음.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}
              >
                <span className="tk-chip bronze bare">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="g12" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#C68250" />
                        <stop offset="100%" stopColor="#8B5A2B" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M306.6,106.8l-49.5,49.5,2.4,2.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-2.4-2.4-138.6,138.6c-3.7,3.7-3.7,9.6,0,13.3l75.5,75.5c3.7,3.7,9.6,3.7,13.3,0l138.6-138.6-2.3-2.3c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l2.3,2.3,49.5-49.5c3.7-3.7,3.7-9.6,0-13.3l-75.5-75.5c-3.7-3.7-9.6-3.7-13.3,0ZM335.6,234.8c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM322.9,222.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM310.2,209.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM297.6,196.7c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM284.9,184.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM272.2,171.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7Z"
                      fill="url(#g12)"
                    />
                    <path
                      d="M316.2,155.8l12.1,6.2c.8.4,1.8.3,2.4-.4l9.6-9.6c1.4-1.4,3.8-.2,3.5,1.8l-2.1,13.5c-.1.9.3,1.8,1.1,2.2l12.1,6.2c1.8.9,1.4,3.6-.6,3.9l-13.5,2.1c-.9.1-1.6.8-1.7,1.7l-2.1,13.5c-.3,2-3,2.4-3.9.6l-6.2-12.1c-.4-.8-1.3-1.3-2.2-1.1l-13.5,2.1c-2,.3-3.2-2.1-1.8-3.5l9.6-9.6c.6-.6.8-1.6.4-2.4l-6.2-12.1c-.9-1.8,1-3.7,2.8-2.8Z"
                      fill="rgba(255,255,255,0.95)"
                    />
                    <path
                      d="M180.7,298.9l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2ZM215.3,319.1l-4.7,4.7-31.6-31.6,4.7-4.7,31.6,31.6ZM231.9,296.8c1.9,1.9,1.9,3.9,0,5.8l-9.9,9.9c-1.9,1.9-3.8,1.8-5.7,0l-25.8-25.8c-1.9-1.9-2-3.8-.1-5.7l9.9-9.9c1.9-1.9,3.9-1.9,5.8,0l7.4,7.4-4.7,4.7-6.2-6.2-6.1,6.1,23.5,23.5,6.1-6.1-6.6-6.6,4.7-4.7,7.8,7.8ZM254.4,280l-5.2,5.2-20.1-8.1,14.1,14.1-4.7,4.7-31.6-31.6,4.7-4.7,13.4,13.4-8.1-18.6,5.2-5.2.2.2,8.6,21.4,23.6,9.2ZM269.5,265l-13.1,13.1-31.6-31.6,13-13,4.2,4.2-8.3,8.3,9.2,9.2,7.1-7.1,4.1,4.1-7.1,7.1,9.9,9.9,8.4-8.4,4.2,4.2ZM259,220.6l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2Z"
                      fill="rgba(255,255,255,0.95)"
                    />
                  </svg>
                  <span>브론즈 10장</span>
                </span>
                <span style={{ fontSize: '16px', color: 'var(--text-2)' }}>⇄</span>
                <span className="tk-chip silver bare">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="g13" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#D8D8D8" />
                        <stop offset="100%" stopColor="#999999" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M306.6,106.8l-49.5,49.5,2.4,2.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-2.4-2.4-138.6,138.6c-3.7,3.7-3.7,9.6,0,13.3l75.5,75.5c3.7,3.7,9.6,3.7,13.3,0l138.6-138.6-2.3-2.3c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l2.3,2.3,49.5-49.5c3.7-3.7,3.7-9.6,0-13.3l-75.5-75.5c-3.7-3.7-9.6-3.7-13.3,0ZM335.6,234.8c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM322.9,222.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM310.2,209.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM297.6,196.7c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM284.9,184.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM272.2,171.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7Z"
                      fill="url(#g13)"
                    />
                    <path
                      d="M316.2,155.8l12.1,6.2c.8.4,1.8.3,2.4-.4l9.6-9.6c1.4-1.4,3.8-.2,3.5,1.8l-2.1,13.5c-.1.9.3,1.8,1.1,2.2l12.1,6.2c1.8.9,1.4,3.6-.6,3.9l-13.5,2.1c-.9.1-1.6.8-1.7,1.7l-2.1,13.5c-.3,2-3,2.4-3.9.6l-6.2-12.1c-.4-.8-1.3-1.3-2.2-1.1l-13.5,2.1c-2,.3-3.2-2.1-1.8-3.5l9.6-9.6c.6-.6.8-1.6.4-2.4l-6.2-12.1c-.9-1.8,1-3.7,2.8-2.8Z"
                      fill="rgba(50,50,50,0.75)"
                    />
                    <path
                      d="M180.7,298.9l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2ZM215.3,319.1l-4.7,4.7-31.6-31.6,4.7-4.7,31.6,31.6ZM231.9,296.8c1.9,1.9,1.9,3.9,0,5.8l-9.9,9.9c-1.9,1.9-3.8,1.8-5.7,0l-25.8-25.8c-1.9-1.9-2-3.8-.1-5.7l9.9-9.9c1.9-1.9,3.9-1.9,5.8,0l7.4,7.4-4.7,4.7-6.2-6.2-6.1,6.1,23.5,23.5,6.1-6.1-6.6-6.6,4.7-4.7,7.8,7.8ZM254.4,280l-5.2,5.2-20.1-8.1,14.1,14.1-4.7,4.7-31.6-31.6,4.7-4.7,13.4,13.4-8.1-18.6,5.2-5.2.2.2,8.6,21.4,23.6,9.2ZM269.5,265l-13.1,13.1-31.6-31.6,13-13,4.2,4.2-8.3,8.3,9.2,9.2,7.1-7.1,4.1,4.1-7.1,7.1,9.9,9.9,8.4-8.4,4.2,4.2ZM259,220.6l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2Z"
                      fill="rgba(50,50,50,0.75)"
                    />
                  </svg>
                  <span>실버 1장</span>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-2)', lineHeight: '1.5' }}>
                양방향 등가 교환. 브론즈를 모아 실버로 승급하거나, 실버를 풀어 저가 라인 교환에 사용
                가능.
              </div>
            </div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}
              >
                <span className="tk-chip silver bare">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="g14" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#D8D8D8" />
                        <stop offset="100%" stopColor="#999999" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M306.6,106.8l-49.5,49.5,2.4,2.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-2.4-2.4-138.6,138.6c-3.7,3.7-3.7,9.6,0,13.3l75.5,75.5c3.7,3.7,9.6,3.7,13.3,0l138.6-138.6-2.3-2.3c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l2.3,2.3,49.5-49.5c3.7-3.7,3.7-9.6,0-13.3l-75.5-75.5c-3.7-3.7-9.6-3.7-13.3,0ZM335.6,234.8c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM322.9,222.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM310.2,209.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM297.6,196.7c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM284.9,184.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM272.2,171.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7Z"
                      fill="url(#g14)"
                    />
                    <path
                      d="M316.2,155.8l12.1,6.2c.8.4,1.8.3,2.4-.4l9.6-9.6c1.4-1.4,3.8-.2,3.5,1.8l-2.1,13.5c-.1.9.3,1.8,1.1,2.2l12.1,6.2c1.8.9,1.4,3.6-.6,3.9l-13.5,2.1c-.9.1-1.6.8-1.7,1.7l-2.1,13.5c-.3,2-3,2.4-3.9.6l-6.2-12.1c-.4-.8-1.3-1.3-2.2-1.1l-13.5,2.1c-2,.3-3.2-2.1-1.8-3.5l9.6-9.6c.6-.6.8-1.6.4-2.4l-6.2-12.1c-.9-1.8,1-3.7,2.8-2.8Z"
                      fill="rgba(50,50,50,0.75)"
                    />
                    <path
                      d="M180.7,298.9l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2ZM215.3,319.1l-4.7,4.7-31.6-31.6,4.7-4.7,31.6,31.6ZM231.9,296.8c1.9,1.9,1.9,3.9,0,5.8l-9.9,9.9c-1.9,1.9-3.8,1.8-5.7,0l-25.8-25.8c-1.9-1.9-2-3.8-.1-5.7l9.9-9.9c1.9-1.9,3.9-1.9,5.8,0l7.4,7.4-4.7,4.7-6.2-6.2-6.1,6.1,23.5,23.5,6.1-6.1-6.6-6.6,4.7-4.7,7.8,7.8ZM254.4,280l-5.2,5.2-20.1-8.1,14.1,14.1-4.7,4.7-31.6-31.6,4.7-4.7,13.4,13.4-8.1-18.6,5.2-5.2.2.2,8.6,21.4,23.6,9.2ZM269.5,265l-13.1,13.1-31.6-31.6,13-13,4.2,4.2-8.3,8.3,9.2,9.2,7.1-7.1,4.1,4.1-7.1,7.1,9.9,9.9,8.4-8.4,4.2,4.2ZM259,220.6l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2Z"
                      fill="rgba(50,50,50,0.75)"
                    />
                  </svg>
                  <span>실버 2장</span>
                </span>
                <span style={{ fontSize: '16px', color: 'var(--text-2)' }}>⇄</span>
                <span className="tk-chip gold bare">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="g15" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFD93B" />
                        <stop offset="100%" stopColor="#E6A800" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M306.6,106.8l-49.5,49.5,2.4,2.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-2.4-2.4-138.6,138.6c-3.7,3.7-3.7,9.6,0,13.3l75.5,75.5c3.7,3.7,9.6,3.7,13.3,0l138.6-138.6-2.3-2.3c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l2.3,2.3,49.5-49.5c3.7-3.7,3.7-9.6,0-13.3l-75.5-75.5c-3.7-3.7-9.6-3.7-13.3,0ZM335.6,234.8c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM322.9,222.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM310.2,209.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM297.6,196.7c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM284.9,184.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM272.2,171.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7Z"
                      fill="url(#g15)"
                    />
                    <path
                      d="M316.2,155.8l12.1,6.2c.8.4,1.8.3,2.4-.4l9.6-9.6c1.4-1.4,3.8-.2,3.5,1.8l-2.1,13.5c-.1.9.3,1.8,1.1,2.2l12.1,6.2c1.8.9,1.4,3.6-.6,3.9l-13.5,2.1c-.9.1-1.6.8-1.7,1.7l-2.1,13.5c-.3,2-3,2.4-3.9.6l-6.2-12.1c-.4-.8-1.3-1.3-2.2-1.1l-13.5,2.1c-2,.3-3.2-2.1-1.8-3.5l9.6-9.6c.6-.6.8-1.6.4-2.4l-6.2-12.1c-.9-1.8,1-3.7,2.8-2.8Z"
                      fill="rgba(255,255,255,0.95)"
                    />
                    <path
                      d="M180.7,298.9l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2ZM215.3,319.1l-4.7,4.7-31.6-31.6,4.7-4.7,31.6,31.6ZM231.9,296.8c1.9,1.9,1.9,3.9,0,5.8l-9.9,9.9c-1.9,1.9-3.8,1.8-5.7,0l-25.8-25.8c-1.9-1.9-2-3.8-.1-5.7l9.9-9.9c1.9-1.9,3.9-1.9,5.8,0l7.4,7.4-4.7,4.7-6.2-6.2-6.1,6.1,23.5,23.5,6.1-6.1-6.6-6.6,4.7-4.7,7.8,7.8ZM254.4,280l-5.2,5.2-20.1-8.1,14.1,14.1-4.7,4.7-31.6-31.6,4.7-4.7,13.4,13.4-8.1-18.6,5.2-5.2.2.2,8.6,21.4,23.6,9.2ZM269.5,265l-13.1,13.1-31.6-31.6,13-13,4.2,4.2-8.3,8.3,9.2,9.2,7.1-7.1,4.1,4.1-7.1,7.1,9.9,9.9,8.4-8.4,4.2,4.2ZM259,220.6l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2Z"
                      fill="rgba(255,255,255,0.95)"
                    />
                  </svg>
                  <span>골드 1장</span>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-2)', lineHeight: '1.5' }}>
                양방향 등가 교환. 실버 모아 골드 승급 가능. 골드를 풀어 중·저가 라인 활용도 가능.
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: '14px',
              padding: '12px 14px',
              background: 'rgba(132,94,238,.05)',
              border: '1px solid var(--main-line)',
              borderRadius: '8px',
              fontSize: '11.5px',
              color: 'var(--text-2)',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--text)' }}>환산가치 기준</strong> — 브론즈 100원 / 실버
            1,000원 / 골드 2,000원. 교환 비율은 환산가치 1:1 등가이므로 어느 방향으로 교환해도 보유
            가치는 동일하게 유지됩니다.
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div className="card-title">기프티콘 교환 카탈로그 (단일 등급)</div>
          <div className="card-sub">조회 전용 — 상품·교환 티켓은 기프티콘 상품목록에서 관리</div>
        </div>
        <div style={{ padding: '18px' }}>
          <div className="info-box" style={{ marginBottom: '16px' }}>
            <strong>설계 원칙</strong> — 티켓 환산가치(브론즈 100원·실버 1,000원·골드 2,000원)에
            대해 약 <strong style={{ color: 'var(--success)' }}>10% 마진</strong>을 책정. 마진은
            기프티콘 도매가 + 운영비를 커버하는 정상 범위입니다.
            <br />
            <strong style={{ color: 'var(--text)' }}>평균 마진:</strong> 약 +10% &nbsp;|&nbsp;{' '}
            <strong style={{ color: 'var(--text)' }}>교환 방식:</strong> 단일 등급만 사용 (등급 간
            사전 교환은 위 정책 참조)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {catalogGroups.map((group) => (
              <div
                key={group.grade}
                style={{
                  background:
                    group.grade === 'bronze'
                      ? 'rgba(184,134,93,.08)'
                      : group.grade === 'silver'
                        ? 'rgba(192,192,192,.08)'
                        : 'rgba(255,209,102,.08)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: '13px', fontWeight: 700, color: `var(--${group.grade})` }}
                    >
                      {group.label}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-2)' }}>{group.subLabel}</div>
                  </div>
                </div>
                <table style={{ fontSize: '11px' }}>
                  <thead>
                    <tr>
                      <th>티켓</th>
                      <th>기프티콘</th>
                      <th>시가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <TicketChip
                            grade={group.grade.toUpperCase() as TicketGrade}
                            quantity={item.qty}
                            prefixAfter="장"
                            bare
                            showName={false}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'right', color: 'var(--text-2)' }}>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '10.5px',
                    color: 'var(--text-2)',
                    lineHeight: 1.5,
                    background: 'var(--surface)',
                    borderRadius: '6px',
                    padding: '8px',
                  }}
                >
                  {group.note}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              background: 'var(--surface-2)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
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
                  등급 간 사전 교환
                </div>
                <div style={{ color: 'var(--success)', fontWeight: 600 }}>
                  양방향 가능 (위 정책)
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-2)', marginBottom: '4px', fontSize: '11px' }}>
                  부분 환불
                </div>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>티켓 회수 불가</div>
              </div>
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
            <label
              htmlFor="op-policy-tk-sim"
              style={{
                fontSize: '11px',
                color: 'var(--text-2)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '.4px',
              }}
            >
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
            {/* <div className="form-hint">최대 {MAX_SIM_AMOUNT.toLocaleString()}원까지 계산 가능</div> */}
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSimulate}>
            계산
          </button>
        </div>
        {simResult && (
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
              {simAmount.toLocaleString()}원 구매 시 지급
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {simResult.gold > 0 && (
                <span className="tk-gold" style={{ marginRight: '6px' }}>
                  골드 {simResult.gold}장
                </span>
              )}
              {simResult.silver > 0 && (
                <span className="tk-silver" style={{ marginRight: '6px' }}>
                  실버 {simResult.silver}장
                </span>
              )}
              {simResult.bronze > 0 && (
                <span className="tk-bronze" style={{ marginRight: '6px' }}>
                  브론즈 {simResult.bronze}장
                </span>
              )}
              {simResult.gold === 0 && simResult.silver === 0 && simResult.bronze === 0 && (
                <span style={{ color: 'var(--text-2)' }}>지급 티켓 없음 (5,000원 미만)</span>
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
                  {simResult.reward.toLocaleString()}원
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-2)', marginBottom: '2px' }}>실 보상률</div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{simResult.rate}%</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-2)', marginBottom: '2px' }}>잔여 (무지급)</div>
                <div style={{ color: 'var(--text-2)', fontWeight: 700, fontSize: '14px' }}>
                  {simResult.remainder.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
