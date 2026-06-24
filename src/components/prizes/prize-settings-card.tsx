import React from 'react';

interface PrizeLevel {
  level: string;
  name: string;
  probability: string;
  dailyMax: string;
}

interface PrizeSettingsCardProps {
  prizes: PrizeLevel[];
  onEdit: () => void;
}

export const PrizeSettingsCard: React.FC<PrizeSettingsCardProps> = ({ prizes, onEdit }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">현재 경품 설정</div>
        <button className="btn btn-ghost btn-sm" onClick={onEdit}>
          수정
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        {prizes.map((prize, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
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
              {prize.probability} · 하루 최대 {prize.dailyMax}명
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
