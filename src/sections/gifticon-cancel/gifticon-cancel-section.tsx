'use client';

import React from 'react';
import dayjs from 'dayjs';
import { exportArrayToCsv, type CsvColumn } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { GifticonCancelTable } from 'src/components/gifticon-cancel/gifticon-cancel-table';
import { GifticonCancelToolbar } from 'src/components/gifticon-cancel/gifticon-cancel-toolbar';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import { useGifticonCancelledOrders } from 'src/sections/gifticon-cancel/hooks/use-gifticon-cancel';
import { formatGifticonTicketPartText } from 'src/utils/gifticon-products';

const formatRefundedTicketsForCsv = (order: IGifticonOrder): string => {
  if (!order.refundedTickets.length) return '—';
  const lines = order.refundedTickets.map((p) => `−${formatGifticonTicketPartText(p)}`);
  lines.push(`(−${order.priceWon.toLocaleString('ko-KR')}원)`);
  return lines.join('\n');
};

const formatHoldingsForCsv = (order: IGifticonOrder): string => {
  if (!order.ticketsAfter.length) return '—';
  const lines = order.ticketsAfter.map(formatGifticonTicketPartText);
  if (order.ticketsAfterWon != null) {
    lines.push(`(${order.ticketsAfterWon.toLocaleString('ko-KR')}원)`);
  }
  return lines.join('\n');
};

const CSV_COLUMNS: CsvColumn<IGifticonOrder>[] = [
  { header: '주문번호', accessor: (row) => row.orderNo },
  { header: '닉네임', accessor: (row) => row.member.nickname ?? '' },
  { header: '카카오톡 ID', accessor: (row) => row.member.kakaoLoginId ?? '' },
  { header: '식별 아이디', accessor: (row) => row.userId },
  { header: '상품명', accessor: (row) => row.productName },
  { header: '상품코드', accessor: (row) => row.productCode },
  { header: '기프티콘 코드', accessor: (row) => row.voucherCode ?? '' },
  {
    header: '취소일시',
    accessor: (row) => (row.cancelledAt ? dayjs(row.cancelledAt).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  { header: '취소사유', accessor: (row) => row.cancelReason ?? '' },
  { header: '환불 티켓', accessor: (row) => formatRefundedTicketsForCsv(row) },
  { header: '보유 티켓', accessor: (row) => formatHoldingsForCsv(row) },
];

export const GifticonCancelSection: React.FC = () => {
  const {
    orders,
    totalItems,
    totalPages,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    applyFilters,
    exportOrders,
  } = useGifticonCancelledOrders();

  const handleExport = async () => {
    const rows = await exportOrders();
    exportArrayToCsv(rows, CSV_COLUMNS, `취소내역_${dayjs().format('YYYY-MM-DD')}.csv`);
  };

  const startIndex = (page - 1) * limit;

  const paginationProps: PaginationProps = {
    currentPage: page,
    totalPages,
    totalItems,
    onPageChange: setPage,
    showTotal: true,
    showSizeChanger: true,
    itemsPerPage: limit,
    sizeOptions: [10, 25, 50, 100],
    onItemsPerPageChange: setLimit,
  };

  return (
    <div className="section active">
      <GifticonCancelToolbar onApply={applyFilters} onExport={handleExport} />

      <GifticonCancelTable
        data={orders}
        startIndex={startIndex}
        pagination={paginationProps}
        totalLabel={isLoading ? '불러오는 중…' : `총 ${totalItems.toLocaleString('ko-KR')}건`}
      />
    </div>
  );
};
