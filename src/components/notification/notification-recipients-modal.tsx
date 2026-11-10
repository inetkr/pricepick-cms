'use client';

import React, { useEffect, useState } from 'react';
import { notificationAPI } from 'src/api';
import { getNotificationFailReasonLabel } from 'src/constants/notification';
import { useDebounce } from 'src/hooks/use-debounce';
import type {
  INotification,
  INotificationRecipient,
  INotificationRecipientCampaign,
} from 'src/types/notification';
import { Modal } from '../common/modal';
import { Pagination } from '../common/pagination';
import { getNotificationTargetLabel } from './notification-table';

// DEVQA 24 · 알림 수신자 목록
// 전체 발송은 대상이 수만 명이라 한 번에 뿌리지 않는다 — 검색·페이징이 기본이다.

const PAGE_SIZE = 10;

interface NotificationRecipientsModalProps {
  notification: INotification | null;
  onClose: () => void;
}

const centerStyle: React.CSSProperties = { textAlign: 'center' };

// 회원별 결과 — 미처리(SKIPPED)는 보낼 주소가 없어 시도하지 않은 회원 (사유: 푸시 토큰 없음·수신 거부 등)
const RESULT_BADGE: Record<INotificationRecipient['result'], { label: string; className: string }> =
  {
    SENT: { label: '성공', className: 'badge-green' },
    FAILED: { label: '실패', className: 'badge-red' },
    SKIPPED: { label: '미처리', className: 'badge-amber' },
  };

const emptyCellStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '28px',
  color: 'var(--text-3)',
  fontSize: '12px',
};

export const NotificationRecipientsModal: React.FC<NotificationRecipientsModalProps> = ({
  notification,
  onClose,
}) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<INotificationRecipient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [campaign, setCampaign] = useState<INotificationRecipientCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 400);

  const open = !!notification;
  // 예약 대기·예약 취소 건은 나가지 않았으므로 수신 기록이 없다
  const isScheduled = notification?.status === 'SCHEDULED' || notification?.status === 'CANCELLED';
  const notSentMessage =
    notification?.status === 'CANCELLED'
      ? '취소된 예약 건이라 발송되지 않았습니다.'
      : '예약 건은 아직 발송 전입니다.';

  useEffect(() => {
    setKeyword('');
    setPage(1);
    setRows([]);
    setTotalItems(0);
    setCampaign(null);
    setHasError(false);
  }, [notification?.id]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  useEffect(() => {
    if (!notification || isScheduled) return undefined;

    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    notificationAPI
      .getNotificationRecipients(notification.id, page, PAGE_SIZE, debouncedKeyword.trim())
      .then((res) => {
        if (cancelled) return;
        const object = res?.result?.object;
        setRows(object?.rows || []);
        setTotalItems(object?.count || 0);
        if (res?.result?.campaign) setCampaign(res.result.campaign);
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setTotalItems(0);
        setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [notification, isScheduled, page, debouncedKeyword]);

  const total =
    campaign?.recipient_count ?? notification?.recipient_count ?? notification?.sent_count ?? 0;
  const subText = notification
    ? isScheduled
      ? `${notification.title} · ${notSentMessage}`
      : `${notification.title} · ${getNotificationTargetLabel(notification)} · 대상 ${total.toLocaleString()}명`
    : '';

  // 발송 결과 4칸 — 검색어와 무관한 발송 건 전체 기준 (발송 기록 표의 성공·실패·미처리·확인 불가와 같다)
  const summary = [
    { label: '성공', className: 'badge-green', count: campaign?.success_count },
    { label: '실패', className: 'badge-red', count: campaign?.fail_count },
    { label: '미처리', className: 'badge-amber', count: campaign?.skipped_count },
    { label: '확인 불가', className: 'badge-gray', count: campaign?.unknown_count },
  ];

  const renderBody = () => {
    if (isScheduled) {
      return (
        <tr>
          <td colSpan={4} style={emptyCellStyle}>
            {notSentMessage}
          </td>
        </tr>
      );
    }
    if (isLoading && !rows.length) {
      return (
        <tr>
          <td colSpan={4} style={emptyCellStyle}>
            불러오는 중...
          </td>
        </tr>
      );
    }
    if (hasError) {
      return (
        <tr>
          <td colSpan={4} style={emptyCellStyle}>
            불러오지 못했습니다.
          </td>
        </tr>
      );
    }
    if (!rows.length) {
      return (
        <tr>
          <td colSpan={4} style={emptyCellStyle}>
            조건에 맞는 수신자가 없습니다.
          </td>
        </tr>
      );
    }
    return rows.map((row) => {
      const badge = RESULT_BADGE[row.result] || RESULT_BADGE.FAILED;
      return (
        <tr key={row.user_id}>
          <td style={centerStyle}>{row.nickname || '(닉네임 없음)'}</td>
          <td style={{ ...centerStyle, fontSize: '12px', color: 'var(--text-2)' }}>
            {row.identified_id || '-'}
          </td>
          <td style={centerStyle}>
            <span className={`badge ${badge.className}`}>{badge.label}</span>
          </td>
          <td style={{ ...centerStyle, color: 'var(--text-2)', fontSize: '12px' }}>
            {row.result === 'SENT'
              ? '—'
              : row.fail_reason_label || getNotificationFailReasonLabel(row.fail_reason) || '—'}
          </td>
        </tr>
      );
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="860px"
      closeOnOverlayClick={false}
      title={
        <div>
          <div>수신자 목록</div>
          <div className="card-sub" style={{ fontWeight: 400 }}>
            {subText}
          </div>
        </div>
      }
      footer={
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className="modal-body">
        {campaign && !isScheduled && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {summary.map((s) => (
              <span key={s.label} className={`badge ${s.className}`}>
                {s.label} {(s.count ?? 0).toLocaleString()}명
              </span>
            ))}
          </div>
        )}
        {!isScheduled && (
          <input
            className="search-box"
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="닉네임 또는 식별 아이디"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        )}
        <table>
          <thead>
            <tr>
              <th style={centerStyle}>닉네임</th>
              <th style={centerStyle}>식별 아이디</th>
              <th style={centerStyle}>결과</th>
              <th style={centerStyle}>실패 사유</th>
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
        {!isScheduled && totalItems > PAGE_SIZE && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalItems / PAGE_SIZE)}
            totalItems={totalItems}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setPage}
            showSizeChanger={false}
          />
        )}
        <div className="form-hint" style={{ marginTop: '10px' }}>
          수신 기록은 90일 보관 후 삭제됩니다.
        </div>
      </div>
    </Modal>
  );
};
