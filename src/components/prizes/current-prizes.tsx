// src/components/prizes/CurrentPrizes.tsx
import React from 'react';

interface PrizeLevel {
  level: string;
  name: string;
  probability: string;
  maxPerDay: string;
  color: 'gold' | 'silver' | 'bronze';
}

interface CurrentPrizesProps {
  prizes: PrizeLevel[];
  onEdit?: () => void;
}

export const CurrentPrizes: React.FC<CurrentPrizesProps> = ({ prizes, onEdit }) => {
  const colorMap = {
    gold: { bg: 'rgba(255,215,0,.15)', border: 'rgba(255,215,0,.3)', text: 'var(--gold)' },
    silver: { bg: 'rgba(192,192,192,.15)', border: 'rgba(192,192,192,.3)', text: 'var(--silver)' },
    bronze: { bg: 'rgba(205,127,50,.15)', border: 'rgba(205,127,50,.3)', text: 'var(--bronze)' },
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">현재 경품 설정</div>
        {onEdit && (
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>
            수정
          </button>
        )}
      </div>
      <div style={{ padding: '16px' }}>
        {prizes.map((prize, idx) => {
          const colors = colorMap[prize.color];
          return (
            <div
              key={idx}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 'var(--r-md)',
                padding: '14px',
                marginBottom: idx < prizes.length - 1 ? '10px' : '0',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-2)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
              >
                {prize.level}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>
                {prize.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--amber)' }}>
                당첨 확률 {prize.probability} · 하루 최대 {prize.maxPerDay}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
