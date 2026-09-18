'use client';

import React from 'react';
import dayjs from 'dayjs';
import { exportArrayToCsv, type CsvColumn } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { GifticonCancelTable } from 'src/components/gifticon-cancel/gifticon-cancel-table';
import { GifticonCancelToolbar } from 'src/components/gifticon-cancel/gifticon-cancel-toolbar';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import { useGifticonCancelledOrders } from 'src/sections/gifticon-cancel/hooks/use-gifticon-cancel';
import {
  getGifticonOrderCancelReason,
  getGifticonOrderMember,
  getGifticonOrderProductName,
  ticketCountsToParts,
} from 'src/utils/gifticon-orders';
import { formatGifticonTicketPartText } from 'src/utils/gifticon-products';

const formatRefundedTicketsForCsv = (order: IGifticonOrder): string => {
  const parts = ticketCountsToParts(order.refunded_tickets);
  if (!parts.length) return '—';
  const lines = parts.map((p) => `−${formatGifticonTicketPartText(p)}`);
  lines.push(`(−${order.price_won.toLocaleString('ko-KR')}원)`);
  return lines.join('\n');
};

const formatHoldingsForCsv = (order: IGifticonOrder): string => {
  const parts = ticketCountsToParts(order.tickets_after);
  if (!parts.length) return '—';
  const lines = parts.map(formatGifticonTicketPartText);
  lines.push(`(${order.tickets_after_won.toLocaleString('ko-KR')}원)`);
  return lines.join('\n');
};

const CSV_COLUMNS: CsvColumn<IGifticonOrder>[] = [
  { header: '주문번호', accessor: (row) => row.order_no },
  { header: '닉네임', accessor: (row) => getGifticonOrderMember(row).nickname ?? '' },
  { header: '카카오톡 ID', accessor: (row) => getGifticonOrderMember(row).kakaoLoginId ?? '' },
  { header: '식별 아이디', accessor: (row) => row.user.identified_id },
  { header: '상품명', accessor: (row) => getGifticonOrderProductName(row) },
  { header: '상품코드', accessor: (row) => row.product_code },
  { header: '기프티콘 코드', accessor: (row) => row.voucher_code ?? '' },
  {
    header: '취소일시',
    accessor: (row) =>
      row.cancelled_at ? dayjs(row.cancelled_at).format('YYYY-MM-DD HH:mm:ss') : '',
  },
  { header: '취소사유', accessor: (row) => getGifticonOrderCancelReason(row) ?? '' },
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
