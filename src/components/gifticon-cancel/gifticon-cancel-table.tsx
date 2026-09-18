import React from 'react';
import { DateTimeCell } from 'src/components/common/date-time-cell';
import { MemberIdentityCell } from 'src/components/common/member-identity-cell';
import { UsedTicketCell } from 'src/components/common/used-ticket-cell';
import type { Column } from 'src/components/common/table-pagination-row-per-page';
import { TablePaginationRowPerPage } from 'src/components/common/table-pagination-row-per-page';
import type { PaginationProps } from 'src/components/common/pagination';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';
import {
  getGifticonOrderCancelReason,
  getGifticonOrderMember,
  getGifticonOrderProductName,
  ticketCountsToParts,
} from 'src/utils/gifticon-orders';

// ----------------------------------------------------------------------

interface GifticonCancelTableProps {
  data: IGifticonOrder[];
  startIndex?: number;
  pagination?: PaginationProps;
  totalLabel?: string;
}

const buildColumns = (startIndex: number): Column<IGifticonOrder>[] => [
  {
    key: 'no',
    label: 'No',
    align: 'center',
    width: 56,
    render: (_item, index) => (
      <span style={{ color: 'var(--text-3)' }}>{startIndex + index + 1}</span>
    ),
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
    key: 'cancelled_at',
    label: '취소날짜',
    align: 'center',
    render: (item) => <DateTimeCell value={item.cancelled_at} />,
  },
  {
    key: 'cancel_reason',
    label: '상태',
    align: 'center',
    render: (item) => (
      <span
        style={{
          display: 'inline-block',
          background: 'var(--danger-soft)',
          color: 'var(--danger)',
          padding: '3px 8px',
          borderRadius: '99px',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        {getGifticonOrderCancelReason(item) ?? '관리자 취소'}
      </span>
    ),
  },
  {
    key: 'refunded_tickets',
    label: '환불 티켓',
    align: 'center',
    render: (item) => (
      <UsedTicketCell
        parts={ticketCountsToParts(item.refunded_tickets)}
        wonAmount={item.price_won}
        negative
      />
    ),
  },
  {
    key: 'holdings',
    label: '보유 티켓',
    align: 'center',
    // tickets_after — 이 취소 건으로 환불된 뒤 회원이 들고 있게 된 등급 티켓.
    // 원화 병기(tickets_after_won)는 서버가 계산해 내려준 값을 그대로 쓴다.
    render: (item) => (
      <UsedTicketCell parts={ticketCountsToParts(item.tickets_after)} wonAmount={item.tickets_after_won} />
    ),
  },
];

export const GifticonCancelTable: React.FC<GifticonCancelTableProps> = ({
  data,
  startIndex = 0,
  pagination,
  totalLabel,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">취소 내역</div>
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {totalLabel ?? `총 ${data.length}건`}
      </span>
    </div>
    <TablePaginationRowPerPage
      data={data}
      columns={buildColumns(startIndex)}
      pagination={pagination}
      emptyMessage="조건에 맞는 취소내역이 없습니다."
    />
  </div>
);
