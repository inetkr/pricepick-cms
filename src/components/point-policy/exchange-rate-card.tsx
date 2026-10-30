// src/components/point-policy/ExchangeRateCard.tsx
import React from 'react';
import type { IConversionRates } from 'src/types/points/conversion_rate';
import { TicketChipOnlyName } from '../common/ticket-chip';

interface ExchangeRateCardProps {
  data: IConversionRates | null;
  exchangeRate: { point: number; won: number };
}

export const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ data, exchangeRate }) => {
  const isTicketToPointEnabled = data?.is_ticket_to_point_enabled ?? false;
  // 티켓 단일화 — TICKET 비율이 오면 그 줄만 적는다. 단일화 전 등급 줄(BRONZE 등)이 함께 와도
  // 「티켓」이 여러 줄로 겹쳐 보이지 않게 한다.
  const allRates = data?.rates ?? [];
  const rates = allRates.some((r) => r.ticket_type === 'TICKET')
    ? allRates.filter((r) => r.ticket_type === 'TICKET')
    : allRates;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">포인트 ↔ 티켓 구매 비율</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>종류</th>
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
                  <TicketChipOnlyName grade={item.ticket_type} bare />
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
