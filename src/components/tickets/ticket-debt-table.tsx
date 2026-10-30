import dayjs from 'dayjs';
import React from 'react';
import type { ITicketDebt, ITicketDebtStatus } from 'src/types/tickets/ticket_debt';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';
import { TicketNameByGrade } from '../common/ticket-chip';

interface TicketDebtTableProps {
  debts: ITicketDebt[];
  isLoading?: boolean;
  pagination?: PaginationProps;
}

const DEBT_TABLE_HEADERS = ['닉네임 / 식별 아이디', '부채 티켓', '발생일', '예상 상계일', '상태'];

const DEBT_STATUS_BADGE: Record<ITicketDebtStatus, { label: string; className: string }> = {
  SCHEDULED: { label: '상계 예정', className: 'badge-blue' },
  WAITING: { label: '적립 대기', className: 'badge-amber' },
};

const emptyCellStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '30px',
  color: 'var(--text-2)',
};

const renderUser = (debt: ITicketDebt) => (
  <>
    <div style={{ fontWeight: 500 }}>
      {debt.user.nickname || '(회원 정보 없음)'}
      {debt.user.is_user_deleted && (
        <span className="badge badge-gray" style={{ marginLeft: '6px' }}>
          탈퇴
        </span>
      )}
    </div>
    <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
      {debt.user.identified_id ?? '-'}
    </div>
  </>
);

// 남은 부채를 음수로 적고, 승인 대기 중인 같은 종류 티켓이 있으면 밑에 덧붙인다
const renderDebtTicket = (debt: ITicketDebt) => (
  <>
    <TicketNameByGrade grade={debt.ticket_type} quantity={-debt.amount} />
    {debt.pending_ticket_amount > 0 && (
      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
        승인 대기 {debt.pending_ticket_amount.toLocaleString()}장
      </div>
    )}
  </>
);

const renderIncurredAt = (value: string) => {
  const d = dayjs(value);
  if (!d.isValid()) return '-';
  return (
    <>
      <div style={{ fontWeight: 700, color: '#333333' }}>{d.format('YYYY/MM/DD')}</div>
      <div style={{ color: 'var(--text-3)' }}>{d.format('HH:mm:ss')}</div>
    </>
  );
};

// 예상 상계일이 없으면(대기 중인 티켓 없음) 다음 적립 때 상계된다
const renderExpectedOffset = (value: string | null) => {
  const d = value ? dayjs(value) : null;
  if (!d?.isValid()) return <span style={{ color: 'var(--text-3)' }}>다음 적립 시</span>;
  return <span style={{ fontWeight: 700, color: '#333333' }}>{d.format('YYYY/MM/DD')}</span>;
};

const renderStatus = (status: ITicketDebtStatus) => {
  const badge = DEBT_STATUS_BADGE[status] ?? { label: status, className: 'badge-gray' };
  return <span className={`badge ${badge.className}`}>{badge.label}</span>;
};

export const TicketDebtTable: React.FC<TicketDebtTableProps> = ({
  debts,
  isLoading = false,
  pagination,
}) => {
  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={DEBT_TABLE_HEADERS.length} style={emptyCellStyle}>
            로딩 중...
          </td>
        </tr>
      );
    }
    if (debts.length === 0) {
      return (
        <tr>
          <td colSpan={DEBT_TABLE_HEADERS.length} style={emptyCellStyle}>
            환수 부채가 없습니다. (즉시 환수 불가분이 생기면 여기에 쌓입니다)
          </td>
        </tr>
      );
    }
    return debts.map((debt) => (
      <tr key={debt.id}>
        <td>{renderUser(debt)}</td>
        <td style={{ textAlign: 'center' }}>{renderDebtTicket(debt)}</td>
        <td style={{ textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
          {renderIncurredAt(debt.incurred_at)}
        </td>
        <td style={{ textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
          {renderExpectedOffset(debt.expected_offset_date)}
        </td>
        <td style={{ textAlign: 'center' }}>{renderStatus(debt.status)}</td>
      </tr>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">환수 부채 추적</div>
          <div className="card-sub">미결 추적 · 즉시 환수 불가분 · 다음 적립 시 자동 상계 대기</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {DEBT_TABLE_HEADERS.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      {pagination && debts.length > 0 && <Pagination {...pagination} />}
      <div className="info-box" style={{ margin: '12px 14px 14px' }}>
        앱 화면에는 <strong>음수를 쓰지 않습니다</strong> — 티켓 잔액을 <strong>0</strong>으로
        보여주고 「회수 예정 N장」을 따로 표시합니다. 환수 예정 수량이 보이는 자리는 앱 「내 티켓
        &amp; 포인트」 한 곳입니다.
      </div>
    </div>
  );
};
