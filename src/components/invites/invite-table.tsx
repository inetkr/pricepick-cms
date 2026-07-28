// src/components/invite/InviteTable.tsx
import React from 'react';
import type { Column } from '../common/table';
import { Table } from '../common/table';
import type { IInvite } from 'src/types/invites/invite';

interface InviteTableProps {
  data: IInvite[];
  className?: string;
}

const columns: Column<IInvite>[] = [
  {
    key: 'rank',
    label: '순위',
    render: (_item, index) => <span style={{ fontWeight: 700 }}>{index + 1}</span>,
    align: 'center',
  },
  {
    key: 'nickname',
    label: '닉네임 / 카카오톡 ID / 식별 아이디',
    render: (item) => (
      <div>
        <div style={{ fontWeight: 500 }}>{item.nickname}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
          {item.kakao_info?.email ?? '게스트(비연동)'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}>
          {item.identified_id}
        </div>
      </div>
    ),
    align: 'center',
  },
  {
    key: 'total_invited',
    label: '누적 초대',
    render: (item) => <span>{item.total_invited}명</span>,
    align: 'center',
  },
  {
    key: 'total_completed',
    label: '성공 초대',
    render: (item) => <span>{item.total_completed}명</span>,
    align: 'center',
  },
  {
    key: 'points_granted',
    label: '지급 포인트',
    render: (item) => <span>{item.points_granted.toLocaleString()}P</span>,
    align: 'center',
  },
  {
    key: 'invited_this_month',
    label: '이번달',
    render: (item) => <span>{item.invited_this_month}명</span>,
    align: 'center',
  },
];

export const InviteTable: React.FC<InviteTableProps> = ({ data, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">초대 현황 TOP 10</div>
      </div>
      <Table
        data={data}
        columns={columns}
        keyExtractor={(item) => item.user_id}
        emptyMessage="초대 내역이 없습니다."
      />
    </div>
  );
};
