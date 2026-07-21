'use client';

import React from 'react';
import { NotificationFormCard } from 'src/components/notification/notification-form-card';
import { NotificationLimitPolicyCard } from 'src/components/notification/notification-limit-policy-card';
import { NotificationStats } from 'src/components/notification/notification-stats';
import { NotificationTable } from 'src/components/notification/notification-table';
import type { PaginationProps } from 'src/components/common/pagination';
import { useNotification } from 'src/sections/notification/hooks/use-notification';

export const NotificationSection: React.FC = () => {
  const {
    notifications,
    stats,
    isLoading,
    isSaving,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    createNotification,
    sendTestNotification,
    cancelNotification,
  } = useNotification();

  const paginationProps: PaginationProps = {
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
    <div className="section active" id="sec-notifications">
      <NotificationStats stats={stats} />
      <NotificationLimitPolicyCard />
      <NotificationFormCard
        isSaving={isSaving}
        onSubmit={({ title, body, channel, target, scheduledAt }) =>
          createNotification({ title, body, channel, target, scheduled_at: scheduledAt })
        }
        onSendTest={({ title, body, channel }) => sendTestNotification({ title, body, channel })}
      />
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          불러오는 중...
        </div>
      ) : (
        <NotificationTable
          notifications={notifications}
          pagination={paginationProps}
          onCancel={cancelNotification}
        />
      )}
    </div>
  );
};
