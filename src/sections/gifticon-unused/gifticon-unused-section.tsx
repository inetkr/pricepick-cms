'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { exportArrayToCsv, type CsvColumn } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { GifticonUnusedCancelModal } from 'src/components/gifticon-unused/gifticon-unused-cancel-modal';
import { GifticonUnusedTable } from 'src/components/gifticon-unused/gifticon-unused-table';
import { GifticonUnusedToolbar } from 'src/components/gifticon-unused/gifticon-unused-toolbar';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import { useGifticonUnusedOrders } from 'src/sections/gifticon-unused/hooks/use-gifticon-unused';
import { formatGifticonTicketPartText, formatGifticonValidityDays } from 'src/utils/gifticon-products';

const formatTicketsForCsv = (order: IGifticonOrder): string => {
  if (!order.ticketsUsed.length) return '—';
  const lines = order.ticketsUsed.map(formatGifticonTicketPartText);
  lines.push(`(${order.priceWon.toLocaleString('ko-KR')}원)`);
  return lines.join('\n');
};

const CSV_COLUMNS: CsvColumn<IGifticonOrder>[] = [
  { header: '구매일시', accessor: (row) => dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') },
  { header: '주문번호', accessor: (row) => row.orderNo },
  { header: '닉네임', accessor: (row) => row.member.nickname ?? '' },
  { header: '카카오톡 ID', accessor: (row) => row.member.kakaoLoginId ?? '' },
  { header: '식별 아이디', accessor: (row) => row.userId },
  { header: '상품명', accessor: (row) => row.productName },
  { header: '상품코드', accessor: (row) => row.productCode },
  { header: '기프티콘 코드', accessor: (row) => row.voucherCode ?? '' },
  { header: '유효기간', accessor: (row) => formatGifticonValidityDays(row.validDays) },
  { header: '사용한 티켓', accessor: (row) => formatTicketsForCsv(row) },
];

export const GifticonUnusedSection: React.FC = () => {
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
    cancelOrder,
  } = useGifticonUnusedOrders();
  const [cancelTarget, setCancelTarget] = useState<IGifticonOrder | null>(null);

  const handleExport = async () => {
    const rows = await exportOrders();
    exportArrayToCsv(rows, CSV_COLUMNS, `기프티콘미사용취소_${dayjs().format('YYYY-MM-DD')}.csv`);
  };

  const handleConfirmCancel = async (id: string) => {
    try {
      await cancelOrder(id);
      setCancelTarget(null);
      toast.success('기프티콘 구매를 관리자 취소 처리했습니다.');
    } catch (error) {
      console.error('Failed to cancel gifticon order:', error);
      toast.error('취소 처리에 실패했습니다.');
    }
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
      <GifticonUnusedToolbar onApply={applyFilters} onExport={handleExport} />

      <GifticonUnusedTable
        data={orders}
        pagination={paginationProps}
        totalLabel={isLoading ? '불러오는 중…' : `총 ${totalItems.toLocaleString('ko-KR')}건`}
        onCancelRequest={setCancelTarget}
      />

      {cancelTarget && (
        <GifticonUnusedCancelModal
          key={cancelTarget.id}
          order={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};
