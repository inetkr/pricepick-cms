'use client';

import React from 'react';
import { RfAmount, RfMallKind, RfTitleNote } from 'src/components/revenue-fee/revenue-fee-cells';
import type {
  IAffiliateRevenueByMerchant,
  IAffiliateRevenueMerchantRow,
  IAffiliateRevenueMetrics,
  IAffiliateRevenueMerchantSort,
} from 'src/types/revenue/revenue_fee';
import { RF_EMPTY_METRICS, rfMerchantRateNote, rfN, rfRangeLabel } from 'src/utils/revenue-fee';

// 쿠팡 한 줄과 제휴몰 목록이 같은 칸·같은 너비를 쓴다 — 위아래로 붙어 있어 어긋나면 바로 보인다
const MallHead: React.FC = () => (
  <thead>
    <tr>
      <th style={{ width: '23%' }}>제휴몰</th>
      <th style={{ width: '12%' }}>주문 건수</th>
      <th style={{ width: '17%' }}>거래액</th>
      <th style={{ width: '17%' }}>수수료</th>
      <th style={{ width: '15%' }}>유저 적립</th>
      <th style={{ width: '16%' }} className="rf-net-col">
        수익
      </th>
    </tr>
  </thead>
);

const MetricCells: React.FC<{ m: IAffiliateRevenueMetrics; strong?: boolean }> = ({
  m,
  strong,
}) => (
  <>
    <td style={strong ? { fontWeight: 700 } : undefined}>{rfN(m.order_count)}</td>
    <td style={strong ? { fontWeight: 700 } : undefined}>
      <RfAmount value={m.transaction_amount} />
    </td>
    <td style={{ fontWeight: strong ? 700 : 600 }}>
      <RfAmount value={m.commission_amount} rate={m.commission_rate} />
    </td>
    <td style={{ color: 'var(--amber)', ...(strong ? { fontWeight: 700 } : {}) }}>
      <RfAmount value={m.user_accrual_amount} rate={m.user_accrual_rate} prefix="− " />
    </td>
    <td className="rf-net-col" style={strong ? { fontWeight: 800 } : undefined}>
      <RfAmount value={m.profit_amount} rate={m.profit_rate_p} unit="%p" />
    </td>
  </>
);

interface RevenueFeeMallTabProps {
  data: IAffiliateRevenueByMerchant | null;
  isLoading: boolean;
  drillLabel: string | null; // 기간별에서 고른 구간 — 없으면 조회 기간 전체
  onClearDrill: () => void;
  malls: IAffiliateRevenueMerchantRow[]; // 검색·정렬을 마친 링크프라이스 목록
  search: string;
  onSearchChange: (v: string) => void;
  sort: IAffiliateRevenueMerchantSort;
  onSortChange: (v: IAffiliateRevenueMerchantSort) => void;
  // 정렬 목록도 /filters 가 준 값 그대로 — 화면에 박아 두면 서버가 늘렸을 때 조용히 빠진다
  sortOptions: { value: IAffiliateRevenueMerchantSort; label: string }[];
}

export const RevenueFeeMallTab: React.FC<RevenueFeeMallTabProps> = ({
  data,
  isLoading,
  drillLabel,
  onClearDrill,
  malls,
  search,
  onSearchChange,
  sort,
  onSortChange,
  sortOptions,
}) => {
  const coupangRows = data?.coupang.rows ?? [];
  const scopeNote = rfRangeLabel(data?.range);

  return (
    <>
      {drillLabel && (
        <div className="rf-drill">
          <span className="rf-drill-mark">▸</span>
          <span>{drillLabel}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClearDrill}>
            전체 기간으로
          </button>
        </div>
      )}

      {/* 쿠팡은 맨 위로 — 링크프라이스가 아니라 직접 제휴라 한 줄로 섞어 넣으면 그 뜻이 사라진다 */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              쿠팡 <RfTitleNote>직접 제휴</RfTitleNote>
            </div>
            <div className="card-sub">
              {scopeNote} · {rfMerchantRateNote(data?.coupang.merchant_rate)}
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table id="rf-cp-table">
            <MallHead />
            <tbody>
              {isLoading || coupangRows.length === 0 ? (
                <tr>
                  {/* 쿠팡은 한 줄짜리 표라 거래가 없어도 합계 줄로 자리를 지킨다 */}
                  <td style={{ fontWeight: 700, color: isLoading ? 'var(--text-3)' : undefined }}>
                    쿠팡 <RfMallKind>직접 제휴</RfMallKind>
                  </td>
                  <MetricCells m={data?.coupang.total ?? RF_EMPTY_METRICS} />
                </tr>
              ) : (
                coupangRows.map((m) => (
                  <tr key={m.merchant_id}>
                    <td style={{ fontWeight: 700 }}>
                      {m.merchant_name} <RfMallKind>직접 제휴</RfMallKind>
                    </td>
                    <MetricCells m={m} />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-2)',
          }}
        >
          적립 지급 건수{' '}
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>
            {rfN(data?.coupang.payout_count ?? 0)}
          </span>
          <div style={{ marginTop: '6px' }}>결제 건 하나를 주문 한 건으로 셉니다.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              제휴몰별 <RfTitleNote>링크프라이스</RfTitleNote>
            </div>
            <div className="card-sub">
              {scopeNote} · {rfN(malls.length)}개
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 20px 0' }}>
          <div className="toolbar" style={{ marginBottom: '14px' }}>
            <input
              className="search-box"
              placeholder="제휴몰 검색..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <select
              className="filter-sel"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as IAffiliateRevenueMerchantSort)}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table id="rf-mall-table">
            <MallHead />
            <tbody>
              {isLoading || malls.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}
                  >
                    {isLoading ? '불러오는 중…' : '조건에 맞는 제휴몰이 없습니다.'}
                  </td>
                </tr>
              ) : (
                <>
                  {malls.map((m) => (
                    <tr key={m.merchant_id}>
                      <td style={{ fontWeight: 700 }}>{m.merchant_name}</td>
                      <MetricCells m={m} />
                    </tr>
                  ))}
                  {/* 합계는 서버가 준 링크프라이스 total 그대로 — 화면에서 다시 더하지 않는다 */}
                  <tr style={{ borderTop: '2px solid var(--border)' }}>
                    <td style={{ fontWeight: 700 }}>
                      합계{' '}
                      <span style={{ fontWeight: 400, fontSize: '11px', color: 'var(--text-3)' }}>
                        링크프라이스
                      </span>
                    </td>
                    <MetricCells m={data?.linkprice.total ?? RF_EMPTY_METRICS} strong />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
