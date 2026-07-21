import React from 'react';
import type { IUser } from 'src/types/users/user';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface WithdrawalTableProps {
  members: IUser[];
  pagination?: PaginationProps;
  onViewDetail: (member: IUser) => void;
}

const renderMemberInfo = (member: IUser) => (
  <>
    <div style={{ fontWeight: 500 }}>{member.nickname}</div>
    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
      {member.kakao_id ?? '게스트(비연동)'}
    </div>
    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}>
      {member.identified_id}
    </div>
  </>
);

const renderJoinType = (member: IUser) => {
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

const renderDateTime = (date: string | null) => {
  if (!date) return <span style={{ color: 'var(--text-3)' }}>-</span>;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return <span style={{ color: 'var(--text-3)' }}>-</span>;
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

export const WithdrawalTable: React.FC<WithdrawalTableProps> = ({
  members,
  pagination,
  onViewDetail,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">탈퇴 회원 목록</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>닉네임 / 카카오톡 ID / 식별 아이디</th>
          <th style={{ textAlign: 'center' }}>가입 유형(탈퇴 전)</th>
          <th style={{ textAlign: 'center' }}>탈퇴일시</th>
          <th style={{ textAlign: 'center' }}>상태</th>
          <th style={{ textAlign: 'center' }}>상세</th>
        </tr>
      </thead>
      <tbody>
        {members.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
              탈퇴 회원이 없습니다.
            </td>
          </tr>
        ) : (
          members.map((member) => (
            <tr key={member.id}>
              <td>{renderMemberInfo(member)}</td>
              <td style={{ textAlign: 'center' }}>{renderJoinType(member)}</td>
              <td style={{ textAlign: 'center' }}>{renderDateTime(member.deleted_at)}</td>
              <td style={{ textAlign: 'center' }}>
                <span className="badge badge-gray">탈퇴 완료</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => onViewDetail(member)}
                >
                  상세
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {pagination && <Pagination {...pagination} />}
  </div>
);
