import React from 'react';
import { ITicket } from 'src/types/tickets/ticket';
import { Pagination, PaginationProps } from '../common/pagination';
import { TicketChip, TicketChipGroup, TicketGrade } from '../common/ticket-chip';
import { ITransactionTypeGroup, IUsageStatus } from 'src/types/common';

interface TicketTableProps {
  tickets: ITicket[];
  pagination?: PaginationProps;
}

const reasonBadgeMap: Record<ITransactionTypeGroup, { color: string; label: string }> = {
  ADMIN_ADD: { color: 'var(--success)', label: '구매확정 전환' },
  COUPANG_PURCHASE: { color: 'var(--text-2)', label: '구매 대기 (가지급)' },
  WEEKLY_TASK: { color: '#c084fc', label: '주간 미션 완료' },
  ATTENDANCE: { color: '#c084fc', label: '출석 체크' },
  AD_WATCH: { color: '#c084fc', label: '광고 시청' },
  FRIEND_INVITE: { color: '#c084fc', label: '친구초대 보상' },
  // GIFTICON_EXCHANGE: { color: 'var(--danger)', label: '기프티콘 교환 소모' },
  // PRIZE_ENTRY: { color: 'var(--danger)', label: '경품 응모 소모' },
  // CLAWBACK: { color: 'var(--danger)', label: '부정행위 회수' },
  // ADMIN_GRANT: { color: 'var(--main)', label: '관리자 지급' },
};

const renderReasonBadge = (reason: ITransactionTypeGroup) => {
  const config = reasonBadgeMap[reason] || { color: 'var(--text-2)', label: reason };
  return <span style={{ color: config.color }}>{config.label}</span>;
};

const usageStatusBadgeMap: Record<
  IUsageStatus,
  { color: string; background: string; border: string; label: string }
> = {
  HOLDING: { color: '#1f9d57', background: '#e6f7ec', border: '#b6e6c8', label: '보유 중' },
  PENDING: { color: '#d97a17', background: '#fdf1e3', border: '#f3d2a0', label: '가지급(대기)' },
  USED: { color: '#6b7280', background: '#f3f4f6', border: '#e5e7eb', label: '사용 완료' },
  ADMIN_SUB: { color: '#dc2626', background: '#fef2f2', border: '#fecaca', label: '회수' },
  REJECTED: { color: '#dc2626', background: '#fef2f2', border: '#fecaca', label: '거절' },
};

const renderStatusBadge = (status: IUsageStatus) => {
  const config = usageStatusBadgeMap[status] || {
    color: 'var(--text-2)',
    background: '#f3f4f6',
    border: '#e5e7eb',
    label: status,
  };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: 700,
        color: config.color,
        background: config.background,
        border: `1px solid ${config.border}`,
        borderRadius: '20px',
        padding: '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
};

const renderDateTime = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return (
    <>
      <div style={{ fontWeight: 700, color: '#333333' }}>{`${year}/${month}/${day}`}</div>
      <div style={{ color: 'var(--text-3)' }}>{`${hours}:${minutes}:${seconds}`}</div>
    </>
  );
};

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, pagination }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">최근 티켓 이력</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>닉네임(카카오톡 ID)</th>
            <th>사유</th>
            <th>티켓</th>
            <th>상태</th>
            <th>일시</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
              >
                조회된 티켓 이력이 없습니다.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{ticket.nickname}</div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}
                  >
                    ({ticket.username ?? '-'})
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{ticket.description}</td>
                <td style={{ textAlign: 'center' }}>
                  <TicketChipGroup
                    tickets={Object.entries(ticket.ticket_breakdown)
                      .filter(([, quantity]) => quantity !== 0)
                      .map(([grade, quantity]) => ({ grade: grade as TicketGrade, quantity }))}
                    bare
                    showQuantity
                    showName
                  />
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {renderStatusBadge(ticket.usage_status)}
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {renderDateTime(ticket.updated_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};
