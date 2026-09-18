import React from 'react';
import type { Column } from 'src/components/common/table-pagination-row-per-page';
import { TablePaginationRowPerPage } from 'src/components/common/table-pagination-row-per-page';
import type { PaginationProps } from 'src/components/common/pagination';
import type { IGifticonBulkRow, IGifticonBulkRowStatus } from 'src/types/gifticon-bulk/gifticon_bulk';

// ----------------------------------------------------------------------

interface BulkPreviewTableProps {
  data: IGifticonBulkRow[];
  startIndex?: number;
  pagination?: PaginationProps;
}

const STATUS_LABEL: Record<IGifticonBulkRowStatus, { text: string; bg: string; color: string }> = {
  PENDING: { text: '대기', bg: 'var(--surface-2)', color: 'var(--text-3)' },
  DONE: { text: '성공', bg: 'var(--success-soft)', color: 'var(--success)' },
  ERROR: { text: '실패', bg: 'var(--danger-soft)', color: 'var(--danger)' },
};

const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const buildColumns = (startIndex: number): Column<IGifticonBulkRow>[] => [
  {
    key: 'no',
    label: 'No.',
    align: 'center',
    width: 56,
    render: (_item, index) => (
      <span style={{ color: 'var(--text-3)' }}>{startIndex + index + 1}</span>
    ),
  },
  {
    key: 'code',
    label: '코드',
    align: 'center',
    width: 110,
    render: (item) => (
      <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px' }}>
        {item.code}
      </span>
    ),
  },
  {
    key: 'name',
    label: '이름',
    align: 'left',
    render: (item) => (item.brand ? `${item.brand} ${item.name}` : item.name),
  },
  {
    key: 'description',
    label: '설명',
    align: 'left',
    render: (item) => (
      <span style={{ whiteSpace: 'normal', color: 'var(--text-2)', fontSize: '12px', maxWidth: '420px' }}>
        {truncate(item.description || '', 90)}
      </span>
    ),
  },
  {
    key: 'status',
    label: '상태',
    align: 'center',
    width: 96,
    render: (item) => {
      const s = STATUS_LABEL[item.status];
      return (
        <span
          style={{
            display: 'inline-block',
            background: s.bg,
            color: s.color,
            padding: '2px 8px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {s.text}
        </span>
      );
    },
  },
];

export const BulkPreviewTable: React.FC<BulkPreviewTableProps> = ({
  data,
  startIndex = 0,
  pagination,
}) => (
  <TablePaginationRowPerPage
    data={data}
    columns={buildColumns(startIndex)}
    pagination={pagination}
    emptyMessage={
      <div className="bt-empty">
        <div className="bt-empty-ico">🗂</div>
        No data
      </div>
    }
  />
);
