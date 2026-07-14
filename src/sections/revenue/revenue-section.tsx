'use client';

import React from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { RevenueStats } from 'src/components/revenue/revenue-stats';
import { RevenueTable } from 'src/components/revenue/revenue-table';
import { RevenueTabs } from 'src/components/revenue/revenue-tabs';
import { RevenueToolbar } from 'src/components/revenue/revenue-toolbar';
import { useRevenue } from 'src/sections/revenue/hooks/use-revenue';
import type { IFeeRevenue, IGifticonRevenue } from 'src/types/revenue/revenue';

const won = (amount: number) => `${(amount || 0).toLocaleString()}원`;

const renderDateTime = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return (
    <>
      <div style={{ fontWeight: 700, color: '#333333' }}>{`${year}/${month}/${day}`}</div>
      <div style={{ color: 'var(--text-3)' }}>{`${hours}:${minutes}:${seconds}`}</div>
    </>
  );
};

const feeColumns: {
  key: keyof IFeeRevenue;
  label: string;
  render?: (item: IFeeRevenue) => React.ReactNode;
}[] = [
  {
    key: 'created_at',
    label: '발생 일시',
    render: (item) => renderDateTime(item.created_at),
  },
  {
    key: 'mall_name',
    label: '제휴몰',
    render: (item) => <span style={{ fontWeight: 500 }}>{item.mall_name || '—'}</span>,
  },
  {
    key: 'nickname',
    label: '회원(UID)',
    render: (item) => (
      <>
        <div>{item.nickname}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>#{item.user_id}</div>
      </>
    ),
  },
  {
    key: 'order_number',
    label: '주문번호',
    render: (item) => (
      <span style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-2)' }}>
        {item.order_number}
      </span>
    ),
  },
  { key: 'purchase_amount', label: '구매금액', render: (item) => won(item.purchase_amount) },
  {
    key: 'commission_rate',
    label: '수수료율',
    render: (item) => `${item.commission_rate}%`,
  },
  {
    key: 'commission_amount',
    label: '수수료 매출',
    render: (item) => (
      <span style={{ color: 'var(--success)', fontWeight: 600 }}>+{won(item.commission_amount)}</span>
    ),
  },
  {
    key: 'ticket_cost',
    label: '적립 금액(티켓)',
    render: (item) =>
      item.ticket_cost > 0 ? (
        <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{won(item.ticket_cost)}</span>
      ) : (
        <span style={{ color: 'var(--text-3)' }}>—</span>
      ),
  },
  {
    key: 'status',
    label: '상태',
    render: (item) => (
      <span className={`badge ${item.status === 'NORMAL' ? 'badge-green' : 'badge-red'}`}>
        {item.status === 'NORMAL' ? '정상' : '오류'}
      </span>
    ),
  },
];

const gifticonColumns: {
  key: keyof IGifticonRevenue;
  label: string;
  render?: (item: IGifticonRevenue) => React.ReactNode;
}[] = [
  {
    key: 'created_at',
    label: '발생 일시',
    render: (item) => renderDateTime(item.created_at),
  },
  {
    key: 'product_name',
    label: '기프티콘 상품',
    render: (item) => <span style={{ fontWeight: 500 }}>{item.product_name || '—'}</span>,
  },
  {
    key: 'nickname',
    label: '회원(UID)',
    render: (item) => (
      <>
        <div>{item.nickname}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>#{item.user_id}</div>
      </>
    ),
  },
  { key: 'exchange_price', label: '교환가(실가)', render: (item) => won(item.exchange_price) },
  { key: 'wholesale_cost', label: '도매 원가', render: (item) => won(item.wholesale_cost) },
  {
    key: 'margin',
    label: '판매 마진',
    render: (item) => <span style={{ color: 'var(--success)', fontWeight: 600 }}>+{won(item.margin)}</span>,
  },
  {
    key: 'status',
    label: '상태',
    render: (item) => (
      <span className={`badge ${item.status === 'COMPLETED' ? 'badge-green' : 'badge-amber'}`}>
        {item.status === 'COMPLETED' ? '완료' : '대기'}
      </span>
    ),
  },
];

export const RevenueSection: React.FC = () => {
  const {
    stats,
    feeRevenues,
    setFeeFilters,
    feePage,
    setFeePage,
    feeLimit,
    setFeeLimit,
    feeTotalPages,
    feeTotalItems,
    isFeeLoading,
    gifticonRevenues,
    setGifticonFilters,
    gifticonPage,
    setGifticonPage,
    gifticonLimit,
    setGifticonLimit,
    gifticonTotalPages,
    gifticonTotalItems,
    isGifticonLoading,
  } = useRevenue();

  const feePagination: PaginationProps = {
    currentPage: feePage,
    totalPages: feeTotalPages,
    onPageChange: setFeePage,
    onItemsPerPageChange: setFeeLimit,
    showSizeChanger: true,
    showTotal: true,
    totalItems: feeTotalItems,
    itemsPerPage: feeLimit,
  };

  const gifticonPagination: PaginationProps = {
    currentPage: gifticonPage,
    totalPages: gifticonTotalPages,
    onPageChange: setGifticonPage,
    onItemsPerPageChange: setGifticonLimit,
    showSizeChanger: true,
    showTotal: true,
    totalItems: gifticonTotalItems,
    itemsPerPage: gifticonLimit,
  };

  return (
    <div className="section active">
      <div className="data-source-bar">
        <span className="ds-label">데이터 출처</span>
        <span className="ds-tag ours">우리 DB · revenue_logs</span>
      </div>
      <div className="info-box">
        <strong>매출 내역</strong> — 매출 발생 건별 기록입니다. <strong>제휴 수수료</strong>(제휴몰
        D+30 정산)와 <strong>기프티콘 판매</strong>(교환 시 즉시 발생 마진)는 정산 주체·시점이 달라
        유형별로 분리해 관리합니다. 합산 지표는 <strong>수익 분석</strong> 페이지 참고.
      </div>

      <RevenueStats
        feeRevenue={won(stats.fee_revenue_this_month)}
        gifticonRevenue={won(stats.gifticon_revenue_this_month)}
        totalRevenue={won(stats.total_revenue_this_month)}
      />

      <div className="card" style={{ padding: '18px' }}>
        <RevenueTabs defaultTab="fee">
          <div>
            <RevenueToolbar
              searchPlaceholder="회원, 주문번호 검색..."
              onApplyFilters={({ search, mall }) => setFeeFilters({ search, mall })}
            />
            {isFeeLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
                로딩 중...
              </div>
            ) : (
              <RevenueTable
                title="제휴 수수료 매출 내역"
                data={feeRevenues}
                columns={feeColumns}
                totalLabel={`총 ${feeTotalItems.toLocaleString()}건 · 합 ${won(stats.fee_revenue_this_month)}`}
                pagination={feePagination}
                emptyMessage="조회된 수수료 매출 내역이 없습니다."
              />
            )}
          </div>
          <div>
            <RevenueToolbar
              searchPlaceholder="회원, 상품 검색..."
              showMallFilter={false}
              onApplyFilters={({ search }) => setGifticonFilters({ search })}
            />
            {isGifticonLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
                로딩 중...
              </div>
            ) : (
              <RevenueTable
                title="기프티콘 판매 매출 내역"
                data={gifticonRevenues}
                columns={gifticonColumns}
                totalLabel={`총 ${gifticonTotalItems.toLocaleString()}건 · 마진 합 ${won(stats.gifticon_revenue_this_month)}`}
                pagination={gifticonPagination}
                emptyMessage="조회된 기프티콘 판매 내역이 없습니다."
              />
            )}
          </div>
        </RevenueTabs>
      </div>
    </div>
  );
};
