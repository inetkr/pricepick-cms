import React from 'react';
import type { Column} from '../common/table';
import { Table } from '../common/table';
import { InfoBox } from '../stats/info-box';
import { TicketChipGroup } from '../common/ticket-chip';

export interface DebtItem {
  nickname: string;
  kakaoId: string;
  debtTicket: { type: 'bronze' | 'silver' | 'gold'; quantity: number }[];
  occurredDate: string;
  occurredTime: string;
  expectedSettle: string;
  status: '상계 대기' | '완료';
}

interface ClawbackDebtTableProps {
  data: DebtItem[];
  className?: string;
}

const renderStatusBadge = (status: string) => {
  return (
    <span className={`badge ${status === '상계 대기' ? 'badge-amber' : 'badge-green'}`}>
      {status}
    </span>
  );
};

const columns: Column<DebtItem>[] = [
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
  },
  {
    key: 'debtTickets',
    label: '부채 티켓',
    render: (item) => (
      <TicketChipGroup
          tickets={item.debtTicket.map((t) => ({ ...t, grade: t.type }))}
          bare
          showName
          showQuantity
        />
    ),
    align: 'center',
  },
  {
    key: 'occurredDate',
    label: '발생일',
    render: (item) => (
      <div style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, color: '#333333' }}>{item.occurredDate}</div>
        <div>{item.occurredTime}</div>
      </div>
    ),
    align: 'center',
  },
  {
    key: 'expectedSettle',
    label: '예상 상계일',
    render: (item) => (
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.expectedSettle}</span>
    ),
    align: 'center',
  },
  {
    key: 'status',
    label: '상태',
    render: (item) => renderStatusBadge(item.status),
    align: 'center',
  },
];

export const ClawbackDebtTable: React.FC<ClawbackDebtTableProps> = ({ data, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">환수 부채 추적</div>
        <div className="card-sub">활성 후 환불 → 부채 적재, 이후 적립에서 우선 상계</div>
      </div>
      <div style={{ padding: '16px' }}>
        <InfoBox style={{ marginBottom: '12px' }}>
          활성화된 티켓이 사용된 후 취소·반품 발생 시 즉시 회수 불가. 부채(음수 잔액)로 기록 후 다음
          적립 시 자동 상계.
        </InfoBox>
        <Table data={data} columns={columns} emptyMessage="부채 내역이 없습니다." />
      </div>
    </div>
  );
};
