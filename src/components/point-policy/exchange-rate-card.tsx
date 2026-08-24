// src/components/point-policy/ExchangeRateCard.tsx
import React from 'react';
import type { IConversionRateItem, IConversionRates } from 'src/types/points/conversion_rate';

interface ExchangeRateCardProps {
  data: IConversionRates | null;
  exchangeRate: { point: number; won: number };
}

const gradeLabels: Record<IConversionRateItem['ticket_type'], string> = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
};

const gradeOrder: IConversionRateItem['ticket_type'][] = ['BRONZE', 'SILVER', 'GOLD'];

export const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ data, exchangeRate }) => {
  const isTicketToPointEnabled = data?.is_ticket_to_point_enabled ?? false;
  const rates = [...(data?.rates ?? [])].sort(
    (a, b) => gradeOrder.indexOf(a.ticket_type) - gradeOrder.indexOf(b.ticket_type)
  );

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
            <th style={{ textAlign: 'center' }}>티켓 → 포인트 (중단)</th>
            <th style={{ textAlign: 'center' }}>원화 환산</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((item) => {
            const wonValue =
              exchangeRate.point > 0
                ? (item.point_amount * exchangeRate.won) / exchangeRate.point
                : 0;

            return (
              <tr key={item.ticket_type}>
                <td>
                  <span className={`tk-chip ${item.ticket_type.toLowerCase()} bare`}>
                    {gradeLabels[item.ticket_type]}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {`${item.point_amount.toLocaleString()}P → ${item.ticket_amount}장`}
                </td>
                {isTicketToPointEnabled ? (
                  <td style={{ textAlign: 'center' }}>
                    {`${item.ticket_amount}장 → ${item.point_amount.toLocaleString()}P`}
                  </td>
                ) : (
                  <td style={{ textAlign: 'center', color: 'var(--text-3)' }}>중단</td>
                )}
                <td style={{ textAlign: 'center', color: 'var(--text-2)' }}>
                  {`${wonValue.toLocaleString()}원`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
