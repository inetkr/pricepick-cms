// src/components/point-policy/ExchangeRateCard.tsx
import React from 'react';

export interface ExchangeRate {
  grade: 'bronze' | 'silver' | 'gold';
  pointsToTicket: string;
  ticketToPoints: string;
  usdValue: string;
}

interface ExchangeRateCardProps {
  data: ExchangeRate[];
}

const gradeLabels = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
};

export const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">포인트 → 티켓 교환 비율</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>등급</th>
            <th style={{ textAlign: 'center' }}>포인트 → 티켓</th>
            <th style={{ textAlign: 'center' }}>티켓 → 포인트</th>
            <th style={{ textAlign: 'center' }}>원화 환산</th>
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
