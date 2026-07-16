'use client';

import React, { useState } from 'react';
import { AccountActivityLogTable } from 'src/components/accounts/account-activity-log-table';
import { AccountCreateModal } from 'src/components/accounts/account-create-modal';
import { AccountEditModal } from 'src/components/accounts/account-edit-modal';
import { AccountPermissionCard } from 'src/components/accounts/account-permission-card';
import { AccountTable } from 'src/components/accounts/account-table';
import type { PaginationProps } from 'src/components/common/pagination';
import { useActivityLogs } from 'src/sections/accounts/hooks/use-activity-log';
import { useEmployees } from 'src/sections/accounts/hooks/use-employees';
import type { IAdmin } from 'src/types/admin';

export const AccountsSection: React.FC = () => {
  const { admin, employees, isLoading, isSaving, createEmployee, updateEmployee, deleteEmployee } =
    useEmployees();
  const {
    logs,
    isLoading: isLogLoading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
  } = useActivityLogs();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<IAdmin | null>(null);

  const isSuperAdmin = admin?.role === 'SUPERADMIN';

  const handleCreate = async (payload: Parameters<typeof createEmployee>[0]) => {
    const ok = await createEmployee(payload);
    if (ok) setIsCreateOpen(false);
  };

  const handleUpdate = async (id: string, payload: Parameters<typeof updateEmployee>[1]) => {
    const ok = await updateEmployee(id, payload);
    if (ok) setEditingAccount(null);
  };

  const logPaginationProps: PaginationProps = {
    currentPage: page,
    totalPages,
    onPageChange: setPage,
    onItemsPerPageChange: setLimit,
    showSizeChanger: true,
    showTotal: true,
    totalItems,
    itemsPerPage: limit,
  };

  return (
    <div className="section active" id="sec-accounts">
      <div className="warn-box">
        <strong>주의</strong> — 슈퍼어드민만 계정 추가·삭제가 가능합니다. 슈퍼어드민 계정은 추가할
        수 없습니다. 퇴사자 즉시 삭제 필수.
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <AccountTable
          accounts={employees}
          currentAdminId={admin?.id}
          isSuperAdmin={isSuperAdmin}
          onCreate={() => setIsCreateOpen(true)}
          onEdit={setEditingAccount}
          onDelete={deleteEmployee}
        />
      )}

      <div className="card-grid" style={{ marginTop: '16px' }}>
        <AccountPermissionCard />
        <AccountActivityLogTable
          logs={logs}
          isLoading={isLogLoading}
          pagination={logPaginationProps}
        />
      </div>

      <AccountCreateModal
        open={isCreateOpen}
        isSaving={isSaving}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <AccountEditModal
        open={!!editingAccount}
        account={editingAccount}
        isSaving={isSaving}
        onClose={() => setEditingAccount(null)}
        onSubmit={handleUpdate}
      />
    </div>
  );
};
