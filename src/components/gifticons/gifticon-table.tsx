import React from 'react';
import { DateTimeCell } from 'src/components/common/date-time-cell';
import { MemberIdentityCell } from 'src/components/common/member-identity-cell';
import { UsedTicketCell } from 'src/components/common/used-ticket-cell';
import type { Column } from 'src/components/common/table-pagination-row-per-page';
import { TablePaginationRowPerPage } from 'src/components/common/table-pagination-row-per-page';
import type { PaginationProps } from 'src/components/common/pagination';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import { formatGifticonValidityDays } from 'src/utils/gifticon-products';
import { getGifticonOrderStatusLabel, getGifticonOrderStatusVariant } from 'src/utils/gifticon-orders';

const STATUS_VARIANT_COLOR: Record<
  ReturnType<typeof getGifticonOrderStatusVariant>,
  { bg: string; color: string }
> = {
  info: { bg: 'var(--info-soft)', color: 'var(--info)' },
  success: { bg: 'var(--success-soft)', color: 'var(--success)' },
  warning: { bg: 'var(--warning-soft)', color: 'var(--warning)' },
  danger: { bg: 'var(--danger-soft)', color: 'var(--danger)' },
  neutral: { bg: 'var(--surface-2)', color: 'var(--text-3)' },
};

// ----------------------------------------------------------------------

interface GifticonTableProps {
  data: IGifticonOrder[];
  pagination?: PaginationProps;
  totalLabel?: string;
  onRowClick?: (item: IGifticonOrder) => void;
}

const columns: Column<IGifticonOrder>[] = [
  {
    key: 'createdAt',
    label: '구매일',
    align: 'center',
    render: (item) => <DateTimeCell value={item.createdAt} />,
  },
  {
    key: 'orderNo',
    label: '주문번호',
    align: 'center',
    render: (item) => (
      <span
        style={{
          fontSize: '11px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: 'var(--text-3)',
          wordBreak: 'break-all',
        }}
      >
        {item.orderNo}
      </span>
    ),
  },
  {
    key: 'member',
    label: '닉네임 / 카카오톡 ID / 식별 아이디',
    align: 'center',
    render: (item) => <MemberIdentityCell member={item.member} userId={item.userId} />,
  },
  {
    key: 'productName',
    label: '상품명',
    align: 'center',
    render: (item) => (
      <span style={{ fontWeight: 500, display: 'block' }}>{item.productName}</span>
    ),
  },
  {
    key: 'productCode',
    label: '상품코드',
    align: 'center',
    render: (item) => (
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
        {item.productCode}
      </span>
    ),
  },
  {
    key: 'validDays',
    label: '유효기간',
    align: 'center',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {formatGifticonValidityDays(item.validDays)}
      </span>
    ),
  },
  {
    key: 'status',
    label: '상태',
    align: 'center',
    render: (item) => {
      const { bg, color } = STATUS_VARIANT_COLOR[getGifticonOrderStatusVariant(item.status)];
      return (
        <span
          style={{
            display: 'inline-block',
            background: bg,
            color,
            padding: '3px 8px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {getGifticonOrderStatusLabel(item.status)}
        </span>
      );
    },
  },
  {
    key: 'ticketsUsed',
    label: '사용한 티켓',
    align: 'center',
    render: (item) => <UsedTicketCell parts={item.ticketsUsed} wonAmount={item.priceWon} />,
  },
];

export const GifticonTable: React.FC<GifticonTableProps> = ({
  data,
  pagination,
  totalLabel,
  onRowClick,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">구매내역</div>
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {totalLabel ?? `총 ${data.length}건`}
      </span>
    </div>
    <TablePaginationRowPerPage
      data={data}
      columns={columns}
      pagination={pagination}
      emptyMessage="조건에 맞는 구매내역이 없습니다."
      onRowClick={onRowClick}
    />
  </div>
);
