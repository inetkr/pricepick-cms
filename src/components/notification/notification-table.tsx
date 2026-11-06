import React from 'react';
import {
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_STATUS_LABEL,
  NOTIFICATION_TARGET_AUDIENCE_LABEL,
} from 'src/constants/notification';
import type { INotification, INotificationUserRef } from 'src/types/notification';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface NotificationTableProps {
  notifications: INotification[];
  isLoading?: boolean;
  // 카드 머리 밑에 놓는 검색줄
  toolbar?: React.ReactNode;
  pagination?: PaginationProps;
  // 행을 누르면 수신자 목록 (DEVQA 24)
  onRowClick?: (notification: INotification) => void;
  // 성공 칸 제목의 ? — 발송 결과 기준 안내
  onShowResultGuide?: () => void;
  // 예약 건의 「선택 개별 발송」 — 예약 내용을 고른 회원에게 먼저 보내 본다
  onSendIndividual?: (notification: INotification) => void;
  // 예약 건의 「취소」 — 발송 전 예약을 지운다
  onCancelScheduled?: (notification: INotification) => void;
}

const isTestNotification = (notification: INotification) =>
  notification.status === 'TEST' || notification.target_audience === 'TEST';

const isIndividualNotification = (notification: INotification) =>
  notification.target_audience === 'INDIVIDUAL';

// 「닉네임1, 닉네임2 외 N명」
const joinNames = (users: INotificationUserRef[] | null | undefined) => {
  const names = (users || []).map((u) => u.nickname || '(닉네임 없음)');
  if (!names.length) return '';
  const head = names.slice(0, 2).join(', ');
  return `${head}${names.length > 2 ? ` 외 ${names.length - 2}명` : ''}`;
};

// 개별 발송은 「개별 발송 · 닉네임」, 예전 테스트 건은 「테스트 · 닉네임」
export const getNotificationTargetLabel = (notification: INotification) => {
  if (isIndividualNotification(notification)) {
    const names = joinNames(notification.target_users);
    return names ? `개별 발송 · ${names}` : '개별 발송';
  }
  if (isTestNotification(notification)) {
    const names = joinNames(notification.sent_users);
    return names ? `테스트 · ${names}` : '테스트';
  }
  return (
    NOTIFICATION_TARGET_AUDIENCE_LABEL[
      notification.target_audience as keyof typeof NOTIFICATION_TARGET_AUDIENCE_LABEL
    ] || notification.target_audience
  );
};

// 상태 칸 — 예약으로 나간 건은 「예약 / 발송완료」로 일반 즉시 발송과 구분한다
const getStatusBadge = (notification: INotification): { label: string; className: string } => {
  if (notification.status === 'SCHEDULED') return { label: '예약', className: 'badge-amber' };
  if (isTestNotification(notification)) return { label: '테스트', className: 'badge-gray' };
  if (notification.status === 'FAILED') return { label: '실패', className: 'badge-red' };
  if (isIndividualNotification(notification)) return { label: '개별 발송', className: 'badge-gray' };
  if (notification.send_type === 'SCHEDULED') {
    return { label: '예약 / 발송완료', className: 'badge-green' };
  }
  return { label: NOTIFICATION_STATUS_LABEL.SENT, className: 'badge-green' };
};

const toDate = (date: string | number | null | undefined) => {
  if (!date) return null;
  const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
};

const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (d: Date) => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
const fmtHm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtHms = (d: Date) => `${fmtHm(d)}:${pad(d.getSeconds())}`;

const subLineStyle: React.CSSProperties = { color: 'var(--text-3)', fontSize: '11px' };

// 발송일시 칸
// - 예약 대기: 「발송 예정 날짜 시각」 + 「예약 등록 월/일 시각」 (아직 안 나갔으니 흐리게)
// - 그 외: 실제 발송 날짜 + 시·분·초, 예약으로 나간 건은 예약 등록 시각을 한 줄 더
const renderSendTime = (notification: INotification) => {
  const created = toDate(notification.created_at);
  const registered = created && (
    <div style={subLineStyle}>
      예약 등록 {pad(created.getMonth() + 1)}/{pad(created.getDate())} {fmtHm(created)}
    </div>
  );

  if (notification.status === 'SCHEDULED') {
    const at = toDate(notification.scheduled_at);
    return (
      <>
        <div style={{ color: 'var(--text-2)', fontWeight: 600 }}>
          발송 예정 {at ? `${fmtDate(at)} ${fmtHm(at)}` : '-'}
        </div>
        {registered}
      </>
    );
  }

  const sent = toDate(notification.sent_at || notification.created_at);
  if (!sent) return '-';
  return (
    <>
      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{fmtDate(sent)}</div>
      <div style={subLineStyle}>{fmtHms(sent)}</div>
      {notification.send_type === 'SCHEDULED' && registered}
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

const QuestionIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const COLUMN_COUNT = 11;
const center: React.CSSProperties = { textAlign: 'center' };

export const NotificationTable: React.FC<NotificationTableProps> = ({
  notifications,
  isLoading,
  toolbar,
  pagination,
  onRowClick,
  onShowResultGuide,
  onSendIndividual,
  onCancelScheduled,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">발송 기록</div>
    </div>
    {toolbar && <div style={{ padding: '14px 18px 0' }}>{toolbar}</div>}
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th style={center}>발송일시</th>
            <th style={center}>채널</th>
            <th style={center}>제목</th>
            <th style={center}>대상 조건</th>
            <th style={center}>대상 수</th>
            <th style={center}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                성공
                {onShowResultGuide && (
                  <button
                    type="button"
                    className="ni-help-btn"
                    aria-label="발송 결과 기준"
                    onClick={onShowResultGuide}
                  >
                    <QuestionIcon />
                  </button>
                )}
              </span>
            </th>
            <th style={center}>실패</th>
            <th style={center}>미처리</th>
            <th style={center}>확인 불가</th>
            <th style={center}>열람률</th>
            <th style={center}>상태 / 액션</th>
          </tr>
        </thead>
        <tbody>
          {isLoading || notifications.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMN_COUNT}
                style={{ textAlign: 'center', padding: '32px', color: 'var(--text-2)' }}
              >
                {isLoading ? '불러오는 중...' : '발송 기록이 없습니다.'}
              </td>
            </tr>
          ) : (
            notifications.map((notification) => {
              const isScheduled = notification.status === 'SCHEDULED';
              const total = notification.recipient_count ?? notification.sent_count ?? null;
              const badge = getStatusBadge(notification);
              return (
                <tr
                  key={notification.id}
                  style={{ cursor: onRowClick ? 'pointer' : undefined }}
                  onClick={() => onRowClick?.(notification)}
                >
                  <td style={{ ...center, whiteSpace: 'nowrap' }}>
                    {renderSendTime(notification)}
                  </td>
                  <td style={center}>
                    {NOTIFICATION_CHANNEL_LABEL[notification.channel] || notification.channel}
                  </td>
                  <td style={{ ...center, fontWeight: 500 }}>{notification.title}</td>
                  <td style={center}>{getNotificationTargetLabel(notification)}</td>
                  <td style={center}>{renderCount(total)}</td>
                  {/* 예약 건은 아직 나가지 않았으므로 결과 4칸이 없다 */}
                  <td style={center}>
                    {isScheduled ? '—' : renderCount(notification.success_count)}
                  </td>
                  <td style={center}>
                    {isScheduled ? '—' : renderCount(notification.fail_count, true)}
                  </td>
                  <td style={center}>
                    {isScheduled ? '—' : renderCount(notification.skipped_count)}
                  </td>
                  <td style={center}>
                    {isScheduled ? '—' : renderCount(notification.unknown_count)}
                  </td>
                  {/* 열람률 — 0이거나 아직 없으면(null) 비워 둔다 */}
                  <td style={center}>
                    {notification.open_rate ? `${notification.open_rate}%` : '—'}
                  </td>
                  <td style={{ ...center, whiteSpace: 'nowrap' }}>
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                    {isScheduled && onSendIndividual && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ marginLeft: '6px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendIndividual(notification);
                        }}
                      >
                        선택 개별 발송
                      </button>
                    )}
                    {isScheduled && onCancelScheduled && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ marginLeft: '4px', color: 'var(--danger)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelScheduled(notification);
                        }}
                      >
                        취소
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
    {pagination && <Pagination {...pagination} />}
  </div>
);
