import React from 'react';
import type { ITicket } from 'src/types/tickets/ticket';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';
import { TicketNameByGrade } from '../common/ticket-chip';
import type { IUsageStatus } from 'src/types/common';

interface TicketTableProps {
  tickets: ITicket[];
  pagination?: PaginationProps;
}

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
            <th>닉네임 / 카카오톡 ID / 식별 아이디</th>
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
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    {ticket.kakao_nickname ?? '게스트(비연동)'}
                  </div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}
                  >
                    {ticket.identified_id ?? '-'}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--success)' }}>{ticket.description}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <TicketNameByGrade grade={ticket.ticket_type} quantity={ticket.amount} />
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {renderStatusBadge(ticket.usage_status)}
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {renderDateTime(ticket.created_at)}
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
