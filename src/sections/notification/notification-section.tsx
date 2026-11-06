'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NotificationFormCard } from 'src/components/notification/notification-form-card';
import { NotificationIndividualSendModal } from 'src/components/notification/notification-individual-send-modal';
import { NotificationLimitPolicyCard } from 'src/components/notification/notification-limit-policy-card';
import { NotificationRecipientsModal } from 'src/components/notification/notification-recipients-modal';
import { NotificationResultGuideModal } from 'src/components/notification/notification-result-guide-modal';
import { NotificationStats } from 'src/components/notification/notification-stats';
import { NotificationTable } from 'src/components/notification/notification-table';
import type { PaginationProps } from 'src/components/common/pagination';
import {
  NOTIFICATION_HISTORY_TARGET_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
} from 'src/constants/notification';
import { useNotification } from 'src/sections/notification/hooks/use-notification';
import type { INotification } from 'src/types/notification';

export type INotificationTab = 'send' | 'history';

// 탭마다 주소를 따로 둔다 — 발송 기록을 바로 열거나 새로고침해도 같은 탭이 열리게
const TABS: { id: INotificationTab; label: string; href: string }[] = [
  { id: 'send', label: '수동 발송', href: '/notifications' },
  { id: 'history', label: '발송 기록', href: '/notifications/history' },
];

// 선택 개별 발송 내용 — 작성 중인 알림 또는 예약 건
type IIndividualSource = {
  title: string;
  content: string;
};

export const NotificationSection: React.FC<{ tab: INotificationTab }> = ({ tab }) => {
  const {
    notifications,
    stats,
    isLoading,
    isSaving,
    isSendingIndividual,
    filters,
    setFilters,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    sendNotification,
    sendIndividualNotification,
    cancelScheduledNotification,
  } = useNotification({ withHistory: tab === 'history' });

  const [searchTitle, setSearchTitle] = useState(filters.title);
  const [targetAudienceFilter, setTargetAudienceFilter] = useState(filters.target_audience);
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [individualSource, setIndividualSource] = useState<IIndividualSource | null>(null);
  const [recipientsTarget, setRecipientsTarget] = useState<INotification | null>(null);
  const [showResultGuide, setShowResultGuide] = useState(false);

  const handleCancelScheduled = (notification: INotification) => {
    const ok = window.confirm(
      `예약 발송을 취소하시겠습니까?\n${notification.title}\n취소한 건은 발송 기록에서 삭제되고 발송되지 않습니다.`
    );
    if (ok) cancelScheduledNotification(notification);
  };

  const handleSendIndividual = (userIds: string[]) => {
    if (!individualSource) return Promise.resolve(false);
    return sendIndividualNotification(individualSource, userIds);
  };

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

  const toolbar = (
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
        {NOTIFICATION_HISTORY_TARGET_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        className="filter-sel"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
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
  );

  return (
    <div className="section active" id="sec-notifications">
      <NotificationStats stats={stats} />

      <div className="terms-nav">
        {TABS.map((t) => (
          <Link key={t.id} href={t.href} className={`terms-tab ${t.id === tab ? 'active' : ''}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {tab === 'send' ? (
        <>
          <NotificationLimitPolicyCard />
          <NotificationFormCard
            isSaving={isSaving}
            isSendingIndividual={isSendingIndividual}
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
            onSendIndividual={setIndividualSource}
          />
        </>
      ) : (
        <NotificationTable
          notifications={notifications}
          isLoading={isLoading}
          toolbar={toolbar}
          pagination={paginationProps}
          onRowClick={setRecipientsTarget}
          onShowResultGuide={() => setShowResultGuide(true)}
          onSendIndividual={(n) => setIndividualSource({ title: n.title, content: n.content })}
          onCancelScheduled={handleCancelScheduled}
        />
      )}

      <NotificationIndividualSendModal
        open={!!individualSource}
        title={individualSource?.title || ''}
        content={individualSource?.content || ''}
        isSending={isSendingIndividual}
        onClose={() => setIndividualSource(null)}
        onSend={handleSendIndividual}
      />

      <NotificationRecipientsModal
        notification={recipientsTarget}
        onClose={() => setRecipientsTarget(null)}
      />

      <NotificationResultGuideModal
        open={showResultGuide}
        onClose={() => setShowResultGuide(false)}
      />
    </div>
  );
};
