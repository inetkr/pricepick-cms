import React from 'react';
import { Column, PaginationProps, Table } from '../common/table';

export interface PointsItem {
  id: number;
  nickname: string;
  kakaoId: string;
  type: string;
  points: number;
  balance: number;
  datetime: string;
  date: string;
  time: string;
}

interface PointsTableProps {
  data: PointsItem[];
  pagination?: PaginationProps;
  className?: string;
}

// Helper để render badge cho loại giao dịch
const renderTypeBadge = (type: string) => {
  const map: Record<string, { color: string; label: string }> = {
    '출석 적립': { color: '#c084fc', label: '출석 적립' },
    '티켓 교환': { color: 'var(--main)', label: '티켓 교환' },
    '관리자 지급': { color: 'var(--main)', label: '관리자 지급' },
    '사용 차감': { color: 'var(--danger)', label: '사용 차감' },
    '만료 소멸': { color: 'var(--text-2)', label: '만료 소멸' },
  };
  const config = map[type] || { color: 'var(--text-2)', label: type };
  return <span style={{ color: config.color }}>{config.label}</span>;
};

// Helper để render points với màu sắc
const renderPoints = (points: number) => {
  const isPositive = points > 0;
  const isNegative = points < 0;
  const color = isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-2)';
  const sign = isPositive ? '+' : '';
  return (
    <span style={{ color, fontWeight: 700 }}>
      {sign}
      {points.toLocaleString()}P
    </span>
  );
};

const columns: Column<PointsItem>[] = [
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
    key: 'type',
    label: '유형',
    render: (item) => renderTypeBadge(item.type),
    align: 'center',
  },
  {
    key: 'points',
    label: '포인트',
    render: (item) => renderPoints(item.points),
    align: 'center',
  },
  {
    key: 'balance',
    label: '교환 후 잔액',
    render: (item) => <span style={{ fontWeight: 600 }}>{item.balance.toLocaleString()}P</span>,
    align: 'center',
  },
  {
    key: 'datetime',
    label: '일시',
    render: (item) => (
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-3)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <div style={{ fontWeight: 700, color: '#333333' }}>{item.date}</div>
        <div>{item.time}</div>
      </div>
    ),
    align: 'center',
  },
];

export const PointsTable: React.FC<PointsTableProps> = ({ data, pagination, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">최근 포인트 이력</div>
      </div>
      <Table
        data={data}
        columns={columns}
        pagination={pagination}
        emptyMessage="조회된 포인트 이력이 없습니다."
      />
    </div>
  );
};
