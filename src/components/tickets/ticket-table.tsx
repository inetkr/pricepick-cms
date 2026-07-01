import React from 'react';
import { ITicket, ITicketReason } from 'src/types/tickets/ticket';
import { Pagination, PaginationProps } from '../common/pagination';
import { TicketChip } from '../common/ticket-chip';

interface TicketTableProps {
  tickets: ITicket[];
  pagination?: PaginationProps;
}

const reasonBadgeMap: Record<ITicketReason, { color: string; label: string }> = {
  PURCHASE_CONFIRM: { color: 'var(--success)', label: '구매확정 전환' },
  PURCHASE_PENDING: { color: 'var(--text-2)', label: '구매 대기 (가지급)' },
  MISSION: { color: '#c084fc', label: '주간 미션 완료' },
  ATTENDANCE: { color: '#c084fc', label: '출석 체크' },
  AD_VIEW: { color: '#c084fc', label: '광고 시청' },
  INVITE: { color: '#c084fc', label: '친구초대 보상' },
  GIFTICON_EXCHANGE: { color: 'var(--danger)', label: '기프티콘 교환 소모' },
  PRIZE_ENTRY: { color: 'var(--danger)', label: '경품 응모 소모' },
  CLAWBACK: { color: 'var(--danger)', label: '부정행위 회수' },
  ADMIN_GRANT: { color: 'var(--main)', label: '관리자 지급' },
};

const renderReasonBadge = (reason: ITicketReason) => {
  const config = reasonBadgeMap[reason] || { color: 'var(--text-2)', label: reason };
  return <span style={{ color: config.color }}>{config.label}</span>;
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
            <th>잔여 수량</th>
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
                    ({ticket.kakao_id ?? '-'})
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{renderReasonBadge(ticket.reason)}</td>
                <td style={{ textAlign: 'center' }}>
                  <TicketChip grade={ticket.grade} quantity={Math.abs(ticket.quantity)} bare />
                  {ticket.quantity < 0 && (
                    <span style={{ color: 'var(--danger)', marginLeft: 4 }}>(회수)</span>
                  )}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {ticket.balance.toLocaleString()}장
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
