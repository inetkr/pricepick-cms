import React from 'react';
import {
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_STATUS_LABEL,
  NOTIFICATION_TARGET_AUDIENCE_LABEL,
} from 'src/constants/notification';
import type { INotification, INotificationStatusValue } from 'src/types/notification';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface NotificationTableProps {
  notifications: INotification[];
  pagination?: PaginationProps;
  // 행을 누르면 수신자 목록 (DEVQA 24)
  onRowClick?: (notification: INotification) => void;
  // 예약 건의 「테스트 발송」 (DEVQA 23)
  onSendTest?: (notification: INotification) => void;
}

const STATUS_BADGE_CLASS: Record<INotificationStatusValue, string> = {
  SENT: 'badge-green',
  SCHEDULED: 'badge-amber',
  FAILED: 'badge-red',
  TEST: 'badge-gray',
};

const isTestNotification = (notification: INotification) =>
  notification.status === 'TEST' || notification.target_audience === 'TEST';

// 테스트 건은 「테스트 · 닉네임1, 닉네임2 외 N명」
export const getNotificationTargetLabel = (notification: INotification) => {
  if (isTestNotification(notification)) {
    const names = (notification.sent_users || []).map((u) => u.nickname).filter(Boolean);
    if (!names.length) return '테스트';
    const head = names.slice(0, 2).join(', ');
    return `테스트 · ${head}${names.length > 2 ? ` 외 ${names.length - 2}명` : ''}`;
  }
  return (
    NOTIFICATION_TARGET_AUDIENCE_LABEL[
      notification.target_audience as keyof typeof NOTIFICATION_TARGET_AUDIENCE_LABEL
    ] || notification.target_audience
  );
};

const toDate = (date: string | number | null | undefined) => {
  if (!date) return null;
  const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
};

const pad = (n: number) => String(n).padStart(2, '0');

const renderDateTime = (date: string | number | null | undefined) => {
  const d = toDate(date);
  if (!d) return '-';
  return (
    <>
      <div style={{ fontWeight: 700, color: '#333' }}>
        {`${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`}
      </div>
      <div style={{ color: 'var(--text-3)', fontSize: '11px' }}>
        {`${pad(d.getHours())}:${pad(d.getMinutes())}`}
      </div>
    </>
  );
};

const renderCount = (count: number | null | undefined, highlight = false) => {
  if (count == null) return '—';
  if (highlight && count > 0) {
    return (
      <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{count.toLocaleString()}명</span>
    );
  }
  return `${count.toLocaleString()}명`;
};

const COLUMN_COUNT = 9;

export const NotificationTable: React.FC<NotificationTableProps> = ({
  notifications,
  pagination,
  onRowClick,
  onSendTest,
}) => (
  <div className="card">
    <div className="card-header">
      <div>
        <div className="card-title">알림 발송 내역</div>
        <div className="card-sub">
          발송 완료 건은 불변 로그 · &apos;예약&apos; 상태만 발송 전 취소·수정 가능 · 건을 누르면
          수신자 목록 · 수신 기록은 90일 보관 후 삭제
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: 'center' }}>발송일시</th>
          <th style={{ textAlign: 'center' }}>채널</th>
          <th>제목</th>
          <th style={{ textAlign: 'center' }}>대상 조건</th>
          <th style={{ textAlign: 'center' }}>대상 수</th>
          <th style={{ textAlign: 'center' }}>성공</th>
          <th style={{ textAlign: 'center' }}>실패</th>
          <th style={{ textAlign: 'center' }}>열람율</th>
          <th style={{ textAlign: 'center' }}>상태 / 액션</th>
        </tr>
      </thead>
      <tbody>
        {notifications.length === 0 ? (
          <tr>
            <td
              colSpan={COLUMN_COUNT}
              style={{ textAlign: 'center', padding: '32px', color: 'var(--text-2)' }}
            >
              발송 내역이 없습니다.
            </td>
          </tr>
        ) : (
          notifications.map((notification) => {
            const isScheduled = notification.status === 'SCHEDULED';
            const total = notification.recipient_count ?? notification.sent_count ?? 0;
            return (
              <tr
                key={notification.id}
                style={{ cursor: onRowClick ? 'pointer' : undefined }}
                onClick={() => onRowClick?.(notification)}
              >
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {renderDateTime(
                    isScheduled
                      ? notification.scheduled_at
                      : notification.sent_at || notification.created_at
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {NOTIFICATION_CHANNEL_LABEL[notification.channel] || notification.channel}
                </td>
                <td style={{ fontWeight: 500 }}>{notification.title}</td>
                <td style={{ textAlign: 'center' }}>{getNotificationTargetLabel(notification)}</td>
                <td style={{ textAlign: 'center' }}>{total.toLocaleString()}명</td>
                {/* 예약 건은 아직 나가지 않았으므로 성공·실패가 없다 */}
                <td style={{ textAlign: 'center' }}>
                  {isScheduled ? '—' : renderCount(notification.success_count)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {isScheduled ? '—' : renderCount(notification.fail_count, true)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {notification.open_rate != null ? `${notification.open_rate}%` : '—'}
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <span className={`badge ${STATUS_BADGE_CLASS[notification.status]}`}>
                    {notification.status === 'TEST'
                      ? '테스트'
                      : NOTIFICATION_STATUS_LABEL[notification.status] || notification.status}
                  </span>
                  {isScheduled && onSendTest && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ marginLeft: '6px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendTest(notification);
                      }}
                    >
                      테스트 발송
                    </button>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
    {pagination && <Pagination {...pagination} />}
  </div>
);
