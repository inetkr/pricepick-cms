'use client';

import React, { useState } from 'react';
import { NotificationFormCard } from 'src/components/notification/notification-form-card';
import { NotificationLimitPolicyCard } from 'src/components/notification/notification-limit-policy-card';
import { NotificationStats } from 'src/components/notification/notification-stats';
import { NotificationTable } from 'src/components/notification/notification-table';
import type { PaginationProps } from 'src/components/common/pagination';
import { NOTIFICATION_STATUS_OPTIONS, NOTIFICATION_TARGET_AUDIENCE_OPTIONS } from 'src/constants/notification';
import { useNotification } from 'src/sections/notification/hooks/use-notification';

export const NotificationSection: React.FC = () => {
  const {
    notifications,
    stats,
    isLoading,
    isSaving,
    isSendingTest,
    filters,
    setFilters,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    sendNotification,
    sendTestNotification,
  } = useNotification();

  const [searchTitle, setSearchTitle] = useState(filters.title);
  const [targetAudienceFilter, setTargetAudienceFilter] = useState(filters.target_audience);
  const [statusFilter, setStatusFilter] = useState(filters.status);

  const handleApplyFilters = () => {
    setFilters({ title: searchTitle, target_audience: targetAudienceFilter, status: statusFilter });
  };

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
        isSendingTest={isSendingTest}
        onSubmit={({ title, content, target_audience, send_type, scheduled_at }) =>
          sendNotification({
            channel: 'PUSH_APP',
            title,
            content,
            target_audience,
            send_type,
            scheduled_at,
            is_test: false,
          })
        }
        onSendTest={({ title, content, target_audience }) =>
          sendTestNotification({
            channel: 'PUSH_APP',
            title,
            content,
            target_audience,
            send_type: 'NOW',
            scheduled_at: null,
          })
        }
      />

      <div className="toolbar">
        <input
          className="search-box"
          placeholder="제목 검색"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
        />
        <select
          className="filter-sel"
          value={targetAudienceFilter}
          onChange={(e) => setTargetAudienceFilter(e.target.value)}
        >
          <option value="">전체 대상</option>
          {NOTIFICATION_TARGET_AUDIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select className="filter-sel" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          {NOTIFICATION_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyFilters}>
          검색
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          불러오는 중...
        </div>
      ) : (
        <NotificationTable notifications={notifications} pagination={paginationProps} />
      )}
    </div>
  );
};
