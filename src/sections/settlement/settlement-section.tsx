'use client';

import React from 'react';
import type { CsvColumn } from 'src/components/common/csv-export-button';
import { exportArrayToCsv } from 'src/components/common/csv-export-button';
import { SettlementDiffBox } from 'src/components/settlement/settlement-diff-box';
import { SettlementStats } from 'src/components/settlement/settlement-stats';
import type { SettlementColumn } from 'src/components/settlement/settlement-table';
import { SettlementTable } from 'src/components/settlement/settlement-table';
import { useSettlement } from 'src/sections/settlement/hooks/use-settlement';
import type { IAffiliateSettlement, IMonthlySettlement } from 'src/types/settlement/settlement';

const won = (amount: number | null | undefined) =>
  amount === null || amount === undefined ? '집계 중' : `${amount.toLocaleString()}원`;

const affiliateStatusLabels: Record<IAffiliateSettlement['status'], string> = {
  MATCHED: '일치',
  VERIFYING: '검증 중',
  ERROR: '오류',
};

const affiliateStatusBadge: Record<IAffiliateSettlement['status'], string> = {
  MATCHED: 'badge-green',
  VERIFYING: 'badge-amber',
  ERROR: 'badge-red',
};

const monthlyStatusLabels: Record<IMonthlySettlement['status'], string> = {
  AGGREGATING: '집계 중',
  CONFIRMED: '확정',
  PROCESSED: '처리완료',
};

const monthlyStatusBadge: Record<IMonthlySettlement['status'], string> = {
  AGGREGATING: 'badge-amber',
  CONFIRMED: 'badge-green',
  PROCESSED: 'badge-green',
};

const formatMonth = (month: string) => {
  const [year, m] = month.split('-');
  if (!year || !m) return month;
  return `${year}년 ${Number(m)}월`;
};

const affiliateColumns: SettlementColumn<IAffiliateSettlement>[] = [
  { key: 'mall_name', label: '제휴몰' },
  {
    key: 'our_record_amount',
    label: '우리 기록',
    align: 'center',
    render: (item) => won(item.our_record_amount),
  },
  {
    key: 'confirmed_amount',
    label: '확정 정산금',
    align: 'center',
    render: (item) => won(item.confirmed_amount),
  },
  {
    key: 'diff_amount',
    label: '차액',
    align: 'center',
    render: (item) => (
      <span style={{ color: item.diff_amount === 0 ? 'var(--text-2)' : 'var(--danger)' }}>
        {won(item.diff_amount)}
      </span>
    ),
  },
  {
    key: 'settlement_cycle',
    label: '정산 주기',
    align: 'center',
    render: (item) => <span style={{ fontSize: '12px' }}>{item.settlement_cycle}</span>,
  },
  {
    key: 'status',
    label: '상태',
    align: 'center',
    render: (item) => (
      <span className={`badge ${affiliateStatusBadge[item.status] || 'badge-gray'}`}>
        {affiliateStatusLabels[item.status] || item.status}
      </span>
    ),
  },
];

const monthlyColumns: SettlementColumn<IMonthlySettlement>[] = [
  { key: 'month', label: '정산 월', render: (item) => formatMonth(item.month) },
  {
    key: 'estimated_revenue',
    label: '추정 매출',
    align: 'center',
    render: (item) => won(item.estimated_revenue),
  },
  {
    key: 'confirmed_amount',
    label: '확정 정산금',
    align: 'center',
    render: (item) => (
      <span style={{ color: item.confirmed_amount === null ? 'var(--text-3)' : 'var(--text)' }}>
        {won(item.confirmed_amount)}
      </span>
    ),
  },
  {
    key: 'diff_amount',
    label: '차액',
    align: 'center',
    render: (item) => (
      <span style={{ color: item.diff_amount === null ? 'var(--text-3)' : 'var(--danger)' }}>
        {item.diff_amount === null ? '—' : won(item.diff_amount)}
      </span>
    ),
  },
  {
    key: 'status',
    label: '상태',
    align: 'center',
    render: (item) => (
      <span className={`badge ${monthlyStatusBadge[item.status] || 'badge-gray'}`}>
        {monthlyStatusLabels[item.status] || item.status}
      </span>
    ),
  },
];

const affiliateCsvColumns: CsvColumn<IAffiliateSettlement>[] = [
  { header: '제휴몰', accessor: (item) => item.mall_name },
  { header: '우리 기록', accessor: (item) => item.our_record_amount },
  { header: '확정 정산금', accessor: (item) => item.confirmed_amount },
  { header: '차액', accessor: (item) => item.diff_amount },
  { header: '정산 주기', accessor: (item) => item.settlement_cycle },
  { header: '상태', accessor: (item) => affiliateStatusLabels[item.status] || item.status },
];

const monthlyCsvColumns: CsvColumn<IMonthlySettlement>[] = [
  { header: '정산 월', accessor: (item) => formatMonth(item.month) },
  { header: '추정 매출', accessor: (item) => item.estimated_revenue },
  { header: '확정 정산금', accessor: (item) => item.confirmed_amount ?? '' },
  { header: '차액', accessor: (item) => item.diff_amount ?? '' },
  { header: '상태', accessor: (item) => monthlyStatusLabels[item.status] || item.status },
];

export const SettlementSection: React.FC = () => {
  const { stats, affiliateSettlements, monthlySettlements, diffReasons, isLoading } =
    useSettlement();

  const handleExportAffiliate = () => {
    exportArrayToCsv(affiliateSettlements, affiliateCsvColumns, 'affiliate-settlement.csv');
  };

  const handleExportMonthly = () => {
    exportArrayToCsv(monthlySettlements, monthlyCsvColumns, 'monthly-settlement.csv');
  };

  if (isLoading) {
    return (
      <div className="section active">
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="section active">
      <div className="data-source-bar">
        <span className="ds-label">데이터 출처</span>
        <span className="ds-tag coupang">제휴몰 파트너스 정산 데이터 · 제휴몰별 확정 주기</span>
        <span className="ds-tag calc">우리 DB 집계 · 추정 매출 (포스트백 기준)</span>
      </div>

      <SettlementStats
        monthlyConfirmed={won(stats.monthly_confirmed)}
        monthlyEstimated={won(stats.monthly_estimated)}
        yearlyTotal={won(stats.yearly_total)}
        confirmedDesc={
          affiliateSettlements.length > 0 ? `전월 확정분 · ${affiliateSettlements.length}개 제휴몰` : '전월 확정분'
        }
        yearlyChangeType={stats.yearly_change_rate >= 0 ? 'up' : 'down'}
        yearlyChange={`${stats.yearly_change_rate >= 0 ? '↑' : '↓'} 전년 대비 ${stats.yearly_change_rate >= 0 ? '+' : ''}${stats.yearly_change_rate}%`}
      />

      <SettlementTable
        title="제휴몰별 정산 현황"
        data={affiliateSettlements}
        columns={affiliateColumns}
        onExport={handleExportAffiliate}
      />

      <SettlementTable
        title="월별 정산 추이"
        data={monthlySettlements}
        columns={monthlyColumns}
        onExport={handleExportMonthly}
      />

      <SettlementDiffBox title="차액 사유 (이번달)" reasons={diffReasons} />
    </div>
  );
};
