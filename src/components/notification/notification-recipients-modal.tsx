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
  const isScheduled = notification?.status === 'SCHEDULED';

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
      ? `${notification.title} · 예약 건은 아직 발송 전입니다`
      : `${notification.title} · ${getNotificationTargetLabel(notification)} · 대상 ${total.toLocaleString()}명`
    : '';

  const renderBody = () => {
    if (isScheduled) {
      return (
        <tr>
          <td colSpan={4} style={emptyCellStyle}>
            예약 건은 아직 발송 전입니다.
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
    return rows.map((row) => (
      <tr key={row.user_id}>
        <td>{row.nickname || '(닉네임 없음)'}</td>
        <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-2)' }}>
          {row.identified_id || '-'}
        </td>
        <td style={{ textAlign: 'center' }}>
          {row.result === 'SENT' ? (
            <span className="badge badge-green">성공</span>
          ) : (
            <span className="badge badge-red">실패</span>
          )}
        </td>
        <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>
          {row.fail_reason_label || getNotificationFailReasonLabel(row.fail_reason) || '—'}
        </td>
      </tr>
    ));
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
            <span className="badge badge-green">
              성공 {(campaign.success_count ?? 0).toLocaleString()}명
            </span>
            <span className="badge badge-red">
              실패 {(campaign.fail_count ?? 0).toLocaleString()}명
            </span>
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
              <th>닉네임</th>
              <th>식별 아이디</th>
              <th style={{ textAlign: 'center' }}>결과</th>
              <th>실패 사유</th>
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
