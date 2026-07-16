import React from 'react';
import type { IAdmin } from 'src/types/admin';
import { AccountRoleBadge } from './account-role-badge';
import { AccountStatusBadge } from './account-status-badge';

interface AccountTableProps {
  accounts: IAdmin[];
  currentAdminId?: string;
  isSuperAdmin: boolean;
  onCreate: () => void;
  onEdit: (account: IAdmin) => void;
  onDelete: (account: IAdmin) => void;
}

const formatLastOnline = (timestamp?: number | null) => {
  if (!timestamp) return '접속 이력 없음';
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return '접속 이력 없음';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  currentAdminId,
  isSuperAdmin,
  onCreate,
  onEdit,
  onDelete,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">관리자 계정</div>
      {isSuperAdmin && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onCreate}>
          + 계정 추가
        </button>
      )}
    </div>
    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>이메일</th>
          <th>역할</th>
          <th>최종 로그인</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {accounts.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
            >
              등록된 관리자 계정이 없습니다.
            </td>
          </tr>
        ) : (
          accounts.map((account) => {
            const isSelf = account.id === currentAdminId;
            const canManage = isSuperAdmin && account.role !== 'SUPERADMIN';
            return (
              <tr key={account.id}>
                <td>
                  <strong>{account.fullname || account.username}</strong>
                  {isSelf && (
                    <span style={{ fontSize: '10px', color: 'var(--text-3)', marginLeft: '6px' }}>
                      (본인)
                    </span>
                  )}
                </td>
                <td>{account.email}</td>
                <td>
                  <AccountRoleBadge role={account.role} />
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>
                  {formatLastOnline(account.last_online)}
                </td>
                <td>
                  <AccountStatusBadge status={account.status} />
                </td>
                <td>
                  {canManage ? (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => onEdit(account)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(account)}
                        disabled={isSelf}
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>권한 없음</span>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);
