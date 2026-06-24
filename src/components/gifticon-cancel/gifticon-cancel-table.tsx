// src/components/gifticon/GifticonCancelTable.tsx
import React from 'react';
import { Column, TablePaginationRowPerPage } from '../common/table-pagination-row-per-page';
import { TicketChipGroup } from '../common/ticket-chip';
import { PaginationProps } from '../common/pagination';

export interface GifticonCancelItem {
  id: number;
  orderNumber: string;
  nickname: string;
  kakaoId: string;
  productName: string;
  cancelDate: string;
  cancelTime: string;
  reason: 'admin' | 'customer' | 'expire';
  refundTicket: {
    grade: 'bronze' | 'silver' | 'gold';
    quantity: number;
  };
  remainingTicket: {
    grade: 'bronze' | 'silver' | 'gold';
    quantity: number;
  };
}

interface GifticonCancelTableProps {
  data: GifticonCancelItem[];
  pagination?: PaginationProps;
  className?: string;
}

const renderReasonBadge = (reason: string) => {
  const map: Record<string, { className: string; label: string }> = {
    admin: { className: 'badge-amber', label: '관리자 취소' },
    customer: { className: 'badge-blue', label: '고객 요청' },
    expire: { className: 'badge-gray', label: '유효기간 만료' },
  };
  const config = map[reason] || map.admin;
  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

const columns: Column<GifticonCancelItem>[] = [
  {
    key: 'id',
    label: 'No',
    align: 'center',
  },
  {
    key: 'orderNumber',
    label: '주문번호',
    render: (item) => (
      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-2)' }}>
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
    key: 'cancelDate',
    label: '취소날짜',
    render: (item) => (
      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
        <div style={{ fontWeight: 700, color: '#333333' }}>{item.cancelDate}</div>
        <div>{item.cancelTime}</div>
      </div>
    ),
    align: 'center',
  },
  {
    key: 'reason',
    label: '취소사유',
    render: (item) => renderReasonBadge(item.reason),
    align: 'center',
  },
  {
    key: 'refundTicket',
    label: '환불 티켓',
    render: (item) => (
      <TicketChipGroup
        tickets={[item.refundTicket].map((t) => ({ ...t, grade: t.grade }))}
        bare
        showName
        showQuantity
      />
    ),
    align: 'center',
  },
  {
    key: 'remainingTicket',
    label: '잔여 티켓',
    render: (item) => (
      <TicketChipGroup
        tickets={[item.remainingTicket].map((t) => ({ ...t, grade: t.grade }))}
        bare
        showName
        showQuantity
      />
    ),
    align: 'center',
  },
];

export const GifticonCancelTable: React.FC<GifticonCancelTableProps> = ({
  data,
  pagination,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">취소 내역</div>
        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>총 {data.length}건</span>
      </div>
      <TablePaginationRowPerPage
        data={data}
        columns={columns}
        pagination={pagination}
        emptyMessage="취소 내역이 없습니다."
      />
      {/* {pagination && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
            {pagination.currentPage * 10 - 9}–{Math.min(pagination.currentPage * 10, data.length)} /{' '}
            {data.length}
          </span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              이전
            </button>
            <span style={{ fontSize: '12px', padding: '0 8px' }}>
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              다음
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};
