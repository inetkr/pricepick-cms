'use client';

import React from 'react';
import { RevenueGiftiDetailRows } from 'src/components/revenue-gifti/revenue-gifti-detail-table';
import { RevenueGiftiPagination } from 'src/components/revenue-gifti/revenue-gifti-pagination';
import { RevenueGiftiPeriodRows } from 'src/components/revenue-gifti/revenue-gifti-period-table';
import type {
  IGiftiRevenueDrill,
  IGiftiRevenueOrder,
  IGiftiRevenuePeriodRow,
  IGiftiRevenueView,
} from 'src/types/revenue/revenue_gifti';
import { gsN } from 'src/utils/revenue-gifti';

interface RevenueGiftiTableCardProps {
  drill: IGiftiRevenueDrill;
  view: IGiftiRevenueView;
  onViewChange: (view: IGiftiRevenueView) => void;
  rows: IGiftiRevenuePeriodRow[];
  // The period count the server counted — the subtitle uses this value (not recounted via rows.length)
  periodCount: number;
  isPeriodLoading: boolean;
  onDrill: (row: IGiftiRevenuePeriodRow) => void;
  orders: IGiftiRevenueOrder[];
  // The full count for that day, as counted by the server — a page caps at 20 rows, so orders.length can't be used
  ordersCount: number;
  isOrdersLoading: boolean;
  ordersPage: number;
  ordersTotalPages: number;
  onOrdersPageChange: (page: number) => void;
}

/* One card, one table — only the table rendered inside changes with the drill level
   (monthly → daily → per-order). The view selector (monthly/daily) stays visible at
   every level: picking it collapses the drill-down position and returns straight to
   that view. Title and subtitle switch with the level too:
     monthly/daily table   "N개월" (N months) · "N일" (N days)
     per-order table        "N건" (N orders) — the full count for that day as the
                             server counted it, not the row count on the current page
   An empty range shows just a dash — no explanatory text added.
   Pagination is attached only to the per-order table — it's the only table the server
   actually paginates via page/limit. */
export const RevenueGiftiTableCard: React.FC<RevenueGiftiTableCardProps> = ({
  drill,
  view,
  onViewChange,
  rows,
  periodCount,
  isPeriodLoading,
  onDrill,
  orders,
  ordersCount,
  isOrdersLoading,
  ordersPage,
  ordersTotalPages,
  onOrdersPageChange,
}) => {
  const isDetail = drill.level === 'detail';
  const title = isDetail ? '건별 내역' : view === 'month' ? '월별 내역' : '일별 내역';

  const sub = isDetail
    ? isOrdersLoading
      ? '불러오는 중…'
      : ordersCount
        ? `${gsN(ordersCount)}건`
        : '—'
    : isPeriodLoading
      ? '불러오는 중…'
      : periodCount
        ? `${gsN(periodCount)}${view === 'day' ? '일' : '개월'}`
        : '—';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{sub}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="filter-sel"
            value={view}
            onChange={(e) => onViewChange(e.target.value as IGiftiRevenueView)}
          >
            <option value="month">월별</option>
            <option value="day">일별</option>
          </select>
        </div>
      </div>

      {isDetail ? (
        <>
          <RevenueGiftiDetailRows orders={orders} isLoading={isOrdersLoading} />
          <RevenueGiftiPagination
            page={ordersPage}
            totalPages={ordersTotalPages}
            onChange={onOrdersPageChange}
          />
        </>
      ) : (
        <RevenueGiftiPeriodRows rows={rows} isLoading={isPeriodLoading} onDrill={onDrill} />
      )}
    </div>
  );
};
