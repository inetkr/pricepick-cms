import React from 'react';

const FLOW_STEPS = [
  { emoji: '📱', title: '탈퇴 확인', desc: '앱 마이페이지 → 최종 확인' },
  {
    emoji: '🗑️',
    title: '즉시 처리',
    desc: 'status 전환 · PII 스크랩 · 기기 로컬데이터 삭제',
    danger: true,
  },
  { emoji: '📄', title: '거래 기록 존치', desc: '티켓·결제 기록은 레코드 유지 · 5년 보관' },
];

export const WithdrawalFlowCard: React.FC = () => (
  <div className="card" style={{ marginBottom: '16px' }}>
    <div className="card-header">
      <div className="card-title">탈퇴 처리 흐름</div>
    </div>
    <div
      style={{ display: 'flex', alignItems: 'stretch', gap: 0, padding: '18px', flexWrap: 'wrap' }}
    >
      {FLOW_STEPS.map((step, i) => (
        <React.Fragment key={step.title}>
          {i > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                color: 'var(--text-3)',
                fontSize: '18px',
              }}
            >
              →
            </div>
          )}
          <div
            style={{
              flex: 1,
              minWidth: '130px',
              background: step.danger ? 'var(--danger-soft)' : 'var(--surface-2)',
              border: step.danger ? '1px solid rgba(220,38,38,.2)' : '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: '14px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{step.emoji}</div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '3px',
                color: step.danger ? 'var(--danger)' : undefined,
              }}
            >
              {step.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>{step.desc}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);
