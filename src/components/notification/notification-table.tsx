import React from 'react';
import {
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_STATUS_LABEL,
  NOTIFICATION_TARGET_LABEL,
} from 'src/constants/notification';
import type { INotification, INotificationStatus } from 'src/types/notification';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface NotificationTableProps {
  notifications: INotification[];
  pagination?: PaginationProps;
  onCancel: (notification: INotification) => void;
}

const STATUS_BADGE_CLASS: Record<INotificationStatus, string> = {
  SENT: 'badge-green',
  SCHEDULED: 'badge-amber',
  TEST: 'badge-gray',
  FAILED: 'badge-red',
};

const renderDateTime = (date: string | null) => {
  if (!date) return '-';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hour}:${minute}`;
};

export const NotificationTable: React.FC<NotificationTableProps> = ({
  notifications,
  pagination,
  onCancel,
}) => (
  <div className="card">
    <div className="card-header">
      <div>
        <div className="card-title">알림 발송 내역</div>
        <div className="card-sub">
          발송 완료 건은 불변 로그 · &apos;예약&apos; 상태만 발송 전 취소·수정 가능
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: 'center' }}>발송일시</th>
          <th style={{ textAlign: 'center' }}>채널</th>
          <th>제목</th>
          <th style={{ textAlign: 'center' }}>대상</th>
          <th style={{ textAlign: 'center' }}>발송 수</th>
          <th style={{ textAlign: 'center' }}>오픈율</th>
          <th style={{ textAlign: 'center' }}>상태 / 액션</th>
        </tr>
      </thead>
      <tbody>
        {notifications.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-2)' }}>
              발송 내역이 없습니다.
            </td>
          </tr>
        ) : (
          notifications.map((notification) => (
            <tr key={notification.id}>
              <td style={{ textAlign: 'center' }}>
                {renderDateTime(
                  notification.sent_at || notification.scheduled_at || notification.created_at
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {NOTIFICATION_CHANNEL_LABEL[notification.channel] || notification.channel}
              </td>
              <td style={{ fontWeight: 500 }}>{notification.title}</td>
              <td style={{ textAlign: 'center' }}>
                {NOTIFICATION_TARGET_LABEL[notification.target] || notification.target}
              </td>
              <td style={{ textAlign: 'center' }}>
                {notification.recipient_count?.toLocaleString() ?? 0}명
              </td>
              <td style={{ textAlign: 'center' }}>
                {notification.open_rate != null ? `${notification.open_rate}%` : '-'}
              </td>
              <td style={{ textAlign: 'center' }}>
                <div
                  style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                >
                  <span className={`badge ${STATUS_BADGE_CLASS[notification.status]}`}>
                    {NOTIFICATION_STATUS_LABEL[notification.status] || notification.status}
                  </span>
                  {notification.status === 'SCHEDULED' && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => onCancel(notification)}
                    >
                      취소
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {pagination && <Pagination {...pagination} />}
  </div>
);
