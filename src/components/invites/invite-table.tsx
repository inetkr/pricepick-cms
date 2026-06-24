// src/components/invite/InviteTable.tsx
import React from 'react';
import { Column, Table } from '../common/table';

export interface InviteItem {
  rank: number;
  nickname: string;
  kakaoId: string;
  totalInvites: number;
  successInvites: number;
  points: number;
  monthly: number;
}

interface InviteTableProps {
  data: InviteItem[];
  className?: string;
}

const columns: Column<InviteItem>[] = [
  {
    key: 'rank',
    label: '순위',
    render: (item) => <span style={{ fontWeight: 700 }}>{item.rank}</span>,
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
    key: 'totalInvites',
    label: '누적 초대',
    render: (item) => <span>{item.totalInvites}명</span>,
    align: 'center',
  },
  {
    key: 'successInvites',
    label: '성공 초대',
    render: (item) => <span>{item.successInvites}명</span>,
    align: 'center',
  },
  {
    key: 'points',
    label: '지급 포인트',
    render: (item) => <span>{item.points.toLocaleString()}P</span>,
    align: 'center',
  },
  {
    key: 'monthly',
    label: '이번달',
    render: (item) => <span>{item.monthly}명</span>,
    align: 'center',
  },
];

export const InviteTable: React.FC<InviteTableProps> = ({ data, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">초대 현황 TOP 10</div>
      </div>
      <Table data={data} columns={columns} emptyMessage="초대 내역이 없습니다." />
    </div>
  );
};
