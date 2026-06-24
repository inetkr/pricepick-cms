import React from 'react';
import { Column, Table } from '../common/table';

export interface TicketItem {
  nickname: string;
  userId: string;
  reason: string;
  ticketType: 'gold' | 'silver' | 'bronze' | 'event' | 'random';
  ticketCount: number;
  ticketLabel: string;
  datetime: string;
  date: string;
  time: string;
  status?: string;
}

// Helper để render ticket chip
const renderTicketChip = (type: string, count: number, label: string, isNegative = false) => {
  const className = `tk-chip ${type} bare`;
  const sign = isNegative ? '' : '';
  return (
    <span className={className}>
      {type === 'gold' && '골드'}
      {type === 'silver' && '실버'}
      {type === 'bronze' && '브론즈'}
      {type === 'event' && '이벤트'}
      {type === 'random' && '랜덤'}
      {count > 0 && ` ${count}장`}
    </span>
  );
};

interface TicketTableProps {
  data: TicketItem[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  data,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const columns: Column<TicketItem>[] = [
    {
      key: 'nickname',
      label: '닉네임(카카오톡 ID)',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 500 }}>{item.nickname}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
            ({item.userId})
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      label: '사유',
      render: (item) => {
        const colorMap: Record<string, string> = {
          '구매확정 전환': 'var(--success)',
          '구매 대기 (가지급)': 'var(--text-2)',
          '주간 미션 완료': '#c084fc',
          '출석 체크': '#c084fc',
          '광고 시청': '#c084fc',
          '친구초대 보상': '#c084fc',
          '기프티콘 교환 소모': 'var(--danger)',
          '경품 응모 소모': 'var(--danger)',
          '부정행위 회수': 'var(--danger)',
          '관리자 지급': 'var(--main)',
        };
        return <span style={{ color: colorMap[item.reason] || 'var(--text)' }}>{item.reason}</span>;
      },
    },
    {
      key: 'ticketLabel',
      label: '티켓',
      render: (item) => {
        const isNegative = item.reason.includes('소모') || item.reason.includes('회수');
        const className = `tk-chip ${item.ticketType} bare`;
        const label = item.ticketLabel;
        return <span className={className}>{label}</span>;
      },
    },
    {
      key: 'datetime',
      label: '일시',
      align: 'center',
      render: (item) => (
        <div
          style={{
            color: 'var(--text-3)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 700, color: '#333333' }}>{item.date}</div>
          <div>{item.time}</div>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: onPageChange || (() => {}),
      }}
    />
  );
};
