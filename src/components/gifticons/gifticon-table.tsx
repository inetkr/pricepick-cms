// src/components/gifticons/GifticonTable.tsx
import React from 'react';
import { TicketChip } from '../common/ticket-chip';
import { Column, TablePaginationRowPerPage } from '../common/table-pagination-row-per-page';
import { PaginationProps } from '../common/pagination';

export interface GifticonItem {
  id: number;
  purchaseDate: string;
  purchaseTime: string;
  statusDate: string;
  statusTime: string;
  orderNumber: string;
  nickname: string;
  kakaoId: string;
  productName: string;
  productCode: string;
  expiryDate: string;
  status: 'used' | 'unused' | 'expired';
  ticketGrade: 'bronze' | 'silver' | 'gold';
  ticketQuantity: number;
}

interface GifticonTableProps {
  data: GifticonItem[];
  pagination?: PaginationProps;
  onRowClick?: (item: GifticonItem) => void;
  className?: string;
}

const statusBadgeMap = {
  used: { className: 'badge-red', label: '사용' },
  unused: { className: 'badge-gray', label: '미사용' },
  expired: { className: 'badge-amber', label: '만료' },
};

const columns: Column<GifticonItem>[] = [
  {
    key: 'purchaseDate',
    label: '구매일',
    render: (item) => (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, color: '#333333' }}>{item.purchaseDate}</div>
        <div style={{ color: 'var(--text-3)' }}>{item.purchaseTime}</div>
      </div>
    ),
    align: 'center',
  },
  {
    key: 'statusDate',
    label: '상태변경일',
    render: (item) => (
      <div style={{ textAlign: 'center' }}>
        {item.statusDate !== '—' ? (
          <>
            <div style={{ fontWeight: 700, color: '#333333' }}>{item.statusDate}</div>
            <div style={{ color: 'var(--text-3)' }}>{item.statusTime}</div>
          </>
        ) : (
          <span style={{ color: 'var(--text-3)' }}>—</span>
        )}
      </div>
    ),
    align: 'center',
  },
  {
    key: 'orderNumber',
    label: '주문번호',
    render: (item) => (
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
        {item.orderNumber}
      </span>
    ),
    align: 'center',
  },
  {
    key: 'nickname',
    label: '닉네임(카카오톡 ID)',
    render: (item) => (
      <div>
        <div style={{ fontWeight: 500 }}>{item.nickname}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
          ({item.kakaoId})
        </div>
      </div>
    ),
    align: 'left',
  },
  {
    key: 'productName',
    label: '상품명',
    render: (item) => <span style={{ textAlign: 'left' }}>{item.productName}</span>,
    align: 'left',
  },
  {
    key: 'productCode',
    label: '상품코드',
    render: (item) => (
      <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{item.productCode}</span>
    ),
    align: 'center',
  },
  {
    key: 'expiryDate',
    label: '유효기간',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.expiryDate}</span>
    ),
    align: 'center',
  },
  {
    key: 'status',
    label: '상태',
    render: (item) => {
      const badge = statusBadgeMap[item.status];
      return <span className={`badge ${badge.className}`}>{badge.label}</span>;
    },
    align: 'center',
  },
  {
    key: 'ticket',
    label: '소모 티켓',
    render: (item) => (
      <TicketChip grade={item.ticketGrade} quantity={item.ticketQuantity} bare showQuantity />
    ),
    align: 'center',
  },
];

export const GifticonTable: React.FC<GifticonTableProps> = ({
  data,
  pagination,
  onRowClick,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">구매/사용 내역</div>
        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>총 {data.length}건</span>
      </div>
      <TablePaginationRowPerPage
        data={data}
        columns={columns}
        pagination={pagination}
        emptyMessage="조회된 내역이 없습니다."
        onRowClick={onRowClick}
      />
    </div>
  );
};
