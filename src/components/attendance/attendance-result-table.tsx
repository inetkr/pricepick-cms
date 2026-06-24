// src/components/attendance/AttendanceResultTable.tsx
import React from 'react';
import { Column, Table } from '../common/table';

export interface AttendanceResultItem {
  rank: string;
  nickname: string;
  id: string;
  thisWeek: '당첨' | '미당첨';
  total: number;
  ticketsUsed: number;
}

interface AttendanceResultTableProps {
  data: AttendanceResultItem[];
  onRowClick?: (item: AttendanceResultItem) => void;
}

export const AttendanceResultTable: React.FC<AttendanceResultTableProps> = ({
  data,
  onRowClick,
}) => {
  const columns: Column<AttendanceResultItem>[] = [
    {
      key: 'rank',
      label: '순위',
      render: (item) => (
        <span style={{ fontSize: '18px' }}>
          {item.rank === '🥇'
            ? '🥇'
            : item.rank === '🥈'
              ? '🥈'
              : item.rank === '🥉'
                ? '🥉'
                : item.rank}
        </span>
      ),
    },
    {
      key: 'nickname',
      label: '닉네임(카카오톡 ID)',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 500 }}>{item.nickname}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
            ({item.id})
          </div>
        </div>
      ),
    },
    {
      key: 'thisWeek',
      label: '이번주',
      render: (item) => (
        <span style={{ color: item.thisWeek === '당첨' ? '#c084fc' : 'var(--text-2)' }}>
          {item.thisWeek}
        </span>
      ),
    },
    {
      key: 'total',
      label: '누적',
      render: (item) => <span>{item.total}회</span>,
    },
    {
      key: 'ticketsUsed',
      label: '응모 사용 티켓',
      render: (item) => <span className="tk-chip event bare">{item.ticketsUsed}장</span>,
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">이번주 추첨 현황</div>
      </div>
      <Table data={data} columns={columns} onRowClick={onRowClick} />
    </div>
  );
};
