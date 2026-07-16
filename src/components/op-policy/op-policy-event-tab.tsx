import React from 'react';

const acquisitionRows = [
  { path: '출석체크', reward: '이벤트 티켓 1장', condition: '5일 연속 출석 달성 시' },
  { path: '룰렛', reward: '포인트·이벤트 티켓 (확률 미정)', condition: '하루 1회 / 확률 지급' },
  { path: '온보딩 가입', reward: '+1장', condition: '신규 가입 시 (카카오 연동 후 지급)' },
];

const referralRows = [
  { label: '성사 기준', value: '피초대자의 첫 픽구매 완료' },
  { label: '인당 초대 한도', value: '월 최대 50명' },
  { label: '초대자 보상', value: '성사 건당 500P (포인트)' },
  {
    label: '피초대자 보상',
    value: '500P (포인트) — 성사(첫 픽구매 완료) 시점에 지급, 가입 즉시 아님',
  },
];

const limitRows = [
  { label: '1일 발급 한도', value: '5장 / 일' },
  { label: '월 발급 한도', value: '30장 / 월' },
  { label: '1회 추첨 응모 한도', value: '최대 10장' },
];

const onboardingRows = [
  { label: '가입 즉시', value: '이벤트 티켓 1장 + 200P' },
  { label: '첫 쿠팡 구경하기', value: '100P' },
  { label: '첫 경제 구매 (7일 내)', value: '브론즈 티켓 1장' },
  { label: '친구초대', value: '양쪽 각 500P' },
];

const drawRows = [
  { label: '응모 조건', value: '이벤트 티켓 1장, 1회 추첨 최대 10장' },
  { label: '당첨 확률', value: '1등 5% · 2등 15% · 3등(꽝) 80%' },
];

export const OpPolicyEventTab: React.FC = () => (
  <div>
    <div className="info-box">
      <strong>정책 확정 반영</strong> — 이벤트 티켓 획득 경로·만료·한도 및 친구초대·온보딩 보상 확정
      적용. <span style={{ color: 'var(--amber)' }}>경품 추첨 주기(월1/격주)만 미정.</span>
    </div>

    <div className="card-header">
      <div className="card-title">
        이벤트 티켓 획득 경로{' '}
        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
          정책 확정
        </span>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>경로</th>
          <th>지급</th>
          <th>조건</th>
        </tr>
      </thead>
      <tbody>
        {acquisitionRows.map((row) => (
          <tr key={row.path}>
            <td>{row.path}</td>
            <td>{row.reward}</td>
            <td style={{ color: 'var(--text-2)' }}>{row.condition}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="info-box" style={{ marginTop: '12px' }}>
      이벤트 티켓은 <strong>경품 응모 전용</strong>(상품 교환 불가)이며, 만료는{' '}
      <strong>발급일+100일 고정 소멸</strong> 방식입니다 — 이월은 없으며 미응모해도 다음 회차로
      넘어가지 않고 만료됩니다. 추첨 응모 마감 후 획득분은 다음 회차가 당회.{' '}
      <span style={{ color: 'var(--text-3)' }}>(친구초대·광고시청은 포인트 경로로 이동)</span>
    </div>

    <div className="card-header" style={{ marginTop: '18px' }}>
      <div className="card-title">
        이벤트 티켓 발급·응모 한도{' '}
        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
          정책 확정
        </span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      <div className="policy-item">
        <div className="policy-label">초대 성사 기준</div>
        <div className="policy-value">피초대자 첫 픽구매 완료</div>
        <div className="policy-desc">가입만으로는 미성사. 첫 픽구매 완료 시점에 성사 처리.</div>
      </div>
      <div className="policy-item">
        <div className="policy-label">초대자 월 한도</div>
        <div className="policy-value">월 최대 50명</div>
        <div className="policy-desc">성사 기준. 자기 초대·동일 IP/기기 차단.</div>
      </div>
      <div className="policy-item">
        <div className="policy-label">초대자 보상</div>
        <div className="policy-value">성사 건당 500P (포인트)</div>
        <div className="policy-desc">성사 시점에 지급. (이벤트 티켓 → 포인트로 변경)</div>
      </div>
      <div className="policy-item">
        <div className="policy-label">피초대자 보상</div>
        <div className="policy-value">500P (포인트)</div>
        <div className="policy-desc">성사(첫 픽구매 완료) 시점에 지급 — 가입 즉시 아님.</div>
      </div>
    </div>
    <div className="card-header" style={{ marginTop: '18px' }}>
      <div className="card-title">
        이벤트 티켓 발급·응모 한도{' '}
        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
          정책 확정
        </span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
      <div className="policy-item">
        <div className="policy-label">1일 발급 한도</div>
        <div className="policy-value">5장 / 일</div>
        <div className="policy-desc">
          이벤트 티켓 신규 상한. (구매 적립 랜덤 티켓 1일 5/월 50과 별도)
        </div>
      </div>
      <div className="policy-item">
        <div className="policy-label">월 발급 한도</div>
        <div className="policy-value">30장 / 월</div>
        <div className="policy-desc">매월 1일 00:00 초기화.</div>
      </div>
      <div className="policy-item">
        <div className="policy-label">1회 추첨 응모 한도</div>
        <div className="policy-value">최대 10장</div>
        <div className="policy-desc">단일 추첨 회차에 응모 가능한 최대 매수.</div>
      </div>
    </div>
    <div className="card-header" style={{ marginTop: '18px' }}>
      <div className="card-title">
        온보딩 보상{' '}
        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
          정책 확정
        </span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      <div className="policy-item">
        <div className="policy-label">가입 즉시</div>
        <div className="policy-value">이벤트 티켓 1장 + 200P</div>
        <div className="policy-desc">
          어뷰징 방지 — 이벤트 티켓·브론즈 보너스는 카카오 연동 후 지급.
        </div>
      </div>
      <div className="policy-item">
        <div className="policy-label">첫 쿠팡 구경하기</div>
        <div className="policy-value">100P</div>
        <div className="policy-desc">최초 쿠팡 경유 방문 시 지급.</div>
      </div>
      <div className="policy-item">
        <div className="policy-label">첫 경유 구매 (가입 7일 내)</div>
        <div className="policy-value">브론즈 티켓 1장</div>
        <div className="policy-desc">
          구매 확정 후 지급 (연동 D+7 / 미연동 D+30, 취소 먹튀 방지).
        </div>
      </div>
      <div className="policy-item">
        <div className="policy-label">친구초대</div>
        <div className="policy-value">양쪽 각 500P</div>
        <div className="policy-desc">피초대자 첫 픽구매 성사 시 양쪽 지급.</div>
      </div>
    </div>
    <div className="card-header" style={{ marginTop: '18px' }}>
      <div className="card-title">경품 응모 규칙</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      <div className="policy-item">
        <div className="policy-label">응모 조건</div>
        <div className="policy-value">이벤트 티켓 1장 · 1회 추첨 최대 10장</div>
        <div className="policy-desc">
          추첨 회차 기준. 추첨 주기(월1/격주)는 미정 — 운영 회의 후 확정.
        </div>
      </div>
      <div className="policy-item">
        <div className="policy-label">당첨 확률</div>
        <div className="policy-value">1등 5% · 2등 15% · 3등(꽝) 80%</div>
        <div className="policy-desc">등급별 경품·확률은 경품/응모 관리에서 운영.</div>
      </div>
    </div>
  </div>
);
