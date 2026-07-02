// src/components/draws/DrawTable.tsx
import React from 'react';
import type { Column} from '../common/table';
import { Table } from '../common/table';
import { DrawStatusBadge } from './draw-status-badge';

export interface DrawItem {
  id: string | number;
  round: string;
  prizes: Array<{ rank: string; name: string; count: number }>;
  period: string;
  deadline: string;
  ticketCount: number;
  winners: Array<{ rank: string; count: number }>;
  status: '진행 중' | '완료' | '예정' | '마감';
}

interface DrawTableProps {
  data: DrawItem[];
  onDraw: (id: string | number) => void;
  onViewResult: (id: string | number) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
}

export const DrawTable: React.FC<DrawTableProps> = ({
  data,
  onDraw,
  onViewResult,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
}) => {
  const columns: Column<DrawItem>[] = [
    {
      key: 'round',
      label: '회차',
      render: (item) => <strong>{item.round}</strong>,
    },
    {
      key: 'prizes',
      label: '경품 구성',
      render: (item) => (
        <div style={{ fontSize: '12px', lineHeight: '1.8', textAlign: 'center' }}>
          {item.prizes.map((prize, idx) => (
            <div key={idx}>
              {prize.rank} {prize.name} ×{prize.count}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'period',
      label: '추첨 기간',
    },
    {
      key: 'deadline',
      label: '마감일',
      render: (item) => {
        const isUrgent = item.status === '진행 중' && item.deadline.includes('D-1');
        return (
          <strong style={{ color: isUrgent ? 'var(--danger)' : 'var(--text)' }}>
            {item.deadline}
          </strong>
        );
      },
    },
    {
      key: 'ticketCount',
      label: '참여 티켓',
      render: (item) => `${item.ticketCount.toLocaleString()  }장`,
    },
    {
      key: 'winners',
      label: '당첨자',
      render: (item) => (
        <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
          {item.winners.map((winner, idx) => (
            <div key={idx}>
              {winner.rank} {winner.count}명
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (item) => <DrawStatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      label: '액션',
      render: (item) => {
        if (item.status === '진행 중') {
          return (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onDraw(item.id)}>
              당첨 처리
            </button>
          );
        }
        if (item.status === '완료') {
          return (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onViewResult(item.id)}
            >
              결과 보기
            </button>
          );
        }
        return <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>—</span>;
      },
    },
  ];

  return <Table data={data} columns={columns} />;
};
