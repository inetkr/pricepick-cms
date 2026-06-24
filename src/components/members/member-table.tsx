// src/components/members/MemberTable.tsx
import React from 'react';
import { Member } from 'src/types/members/member';
import { MemberActions } from './member-actions';
import { TicketChip, TicketChipGroup } from '../common/ticket-chip';

interface MemberTableProps {
  members: Member[];
  onViewDetail: (id: number) => void;
  onStatusChange: (id: number, newStatus: '정상' | '정지' | '탈퇴') => void;
  isSuperAdmin?: boolean;
}

// Helper render join type
const renderJoinType = (accounts: Member['accounts']) => {
  if (accounts.length === 1 && accounts[0].type === 'kakao') {
    return (
      <>
        <span className="member-type-kakao">카카오</span>
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
          연동 {accounts[0].joinDate}
        </div>
      </>
    );
  }

  return (
    <>
      <span
        style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 700,
          color: '#d97a17',
          background: '#fdf1e3',
          border: '1px solid #f3d2a0',
          borderRadius: '20px',
          padding: '3px 10px',
        }}
      >
        게스트(미연동)
      </span>
      <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
        적립만 누적 · 사용 불가
      </div>
    </>
  );
};

// Helper render marketing badge
const renderMarketing = (type: 'all' | 'sel' | 'none') => {
  const classes = {
    all: 'mkt-badge all',
    sel: 'mkt-badge sel',
    none: 'mkt-badge none',
  };
  const labels = {
    all: '전체 동의',
    sel: '선택 동의',
    none: '전체 거부',
  };
  return <span className={classes[type]}>{labels[type]}</span>;
};

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onViewDetail,
  onStatusChange,
  isSuperAdmin = true,
}) => {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>닉네임 / 식별자</th>
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
                <td>
                  <div style={{ fontWeight: 500 }}>{member.nickname}</div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}
                  >
                    {member.kakaoId}
                  </div>
                </td>
                <td>{renderJoinType(member.accounts)}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#333333' }}>{member.joinDate}</div>
                  <div style={{ color: 'var(--text-3)' }}>{member.joinTime}</div>
                </td>
                <td>
                  <div className="rnd-chip-wrap">
                    <TicketChip
                      grade="random"
                      quantity={member.randomTicket}
                      size="small"
                      showName={false}
                      dim={member.randomTicket === 0}
                    />
                    {member.randomTicket > 0 && <span className="conv-arrow">→</span>}
                  </div>
                </td>
                <td>
                  {member.conversion.length > 0 ? (
                    <div className="conv-preview">
                      {member.conversion.map((c, idx) => (
                        <TicketChip
                          key={idx}
                          grade={c.type}
                          quantity={Number(c.n)}
                          size="small"
                          showName={false}
                          dim={Number(c.n) === 0}
                        />
                      ))}
                    </div>
                  ) : null}
                </td>
                <td>
                  {
                    <TicketChipGroup
                      tickets={Object.entries(member.tickets.grade).map(([grade, quantity]) => ({
                        grade: grade as 'bronze' | 'silver' | 'gold',
                        quantity,
                      }))}
                      showName={false}
                      showQuantity={true}
                      dim={
                        member.tickets.grade.bronze === 0 &&
                        member.tickets.grade.silver === 0 &&
                        member.tickets.grade.gold === 0
                      }
                    />
                  }
                </td>
                <td>
                  <TicketChip
                    grade="event"
                    quantity={member.tickets.event}
                    size="small"
                    showName={false}
                    dim={member.tickets.event === 0}
                  />
                </td>
                <td>{renderMarketing(member.marketing)}</td>
                <td>
                  <span
                    className={`badge ${member.status === '정상' ? 'badge-green' : member.status === '정지' ? 'badge-red' : 'badge-gray'}`}
                  >
                    {member.status}
                  </span>
                </td>
                <td>
                  <MemberActions
                    memberId={member.id}
                    status={member.status}
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
    </div>
  );
};
