import React from 'react';
import type { Column, PaginationProps} from '../common/table';
import { Table } from '../common/table';

export interface NoticeItem {
  id: number;
  title: string;
  category: string;
  publishedDate: string;
  views: number;
  isPublished: boolean;
  isPinned: boolean;
}

interface NoticeTableProps {
  data: NoticeItem[];
  pagination?: PaginationProps;
  onEdit?: (item: NoticeItem) => void;
  onDelete?: (item: NoticeItem) => void;
  onToggleStatus?: (item: NoticeItem) => void;
  className?: string;
}

const categoryMap: Record<string, { label: string; className: string }> = {
  general: { label: '일반', className: 'badge-gray' },
  maintenance: { label: '서비스 점검', className: 'badge-amber' },
  update: { label: '업데이트', className: 'badge-purple' },
  policy: { label: '정책 변경', className: 'badge-red' },
  event: { label: '이벤트', className: 'badge-green' },
};

const columns: Column<NoticeItem>[] = [
  {
    key: 'title',
    label: '제목',
    render: (item) => <span style={{ fontWeight: 500 }}>{item.title}</span>,
    align: 'left',
  },
  {
    key: 'category',
    label: '분류',
    render: (item) => {
      const cat = categoryMap[item.category] || categoryMap.general;
      return <span className={`badge ${cat.className}`}>{cat.label}</span>;
    },
    align: 'center',
  },
  {
    key: 'publishedDate',
    label: '게시일',
    render: (item) => (
      <div style={{ fontWeight: 700, color: '#333333', whiteSpace: 'nowrap' }}>
        {item.publishedDate}
      </div>
    ),
    align: 'center',
  },
  {
    key: 'views',
    label: '조회수',
    render: (item) => item.views.toLocaleString(),
    align: 'center',
  },
  {
    key: 'isPublished',
    label: '노출',
    render: (item) => (
      <span className={`badge ${item.isPublished ? 'badge-green' : 'badge-gray'}`}>
        {item.isPublished ? '노출' : '숨김'}
      </span>
    ),
    align: 'center',
  },
  {
    key: 'actions',
    label: '관리',
    render: (item) => (
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          수정
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          삭제
        </button>
      </div>
    ),
    align: 'center',
  },
];

export const NoticeTable: React.FC<NoticeTableProps> = ({
  data,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  className = '',
}) => {
  // Wrap columns with handlers
  const columnsWithHandlers = columns.map((col) => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (item: NoticeItem) => (
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit?.(item)}>
              수정
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm('이 공지를 삭제하시겠습니까?')) {
                  onDelete?.(item);
                }
              }}
            >
              삭제
            </button>
          </div>
        ),
      };
    }
    if (col.key === 'isPublished') {
      return {
        ...col,
        render: (item: NoticeItem) => (
          <div
            className={`toggle ${item.isPublished ? 'on' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onToggleStatus?.(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onToggleStatus?.(item);
              }
            }}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          />
        ),
      };
    }
    return col;
  });

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">공지 목록</div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>총 {data.length}건</div>
      </div>
      <Table
        data={data}
        columns={columnsWithHandlers}
        pagination={pagination}
        emptyMessage="공지사항이 없습니다."
      />
    </div>
  );
};
