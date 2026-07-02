import React from 'react';

export interface ExchangeRate {
  grade: 'bronze' | 'silver' | 'gold';
  pointsToTicket: string;
  ticketToPoints: string;
  usdValue: string;
}

interface ExchangeRateTableProps {
  data: ExchangeRate[];
  title?: string;
  onEdit?: () => void;
}

const gradeLabels = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
};

export const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({
  data,
  title = '포인트 ↔ 티켓 교환 비율',
  onEdit,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        {onEdit && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
            수정
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>등급</th>
            <th>포인트 → 티켓</th>
            <th>티켓 → 포인트</th>
            <th>원화 환산</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.grade}>
              <td>
                <span className={`tk-chip ${item.grade} bare`}>{gradeLabels[item.grade]}</span>
              </td>
              <td style={{ textAlign: 'center' }}>{item.pointsToTicket}</td>
              <td style={{ textAlign: 'center' }}>{item.ticketToPoints}</td>
              <td style={{ textAlign: 'center', color: 'var(--text-2)' }}>{item.usdValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
