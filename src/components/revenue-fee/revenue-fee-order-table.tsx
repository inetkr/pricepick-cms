'use client';

import React, { useState } from 'react';
import {
  RfAmount,
  RfCaret,
  RfMallKind,
  RfOrderProducts,
} from 'src/components/revenue-fee/revenue-fee-cells';
import { RevenueFeePagination } from 'src/components/revenue-fee/revenue-fee-pagination';
import type { IRevenueFeeOrderFilters } from 'src/sections/revenue-fee/hooks/use-revenue-fee';
import type {
  IAffiliateRevenueMerchantOption,
  IAffiliateRevenueStatusOption,
  IAffiliateRevenueOrder,
  IAffiliateRevenueRange,
} from 'src/types/revenue/revenue_fee';
import {
  RF_CP_NO_ORDERNO_TITLE,
  RF_ORDER_STATUS_LABEL,
  RF_STATUS_BADGE,
  RF_STATUS_LABEL,
  rfDt,
  rfIsCanceled,
  rfN,
  rfRangeLabel,
  rfStatusKey,
  rfTm,
} from 'src/utils/revenue-fee';

// 상품 표를 여는 펼침 칸까지 합친 칸 수 — 빈 줄이 표 너비를 다 채우도록
const COL_SPAN = 10;

interface RevenueFeeOrderTableProps {
  orders: IAffiliateRevenueOrder[];
  range?: IAffiliateRevenueRange | null;
  count: number;
  isLoading: boolean;
  filters: IRevenueFeeOrderFilters;
  onFiltersChange: (next: Partial<IRevenueFeeOrderFilters>) => void;
  // 주문 응답이 함께 준 merchants 그대로 — 거르개로 보내는 값이 merchant_id 다
  merchantOptions: IAffiliateRevenueMerchantOption[];
  // 이름표까지 서버가 준다 — 화면에서 상태 이름을 다시 짓지 않는다
  ticketStatusOptions: IAffiliateRevenueStatusOption[];
  size: number;
  onSizeChange: (size: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* 건별 내역 — 기간 합계만으로는 "그 몇 건이 뭐였는지"를 못 짚는다.
   조회 기간은 위 툴바를 그대로 따르고, 쪽나눔은 서버가 잘라 준다.
   줄을 누르면 그 주문의 상품(상품번호·상품명·수량·금액·수수료)이 그대로 펼쳐진다 —
   접힌 줄은 주문 합계라서, 일부만 취소된 주문이 왜 원래 금액보다 적은지는 여기서만 보인다. */
export const RevenueFeeOrderTable: React.FC<RevenueFeeOrderTableProps> = ({
  orders,
  range,
  count,
  isLoading,
  filters,
  onFiltersChange,
  merchantOptions,
  ticketStatusOptions,
  size,
  onSizeChange,
  page,
  totalPages,
  onPageChange,
}) => {
  // 여러 줄을 동시에 펼쳐 놓고 견줄 일이 있어 하나만 열리게 막지 않는다
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">건별 내역</div>
          <div className="card-sub">
            {rfRangeLabel(range)} · {rfN(count)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="filter-sel"
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
          >
            <option value={50}>50건씩</option>
            <option value={100}>100건씩</option>
            <option value={200}>200건씩</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <div className="toolbar" style={{ marginBottom: '14px' }}>
          <input
            className="search-box"
            placeholder="주문번호·회원 검색..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
          <select
            className="filter-sel"
            value={filters.merchantId}
            onChange={(e) => onFiltersChange({ merchantId: e.target.value })}
          >
            <option value="">전체 제휴몰</option>
            {merchantOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.merchant_name}
              </option>
            ))}
          </select>
          <select
            className="filter-sel"
            value={filters.ticketStatus}
            onChange={(e) => onFiltersChange({ ticketStatus: e.target.value })}
          >
            <option value="">전체 상태</option>
            {ticketStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table id="rf-od-table">
          <thead>
            <tr>
              <th style={{ width: '9%' }}>주문일</th>
              <th style={{ width: '14%' }}>제휴몰</th>
              <th style={{ width: '12%' }}>주문번호</th>
              <th style={{ width: '13%' }}>회원</th>
              <th style={{ width: '11%' }}>거래액</th>
              <th style={{ width: '11%' }}>수수료</th>
              <th style={{ width: '11%' }}>유저 적립</th>
              <th style={{ width: '10%' }} className="rf-net-col">
                수익
              </th>
              <th style={{ width: '5%' }}>상태</th>
              <th style={{ width: '4%' }} aria-label="펼치기" />
            </tr>
          </thead>
          <tbody>
            {isLoading || orders.length === 0 ? (
              <tr>
                <td
                  colSpan={COL_SPAN}
                  style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}
                >
                  {isLoading ? '불러오는 중…' : '조건에 맞는 거래가 없습니다.'}
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const statusKey = rfStatusKey(o);
                // 취소 건은 합계에서 빠진 줄이라 흐리게 — 지워 버리면 왜 합계가 다른지 알 수 없다
                const dim = rfIsCanceled(o) ? { color: 'var(--text-3)' } : undefined;
                const isCoupang = o.order_source === 'COUPANG';
                const products = o.products ?? [];
                const open = Boolean(openIds[o.id]);
                return (
                  <React.Fragment key={o.id}>
                    <tr
                      className={products.length > 0 ? 'pb-row' : undefined}
                      aria-expanded={products.length > 0 ? open : undefined}
                      role={products.length > 0 ? 'button' : undefined}
                      tabIndex={products.length > 0 ? 0 : undefined}
                      onClick={products.length > 0 ? () => toggle(o.id) : undefined}
                      onKeyDown={
                        products.length > 0
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggle(o.id);
                              }
                            }
                          : undefined
                      }
                    >
                      <td style={{ whiteSpace: 'nowrap', ...dim }}>
                        {/* 날짜 밑에 시·분·초 — 같은 날 건이 여럿이라 시각 없이는 실구매 기록과 못 맞춘다 */}
                        <div>{rfDt(o.order_date)}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                          {rfTm(o.created_at)}
                        </div>
                      </td>
                      <td style={dim}>
                        {o.merchant_name}{' '}
                        <RfMallKind>{isCoupang ? '직접 제휴' : '링크프라이스 제휴'}</RfMallKind>
                      </td>
                      <td style={dim}>
                        {o.order_no ? (
                          o.order_no
                        ) : (
                          <span
                            style={{ fontSize: '11px', color: 'var(--text-3)' }}
                            title={RF_CP_NO_ORDERNO_TITLE}
                          >
                            쿠팡 미제공
                          </span>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', ...dim }}>
                        <div>{o.nickname || '—'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                          {o.identified_id}
                        </div>
                      </td>
                      <td style={dim}>
                        <RfAmount value={o.transaction_amount} />
                        {/* 일부만 취소된 주문 — 원래 금액을 밑에 남긴다. 안 적으면 거래액이 왜
                            줄었는지 줄을 펼쳐 보기 전까지 알 수 없다. */}
                        {o.original_transaction_amount > o.transaction_amount && (
                          <div className="pb-dim">{rfN(o.original_transaction_amount)}원 중</div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, ...dim }}>
                        <RfAmount value={o.commission_amount} rate={o.commission_rate} />
                      </td>
                      <td style={dim ?? { color: 'var(--amber)' }}>
                        <RfAmount
                          value={o.user_accrual_amount}
                          rate={o.user_accrual_rate}
                          prefix="− "
                        />
                      </td>
                      <td className="rf-net-col" style={dim}>
                        <RfAmount value={o.profit_amount} rate={o.profit_rate_p} unit="%p" />
                      </td>
                      {/* 티켓 장수·전환일과 주문 상태는 칸을 늘리지 않고 마우스를 올리면 나오게 둔다 */}
                      <td
                        title={`주문 ${RF_ORDER_STATUS_LABEL[o.status] ?? o.status} · 티켓 ${rfN(o.ticket_amount)}장 · 전환일 ${rfDt(o.ticket_unlock_date)}`}
                      >
                        <span className={RF_STATUS_BADGE[statusKey]}>
                          {RF_STATUS_LABEL[statusKey]}
                        </span>
                      </td>
                      {products.length > 0 ? <RfCaret /> : <td className="pb-caret" />}
                    </tr>
                    {open && products.length > 0 && (
                      <RfOrderProducts products={products} colSpan={COL_SPAN} />
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <RevenueFeePagination page={page} totalPages={totalPages} onChange={onPageChange} />

      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          fontSize: '12px',
          color: 'var(--text-2)',
        }}
      >
        쿠팡은 주문번호가 오지 않습니다.
      </div>
    </div>
  );
};
