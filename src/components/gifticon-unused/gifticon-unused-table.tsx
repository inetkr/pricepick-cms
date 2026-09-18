import React from 'react';
import { DateTimeCell } from 'src/components/common/date-time-cell';
import { MemberIdentityCell } from 'src/components/common/member-identity-cell';
import { UsedTicketCell } from 'src/components/common/used-ticket-cell';
import type { Column } from 'src/components/common/table-pagination-row-per-page';
import { TablePaginationRowPerPage } from 'src/components/common/table-pagination-row-per-page';
import type { PaginationProps } from 'src/components/common/pagination';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import { formatGifticonValidityDays } from 'src/utils/gifticon-products';
import {
  getGifticonOrderMember,
  getGifticonOrderProductName,
  ticketCountsToParts,
} from 'src/utils/gifticon-orders';

// ----------------------------------------------------------------------

interface GifticonUnusedTableProps {
  data: IGifticonOrder[];
  pagination?: PaginationProps;
  totalLabel?: string;
  onCancelRequest?: (item: IGifticonOrder) => void;
}

const buildColumns = (
  onCancelRequest?: (item: IGifticonOrder) => void
): Column<IGifticonOrder>[] => [
  {
    key: 'created_at',
    label: '구매일',
    align: 'center',
    render: (item) => <DateTimeCell value={item.created_at} />,
  },
  {
    key: 'order_no',
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
        {item.order_no}
      </span>
    ),
  },
  {
    key: 'user',
    label: '닉네임 / 카카오톡 ID / 식별 아이디',
    align: 'center',
    render: (item) => (
      <MemberIdentityCell member={getGifticonOrderMember(item)} userId={item.user.identified_id} />
    ),
  },
  {
    key: 'product_name',
    label: '상품명',
    align: 'center',
    render: (item) => (
      <span style={{ fontWeight: 500, display: 'block' }}>{getGifticonOrderProductName(item)}</span>
    ),
  },
  {
    key: 'product_code',
    label: '상품코드',
    align: 'center',
    render: (item) => (
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
        {item.product_code}
      </span>
    ),
  },
  {
    key: 'valid_days',
    label: '유효기간',
    align: 'center',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {formatGifticonValidityDays(item.valid_days)}
      </span>
    ),
  },
  {
    key: 'tickets_used',
    label: '사용한 티켓',
    align: 'center',
    render: (item) => (
      <UsedTicketCell parts={ticketCountsToParts(item.tickets_used)} wonAmount={item.price_won} />
    ),
  },
  {
    key: 'remark',
    label: '비고',
    align: 'center',
    render: (item) => (
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          onCancelRequest?.(item);
        }}
      >
        관리자 취소
      </button>
    ),
  },
];

export const GifticonUnusedTable: React.FC<GifticonUnusedTableProps> = ({
  data,
  pagination,
  totalLabel,
  onCancelRequest,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">기프티콘 미사용 취소</div>
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {totalLabel ?? `총 ${data.length}건`}
      </span>
    </div>
    <TablePaginationRowPerPage
      data={data}
      columns={buildColumns(onCancelRequest)}
      pagination={pagination}
      emptyMessage="조건에 맞는 미사용 기프티콘이 없습니다."
    />
  </div>
);
