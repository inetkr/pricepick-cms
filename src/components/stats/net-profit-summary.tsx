import React from 'react';

interface ProfitItem {
  label: string;
  amount: string;
  color?: 'success' | 'amber';
}

interface NetProfitSummaryProps {
  items: ProfitItem[];
  total: {
    label: string;
    amount: string;
  };
  margin?: string;
}

export const NetProfitSummary: React.FC<NetProfitSummaryProps> = ({ items, total, margin }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">순수익 종합</div>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>이번달 손익 요약</span>
      </div>
      <table>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.label}</td>
              <td
                style={{
                  color: item.color === 'success' ? 'var(--success)' : 'var(--amber)',
                  fontWeight: 600,
                }}
              >
                {item.amount}
              </td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid var(--border)' }}>
            <td style={{ fontWeight: 700 }}>{total.label}</td>
            <td style={{ fontWeight: 800, fontSize: '15px', color: 'var(--success)' }}>
              {total.amount}
            </td>
          </tr>
          {margin && (
            <tr>
              <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>순수익률 (총수익 대비)</td>
              <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{margin}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
