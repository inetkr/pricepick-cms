import React from 'react';
import { StatCard } from 'src/components/common/stat-card';
import type { IGiftiRevenueByPeriod } from 'src/types/revenue/revenue_gifti';
import { gsN, gsTicketStatSub, gsWon } from 'src/utils/revenue-gifti';

// The by_period response's total, as-is — no separate summary call (the same value isn't computed twice)
type IGiftiRevenueStatTotal = IGiftiRevenueByPeriod['total'];

interface RevenueGiftiStatsProps {
  summary: IGiftiRevenueStatTotal | null;
  // The range currently being viewed — if drilled down, shows that position (e.g. 2026-08 · 2026-08-14)
  scopeLabel: string;
}

/* Three cards answer this screen's question — how many sold, how much did it come
   to, how many were cancelled along the way. Uses by_period's `total` (the sum
   across the whole query range, grouped as MONTH) as-is — no separate summary call.
   The won conversion is exactly what the server computed from settings/ticket_value
   alone. cancelled_count is shown as-received and never folded into sold_count/
   total_won — those two already exclude it on the server side. */
export const RevenueGiftiStats: React.FC<RevenueGiftiStatsProps> = ({ summary, scopeLabel }) => {
  const dash = '—';

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
      <StatCard
        color="blue"
        label="판매 건수"
        value={summary ? `${gsN(summary.sold_count)}건` : dash}
        change={{ type: 'neutral', text: scopeLabel || dash }}
      />
      <StatCard
        color="purple"
        label="원화 환산액"
        value={summary ? gsWon(summary.total_won) : dash}
        change={{
          type: 'neutral',
          text: summary ? gsTicketStatSub(summary.tickets_used) : dash,
        }}
      />
      <StatCard
        color="amber"
        label="취소 건수"
        value={summary ? `${gsN(summary.cancelled_count)}건` : dash}
        change={{ type: 'neutral', text: '매출에서 뺀 건' }}
      />
    </div>
  );
};
