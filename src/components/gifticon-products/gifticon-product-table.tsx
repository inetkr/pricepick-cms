import React from 'react';
import type { Column} from '../common/table-pagination-row-per-page';
import { TablePaginationRowPerPage } from '../common/table-pagination-row-per-page';
import type { PaginationProps } from '../common/pagination';

export interface GifticonProduct {
  id: number;
  category: string;
  brand: string;
  name: string;
  code: string;
  expiry: string;
  valid: string;
  price: number;
  ticketGrade: 'bronze' | 'silver' | 'gold';
  ticketQty: number;
  isManual: boolean;
  manualQty: number | null;
  status: 'active' | 'soldout' | 'inactive';
}

interface GifticonProductTableProps {
  data: GifticonProduct[];
  pagination?: PaginationProps;
  onTicketEdit?: (product: GifticonProduct) => void;
  onToggleStatus?: (product: GifticonProduct) => void;
  className?: string;
}

const columns: Column<GifticonProduct>[] = [
  {
    key: 'id',
    label: 'No',
    align: 'center',
  },
  {
    key: 'category',
    label: '카테고리',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.category}</span>
    ),
    align: 'center',
  },
  {
    key: 'brand',
    label: '브랜드',
    render: (item) => <span style={{ fontSize: '12px' }}>{item.brand}</span>,
    align: 'center',
  },
  {
    key: 'name',
    label: '상품명',
    render: (item) => <span style={{ textAlign: 'left', fontWeight: 500 }}>{item.name}</span>,
    align: 'left',
  },
  {
    key: 'code',
    label: '상품코드',
    render: (item) => (
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
        {item.code}
      </span>
    ),
    align: 'center',
  },
  {
    key: 'expiry',
    label: '판매종료일',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.expiry}</span>
    ),
    align: 'center',
  },
  {
    key: 'valid',
    label: '유효기간',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.valid}</span>
    ),
    align: 'center',
  },
  {
    key: 'price',
    label: '판매 가격',
    render: (item) => <span style={{ fontWeight: 600 }}>{item.price.toLocaleString()}원</span>,
    align: 'center',
  },
  {
    key: 'ticketQty',
    label: '교환 티켓',
    render: (item) => {
      const qty = item.isManual ? item.manualQty : item.ticketQty;
      const manualBadge = item.isManual ? (
        <span className="manual-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          수동
        </span>
      ) : null;
      return (
        <span
          className={`tk-chip ${item.ticketGrade} bare`}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            // open ticket edit
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              // open ticket edit
            }
          }}
        >
          {item.ticketGrade === 'bronze'
            ? '브론즈'
            : item.ticketGrade === 'silver'
              ? '실버'
              : '골드'}{' '}
          {qty}장{manualBadge}
        </span>
      );
    },
    align: 'center',
  },
  {
    key: 'status',
    label: '상태',
    render: (item) => {
      return (
        <div
          className={`toggle ${item.status === 'active' ? 'on' : ''}`}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            // toggle status
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              // toggle status
            }
          }}
        />
      );
    },
    align: 'center',
  },
];

export const GifticonProductTable: React.FC<GifticonProductTableProps> = ({
  data,
  pagination,
  onTicketEdit,
  onToggleStatus,
  className = '',
}) => {
  // Wrap columns with handlers
  const columnsWithHandlers = columns.map((col) => {
    if (col.key === 'ticketQty') {
      return {
        ...col,
        render: (item: GifticonProduct) => {
          const qty = item.isManual ? item.manualQty : item.ticketQty;
          const manualBadge = item.isManual ? (
            <span className="manual-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              수동
            </span>
          ) : null;
          return (
            <span
              className={`tk-chip ${item.ticketGrade} bare`}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onClick={() => onTicketEdit?.(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onTicketEdit?.(item);
                }
              }}
            >
              {item.ticketGrade === 'bronze'
                ? '브론즈'
                : item.ticketGrade === 'silver'
                  ? '실버'
                  : '골드'}{' '}
              {qty}장{manualBadge}
            </span>
          );
        },
      };
    }
    if (col.key === 'status') {
      return {
        ...col,
        render: (item: GifticonProduct) => (
          <div
            className={`toggle ${item.status === 'active' ? 'on' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onToggleStatus?.(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onToggleStatus?.(item);
              }
            }}
          />
        ),
      };
    }
    return col;
  });

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">상품 목록</div>
        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>총 {data.length}개 상품</span>
      </div>
      <TablePaginationRowPerPage
        data={data}
        columns={columnsWithHandlers}
        pagination={pagination}
        emptyMessage="상품이 없습니다."
        rowClassName={(item) => (item.isManual ? 'manual-edited' : '')}
      />
    </div>
  );
};
