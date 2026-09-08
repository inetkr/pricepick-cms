'use client';

import React from 'react';
import { RfAmount, RfTitleNote } from 'src/components/revenue-fee/revenue-fee-cells';
import { RevenueFeePagination } from 'src/components/revenue-fee/revenue-fee-pagination';
import type {
  IAffiliateRevenueByPeriod,
  IAffiliateRevenueGroupBy,
  IAffiliateRevenueMetrics,
  IAffiliateRevenuePeriodRow,
  IRevenueFeeView,
} from 'src/types/revenue/revenue_fee';
import {
  RF_EMPTY_METRICS,
  rfMerchantRateNote,
  rfN,
  rfPeriodRowLabel,
  rfPeriodRowSub,
  rfRangeLabel,
} from 'src/utils/revenue-fee';

// 기간별 두 표(쿠팡·링크프라이스)가 칸·너비를 똑같이 쓴다 — 나란히 놓고 읽는 표라 어긋나면 안 된다
const PeriodHead: React.FC = () => (
  <thead>
    <tr>
      <th style={{ width: '21%' }}>기간</th>
      <th style={{ width: '12%' }}>주문 건수</th>
      <th style={{ width: '17%' }}>거래액</th>
      <th style={{ width: '17%' }}>수수료</th>
      <th style={{ width: '16%' }}>유저 적립</th>
      <th style={{ width: '17%' }} className="rf-net-col">
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

const TotalRow: React.FC<{ note: string; m: IAffiliateRevenueMetrics }> = ({ note, m }) => (
  <tr style={{ borderTop: '2px solid var(--border)' }}>
    <td style={{ fontWeight: 700 }}>
      합계 <span style={{ fontWeight: 400, fontSize: '11px', color: 'var(--text-3)' }}>{note}</span>
    </td>
    <MetricCells m={m} strong />
  </tr>
);

// 적립 지급 건수 — 우리 DB 기준이라 주문 건수와 1:1로 맞지 않는다
const PayoutFooter: React.FC<{ count: number }> = ({ count }) => (
  <div
    style={{
      padding: '12px 20px',
      borderTop: '1px solid var(--border)',
      fontSize: '12px',
      color: 'var(--text-2)',
    }}
  >
    적립 지급 건수 <span style={{ fontWeight: 700, color: 'var(--text)' }}>{rfN(count)}</span>
    <div style={{ marginTop: '6px' }}>결제 건 하나를 주문 한 건으로 셉니다.</div>
  </div>
);

interface RevenueFeePeriodTabProps {
  data: IAffiliateRevenueByPeriod | null;
  isLoading: boolean;
  groupBy: IAffiliateRevenueGroupBy;
  lpRows: IAffiliateRevenuePeriodRow[]; // 화면에 그리는 쪽(서버는 구간 전체를 준다)
  cpRows: IAffiliateRevenuePeriodRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  view: IRevenueFeeView;
  viewName: string;
  onViewChange: (view: IRevenueFeeView) => void;
  selectedPeriod: IAffiliateRevenuePeriodRow | null;
  onSelect: (row: IAffiliateRevenuePeriodRow) => void;
  rowCount: number;
}

const EmptyRow: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <tr>
    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
      {isLoading ? '불러오는 중…' : '기간 내 거래가 없습니다.'}
    </td>
  </tr>
);

export const RevenueFeePeriodTab: React.FC<RevenueFeePeriodTabProps> = ({
  data,
  isLoading,
  groupBy,
  lpRows,
  cpRows,
  page,
  totalPages,
  onPageChange,
  view,
  viewName,
  onViewChange,
  selectedPeriod,
  onSelect,
  rowCount,
}) => {
  // 「기간별」은 조회 기간 그 자체라 더 들어갈 데가 없다 — 눌리는 줄로 보이지 않게 한다
  const clickable = view !== 'range';
  const cpSub = `${rfRangeLabel(data?.range)} · ${rfMerchantRateNote(data?.coupang.merchant_rate)}`;

  return (
    <>
      {/* 쿠팡은 따로 얹는다 — 제휴몰별 탭과 같은 결이다. 아래 표는 링크프라이스만 그린다. */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              쿠팡 <RfTitleNote>직접 제휴</RfTitleNote>
            </div>
            <div className="card-sub">{cpSub}</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table id="rf-cpbd-table">
            <PeriodHead />
            <tbody>
              {isLoading || cpRows.length === 0 ? (
                <EmptyRow isLoading={isLoading} />
              ) : (
                <>
                  {cpRows.map((r) => (
                    <tr key={r.period}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{rfPeriodRowLabel(r, groupBy)}</div>
                        <div className="rf-mall-kind">{rfPeriodRowSub(r, groupBy)}</div>
                      </td>
                      <MetricCells m={r} />
                    </tr>
                  ))}
                  <TotalRow note="쿠팡" m={data?.coupang.total ?? RF_EMPTY_METRICS} />
                </>
              )}
            </tbody>
          </table>
        </div>
        <PayoutFooter count={data?.coupang.payout_count ?? 0} />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              {viewName} 내역 <RfTitleNote>링크프라이스</RfTitleNote>
            </div>
            <div className="card-sub">{rfN(rowCount)}개 구간</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              className="filter-sel"
              value={view}
              onChange={(e) => onViewChange(e.target.value as IRevenueFeeView)}
            >
              <option value="month">월별</option>
              <option value="day">일별</option>
              <option value="range">기간별</option>
            </select>
          </div>
        </div>
        <table id="rf-bd-table">
          <PeriodHead />
          <tbody>
            {isLoading || lpRows.length === 0 ? (
              <EmptyRow isLoading={isLoading} />
            ) : (
              <>
                {lpRows.map((r) => (
                  <tr
                    key={r.period}
                    className={
                      clickable
                        ? `rf-bd-row${selectedPeriod?.period === r.period ? ' sel' : ''}`
                        : undefined
                    }
                    // 줄을 누르면 제휴몰별 탭이 그 구간으로 좁혀진다
                    onClick={clickable ? () => onSelect(r) : undefined}
                  >
                    <td>
                      <div style={{ fontWeight: 700 }}>{rfPeriodRowLabel(r, groupBy)}</div>
                      <div className="rf-mall-kind">{rfPeriodRowSub(r, groupBy)}</div>
                    </td>
                    <MetricCells m={r} />
                  </tr>
                ))}
                <TotalRow note="링크프라이스" m={data?.linkprice.total ?? RF_EMPTY_METRICS} />
              </>
            )}
          </tbody>
        </table>
        <RevenueFeePagination page={page} totalPages={totalPages} onChange={onPageChange} />
      </div>
    </>
  );
};
