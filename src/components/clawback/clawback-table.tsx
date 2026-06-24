// src/components/clawback/ClawbackTable.tsx
import React from 'react';
import { Column, PaginationProps, Table } from '../common/table';
import { TicketChipGroup } from '../common/ticket-chip';

export interface ClawbackItem {
  id: number;
  datetime: string;
  nickname: string;
  kakaoId: string;
  orderId: string;
  tickets: Array<{
    type: 'bronze' | 'silver' | 'gold';
    quantity: number;
  }>;
  reason: 'cancel' | 'return' | 'expire';
  originalDate: string;
  originalTime: string;
}

interface ClawbackTableProps {
  data: ClawbackItem[];
  pagination?: PaginationProps;
  onViewDetail?: (item: ClawbackItem) => void;
  onViewLog?: (item: ClawbackItem) => void;
  className?: string;
}

const renderBadge = (reason: string) => {
  const map: Record<string, { className: string; label: string }> = {
    cancel: { className: 'badge-amber', label: '취소' },
    return: { className: 'badge-red', label: '반품' },
    expire: { className: 'badge-gray', label: '만료' },
  };
  const config = map[reason] || map.cancel;
  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

const columns: Column<ClawbackItem>[] = [
  {
    key: 'datetime',
    label: '처리일시',
    render: (item) => <span dangerouslySetInnerHTML={{ __html: item.datetime }} />,
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
    key: 'orderId',
    label: '주문 ID',
    render: (item) => (
      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-2)' }}>
        {item.orderId}
      </span>
    ),
    align: 'center',
  },
  {
    key: 'tickets',
    label: '환수 티켓',
    render: (item) => (
      <TicketChipGroup
        tickets={item.tickets.map((t) => ({ ...t, grade: t.type }))}
        bare
        showName
        showQuantity
      />
    ),
    align: 'center',
  },
  {
    key: 'reason',
    label: '원인',
    render: (item) => renderBadge(item.reason),
    align: 'center',
  },
  {
    key: 'originalDate',
    label: '원 적립일',
    render: (item) => (
      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
        <div style={{ fontWeight: 700, color: '#333333' }}>{item.originalDate}</div>
        <div>{item.originalTime}</div>
      </div>
    ),
    align: 'center',
  },
  {
    key: 'actions',
    label: '상세',
    render: (item) => (
      <button
        className="btn btn-ghost btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          // TODO: open detail modal or navigate
          console.log('View detail:', item);
        }}
      >
        상세
      </button>
    ),
    align: 'center',
  },
];

export const ClawbackTable: React.FC<ClawbackTableProps> = ({
  data,
  pagination,
  onViewDetail,
  onViewLog,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">티켓 회수·소멸 이력</div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
          취소·반품 회수 및 유효기간 만료 소멸 자동 처리
        </div>
      </div>
      <Table
        data={data}
        columns={columns}
        pagination={pagination}
        emptyMessage="조회된 환수 이력이 없습니다."
        // rowClassName={(item) => (item.reason === 'return' ? 'manual-edited' : '')}
      />
    </div>
  );
};
