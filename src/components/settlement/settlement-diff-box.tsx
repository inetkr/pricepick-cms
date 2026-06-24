import React from 'react';

interface DiffReason {
  label: string;
  description: string;
}

interface SettlementDiffBoxProps {
  title?: string;
  reasons: DiffReason[];
}

export const SettlementDiffBox: React.FC<SettlementDiffBoxProps> = ({
  title = '차액 사유 (이번달)',
  reasons,
}) => {
  if (!reasons.length) return null;

  return (
    <div
      style={{
        marginTop: '4px',
        padding: '14px 16px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        fontSize: '12px',
        color: 'var(--text-2)',
        lineHeight: '1.7',
      }}
    >
      <strong style={{ color: 'var(--text)' }}>{title}</strong>
      {reasons.map((reason, idx) => (
        <span key={idx}>
          &nbsp;—&nbsp; <strong>{reason.label}</strong> {reason.description}
          {idx < reasons.length - 1 && ' &nbsp;/&nbsp; '}
        </span>
      ))}
    </div>
  );
};
