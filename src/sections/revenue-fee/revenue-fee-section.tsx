'use client';

import React, { useState } from 'react';
import { RevenueFeeMallTab } from 'src/components/revenue-fee/revenue-fee-mall-tab';
import { RevenueFeeNoticeModal } from 'src/components/revenue-fee/revenue-fee-notice-modal';
import { RevenueFeeOrderTable } from 'src/components/revenue-fee/revenue-fee-order-table';
import { RevenueFeePeriodTab } from 'src/components/revenue-fee/revenue-fee-period-tab';
import { RevenueFeeStats } from 'src/components/revenue-fee/revenue-fee-stats';
import type { IRevenueFeeTab } from 'src/components/revenue-fee/revenue-fee-tabs';
import { RevenueFeeTabs } from 'src/components/revenue-fee/revenue-fee-tabs';
import { RevenueFeeToolbar } from 'src/components/revenue-fee/revenue-fee-toolbar';
import { useRevenueFee } from 'src/sections/revenue-fee/hooks/use-revenue-fee';
import { rfDt, rfPeriodRowLabel } from 'src/utils/revenue-fee';

/* 제휴 수수료 매출 — 탭 하나가 질문 하나다.
     건별 내역   그 건이 여기 제대로 들어왔나
     기간별 매출 얼마 벌었나
     제휴몰별    어디가 돈이 되나
   조회 기간은 탭 위에 놓여 아래쪽에 함께 걸린다(탭마다 따로 고르면 숫자가 어긋난다).
   화면에는 값만 두고, 왜 그런지는 「Notice !」 모달로 넣는다. */
export const RevenueFeeSection: React.FC = () => {
  const rf = useRevenueFee();
  const [tab, setTab] = useState<IRevenueFeeTab>('order');
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const selected = rf.selectedPeriod;

  return (
    <div className="section active" id="sec-revenue-fee">
      <button type="button" className="ta-notice" onClick={() => setIsNoticeOpen(true)}>
        <span>제휴 수수료 매출 Notice</span>
        <span className="ta-notice-mark">!</span>
      </button>

      <RevenueFeeToolbar
        mode={rf.periodMode}
        onModeChange={rf.setPeriodMode}
        day={rf.dayValue}
        onDayChange={rf.setDayValue}
        month={rf.monthValue}
        onMonthChange={rf.setMonthValue}
        from={rf.fromValue}
        onFromChange={rf.setFromValue}
        to={rf.toValue}
        onToChange={rf.setToValue}
        onReload={rf.reload}
        range={rf.summary?.range}
        lpOrderCount={rf.summary?.order_count.linkprice ?? null}
        isLoading={rf.isSummaryLoading}
      />

      <RevenueFeeStats summary={rf.summary} />

      <RevenueFeeTabs active={tab} onChange={setTab} />

      {tab === 'order' && (
        <RevenueFeeOrderTable
          orders={rf.orders}
          range={rf.summary?.range}
          count={rf.orderCount}
          isLoading={rf.isOrdersLoading}
          filters={rf.orderFilters}
          onFiltersChange={rf.changeOrderFilters}
          merchantOptions={rf.merchantOptions}
          ticketStatusOptions={rf.ticketStatusOptions}
          size={rf.orderSize}
          onSizeChange={rf.changeOrderSize}
          page={rf.orderPage}
          totalPages={rf.orderTotalPages}
          onPageChange={rf.setOrderPage}
        />
      )}

      {tab === 'period' && (
        <RevenueFeePeriodTab
          data={rf.byPeriod}
          isLoading={rf.isPeriodLoading}
          groupBy={rf.groupBy}
          lpRows={rf.pagedLpRows}
          cpRows={rf.pagedCpRows}
          page={rf.bucketPage}
          totalPages={rf.bucketTotalPages}
          onPageChange={rf.setBucketPage}
          view={rf.view}
          viewName={rf.viewName}
          onViewChange={rf.changeView}
          selectedPeriod={selected}
          onSelect={(row) => {
            rf.selectPeriodRow(row);
            // 줄을 누르면 제휴몰별 탭이 그 구간으로 좁혀지고, 탭도 그리로 넘어간다
            if (selected?.period !== row.period) setTab('mall');
          }}
          rowCount={rf.lpRowCount}
        />
      )}

      {tab === 'mall' && (
        <RevenueFeeMallTab
          data={rf.byMerchant}
          isLoading={rf.isMerchantLoading}
          drillLabel={
            selected
              ? `${rfPeriodRowLabel(selected, rf.groupBy)} · ${rfDt(selected.period_start)} ~ ${rfDt(
                  selected.period_end
                )}`
              : null
          }
          onClearDrill={rf.clearSelection}
          malls={rf.mallRows}
          search={rf.mallSearch}
          onSearchChange={rf.setMallSearch}
          sort={rf.mallSort}
          onSortChange={rf.setMallSort}
          sortOptions={rf.mallSortOptions}
        />
      )}

      <RevenueFeeNoticeModal open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
    </div>
  );
};
