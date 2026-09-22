'use client';

import React from 'react';
import { RevenueGiftiDrill } from 'src/components/revenue-gifti/revenue-gifti-drill';
import { RevenueGiftiStats } from 'src/components/revenue-gifti/revenue-gifti-stats';
import { RevenueGiftiTableCard } from 'src/components/revenue-gifti/revenue-gifti-table-card';
import { RevenueGiftiToolbar } from 'src/components/revenue-gifti/revenue-gifti-toolbar';
import { useRevenueGifti } from 'src/sections/revenue-gifti/hooks/use-revenue-gifti';

/* Gifti Shop sales revenue — only two things to answer.
     Which month sold most      Monthly table
     How much sold per day      Daily table (drilled into a month), per-order table (drilled into a day)
   The query range is picked in one place at the top only — if cards and tables each
   picked their own range, the numbers above and below would drift apart.
   With from/to left empty in custom-range (range) mode, it reads as "전체" (all) and
   shows the full history right from the start.
   No separate call for the stat cards — they reuse the `total` that by_period returns. */
export const RevenueGiftiSection: React.FC = () => {
  const gs = useRevenueGifti();

  // Subtext for the stat cards' first card (sale count) — the drilled-down month/day
  // if there is one, otherwise the current query range (a dash if day/month mode
  // hasn't been picked yet)
  const scopeLabel = gs.drill.day || gs.drill.month || (gs.hasRange ? gs.appliedPeriodLabel : '—');

  const drillLabel =
    gs.drill.level === 'detail'
      ? `월별 내역 › ${gs.drill.month} › ${gs.drill.day}`
      : `월별 내역 › ${gs.drill.month}`;

  return (
    <div className="section active" id="sec-revenue-gifti">
      <RevenueGiftiToolbar
        mode={gs.periodMode}
        onModeChange={gs.setPeriodMode}
        day={gs.dayValue}
        onDayChange={gs.setDayValue}
        month={gs.monthValue}
        onMonthChange={gs.setMonthValue}
        from={gs.fromValue}
        onFromChange={gs.setFromValue}
        to={gs.toValue}
        onToChange={gs.setToValue}
        onReload={gs.reload}
        periodLabel={gs.periodLabel}
      />

      <RevenueGiftiStats summary={gs.summary} scopeLabel={scopeLabel} />

      {gs.drill.level !== 'month' && <RevenueGiftiDrill label={drillLabel} onUp={gs.drillUp} />}

      <RevenueGiftiTableCard
        drill={gs.drill}
        view={gs.view}
        onViewChange={gs.changeView}
        rows={gs.rows}
        periodCount={gs.periodCount}
        isPeriodLoading={gs.isPeriodLoading}
        onDrill={gs.drillInto}
        orders={gs.orders}
        ordersCount={gs.ordersCount}
        isOrdersLoading={gs.isOrdersLoading}
        ordersPage={gs.ordersPage}
        ordersTotalPages={gs.ordersTotalPages}
        onOrdersPageChange={gs.setOrdersPage}
      />
    </div>
  );
};
