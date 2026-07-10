import React from 'react';
import type { IUser } from 'src/types/users/user';
import { MemberActions } from './member-actions';
import type { TicketGrade } from '../common/ticket-chip';
import { TicketChip } from '../common/ticket-chip';
import type { IAccountStatus, IMarketingConsent } from 'src/types/common';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface MemberTableProps {
  members: IUser[];
  pagination?: PaginationProps;
  onViewDetail: (id: string) => void;
  onStatusChange: (id: string, newStatus: IAccountStatus) => void;
  isSuperAdmin?: boolean;
}

const renderMemberInfo: (member: IUser) => JSX.Element = (member) => {
  if (member.kakao_id && member.kakao_info) {
    return (
      <>
        <div style={{ fontWeight: 500 }}>{member.nickname}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
          {member.username}
        </div>
      </>
    );
  }
  return (
    <>
      <div style={{ fontWeight: 500 }}>{member.nickname}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
        미연동
      </div>
    </>
  );
};

// Helper render link status
const renderLinkStatus = (member: IUser) => {
  if (member.kakao_id) {
    return <span className="member-type-kakao">카카오 연동</span>;
  }

  return (
    <span
      style={{
        background: 'var(--warning-soft)',
        color: 'var(--warning)',
        padding: '2px 8px',
        borderRadius: '99px',
        fontSize: '11px',
        fontWeight: 600,
      }}
    >
      게스트
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

// Helper render marketing badge
const renderMarketing = (type?: IMarketingConsent) => {
  if (!type) return '-';
  const classes = {
    ALL: 'mkt-badge all',
    SELECTIVE: 'mkt-badge sel',
    NONE: 'mkt-badge none',
  };
  const labels = {
    ALL: '전체 동의',
    SELECTIVE: '선택 동의',
    NONE: '전체 거부',
  };
  return <span className={classes[type]}>{labels[type]}</span>;
};

const getPendingBadge = (user: IUser) => {
  if (user.pending_gold > 0 || user.pending_bronze > 0 || user.pending_silver > 0) {
    return (
      <div className="conv-preview">
        {user.pending_bronze > 0 && (
          <TicketChip
            grade="bronze"
            quantity={user.pending_bronze}
            size="small"
            showName={false}
            prefix="+"
          />
        )}
        {user.pending_silver > 0 && (
          <TicketChip
            grade="silver"
            quantity={user.pending_silver}
            size="small"
            showName={false}
            prefix="+"
          />
        )}
        {user.pending_gold > 0 && (
          <TicketChip
            grade="gold"
            quantity={user.pending_gold}
            size="small"
            showName={false}
            prefix="+"
          />
        )}
      </div>
    );
  }
  return null;
};

const getActiveBadge = (user: IUser) => {
  const tickets: Array<{ grade: TicketGrade; quantity: number }> = [
    { grade: 'bronze', quantity: user.ticket_bronze_total },
    { grade: 'silver', quantity: user.ticket_silver_total },
    { grade: 'gold', quantity: user.ticket_gold_total },
  ];
  const dim =
    user.ticket_bronze_total === 0 &&
    user.ticket_silver_total === 0 &&
    user.ticket_gold_total === 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {tickets.map((t) => (
        <TicketChip key={t.grade} grade={t.grade} quantity={t.quantity} showName={false} dim={dim} />
      ))}
    </div>
  );
};

const getMemberStatus: (accountStatus: IAccountStatus) => { label: string; className: string } = (
  accountStatus
) => {
  switch (accountStatus) {
    case 'NORMAL':
      return { label: '정상', className: 'badge-green' };
    case 'BLOCK':
      return { label: '차단', className: 'badge-red' };
    case 'DELETE':
      return { label: '탈퇴', className: 'badge-gray' };
    default:
      return { label: '알 수 없음', className: 'badge-gray' };
  }
};

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  pagination,
  onViewDetail,
  onStatusChange,
  isSuperAdmin = true,
}) => {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>닉네임(카카오ID)</th>
            <th>연동 상태</th>
            <th>가입일</th>
            <th>랜덤 티켓</th>
            <th>전환예정</th>
            <th>등급 티켓 (브론즈/실버/골드)</th>
            <th>이벤트 티켓</th>
            <th>마케팅 수신</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
              >
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id}>
                <td>{renderMemberInfo(member)}</td>
                <td>{renderLinkStatus(member)}</td>
                <td style={{ textAlign: 'center' }}>{renderDateTime(member.created_at)}</td>
                <td>
                  {member.pending_random_tickets > 0 ? (
                    <div className="rnd-chip-wrap">
                      <TicketChip
                        grade="random"
                        quantity={member.pending_random_tickets}
                        size="small"
                        showName={false}
                      />
                      <span className="conv-arrow">→</span>
                    </div>
                  ) : (
                    <TicketChip
                      grade="random"
                      quantity={member.pending_random_tickets}
                      size="small"
                      showName={false}
                      dim
                    />
                  )}
                </td>
                <td>{getPendingBadge(member)}</td>
                <td>{getActiveBadge(member)}</td>
                <td>
                  <TicketChip
                    grade="event"
                    quantity={member.ticket_event_total}
                    size="small"
                    showName={false}
                    dim={member.ticket_event_total === 0}
                  />
                </td>
                <td>{renderMarketing(member.user_setting?.marketing_consent)}</td>
                <td>
                  <span className={`badge ${getMemberStatus(member.account_status).className}`}>
                    {getMemberStatus(member.account_status).label}
                  </span>
                </td>
                <td>
                  <MemberActions
                    memberId={member.id}
                    status={member.account_status}
                    onViewDetail={onViewDetail}
                    onStatusChange={onStatusChange}
                    isSuperAdmin={isSuperAdmin}
                  />
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
