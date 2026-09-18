'use client';

import React from 'react';
import dayjs from 'dayjs';
import { exportArrayToCsv, type CsvColumn } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { GifticonTable } from 'src/components/gifticons/gifticon-table';
import { GifticonToolbar } from 'src/components/gifticons/gifticon-toolbar';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import { useGifticonOrders } from 'src/sections/gifticons/hooks/use-gifticons';
import {
  getGifticonOrderMember,
  getGifticonOrderProductName,
  getGifticonOrderStatusLabel,
  ticketCountsToParts,
} from 'src/utils/gifticon-orders';
import { formatGifticonTicketPartText, formatGifticonValidityDays } from 'src/utils/gifticon-products';

// 표의 사용한 티켓 칸(등급마다 한 줄 + 원화 병기)과 같은 글자를 그대로 쓴다.
const formatTicketsForCsv = (order: IGifticonOrder): string => {
  const parts = ticketCountsToParts(order.tickets_used);
  if (!parts.length) return '—';
  const lines = parts.map(formatGifticonTicketPartText);
  lines.push(`(${order.price_won.toLocaleString('ko-KR')}원)`);
  return lines.join('\n');
};

const CSV_COLUMNS: CsvColumn<IGifticonOrder>[] = [
  { header: '구매일시', accessor: (row) => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') },
  { header: '주문번호', accessor: (row) => row.order_no },
  { header: '닉네임', accessor: (row) => getGifticonOrderMember(row).nickname ?? '' },
  { header: '카카오톡 ID', accessor: (row) => getGifticonOrderMember(row).kakaoLoginId ?? '' },
  { header: '식별 아이디', accessor: (row) => row.user.identified_id },
  { header: '상품명', accessor: (row) => getGifticonOrderProductName(row) },
  { header: '상품코드', accessor: (row) => row.product_code },
  { header: '기프티콘 코드', accessor: (row) => row.voucher_code ?? '' },
  { header: '유효기간', accessor: (row) => formatGifticonValidityDays(row.valid_days) },
  { header: '상태', accessor: (row) => getGifticonOrderStatusLabel(row.status) },
  { header: '사용한 티켓', accessor: (row) => formatTicketsForCsv(row) },
];

export const GifticonSection: React.FC = () => {
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
  } = useGifticonOrders();

  const handleExport = async () => {
    const rows = await exportOrders();
    exportArrayToCsv(rows, CSV_COLUMNS, `구매내역_${dayjs().format('YYYY-MM-DD')}.csv`);
  };

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
      <GifticonToolbar onApply={applyFilters} onExport={handleExport} />

      <GifticonTable
        data={orders}
        pagination={paginationProps}
        totalLabel={isLoading ? '불러오는 중…' : `총 ${totalItems.toLocaleString('ko-KR')}건`}
      />
    </div>
  );
};
