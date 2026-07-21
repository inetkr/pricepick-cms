import React from 'react';

export const NotificationLimitPolicyCard: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">
        FCM 푸시 발송 상한 정책{' '}
        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
          정책 확정
        </span>
      </div>
    </div>
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
        <div className="policy-item">
          <div className="policy-label">거래 알림 (구매·확정·환불)</div>
          <div className="policy-value">상한 없음</div>
          <div className="policy-desc">서비스 필수 알림 → 발송 제한 없음.</div>
        </div>
        <div className="policy-item">
          <div className="policy-label">기타 알림 (미션·만료·추첨)</div>
          <div className="policy-value">일 2건</div>
          <div className="policy-desc">1인 1일 최대 2건.</div>
        </div>
        <div className="policy-item">
          <div className="policy-label">야간 발송</div>
          <div className="policy-value">22:00~08:00 미발송</div>
          <div className="policy-desc">야간 시간대 푸시 발송 차단.</div>
        </div>
      </div>
    </div>
  </div>
);
