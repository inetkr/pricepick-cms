'use client';

import React, { useEffect, useState } from 'react';
import { notificationAPI } from 'src/api';
import { getNotificationFailReasonLabel } from 'src/constants/notification';
import type { IUserReceivedNotification } from 'src/types/notification';
import { formatDate, parseTimestamp } from 'src/utils/helper';

// 회원 상세의 「받은 알림」 (DEVQA 24) — 그 회원이 받은 발송 건만 보여준다.

interface MemberReceivedNotificationsProps {
  userId: string;
}

const messageStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'center',
  color: 'var(--text-3)',
  fontSize: '12px',
};

const renderSentAt = (sentAt: IUserReceivedNotification['sent_at']) => {
  const date = parseTimestamp(sentAt);
  if (!date) return '-';
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${formatDate(date.toISOString())} ${time}`;
};

export const MemberReceivedNotifications: React.FC<MemberReceivedNotificationsProps> = ({
  userId,
}) => {
  const [rows, setRows] = useState<IUserReceivedNotification[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    notificationAPI
      .getUserReceivedNotifications(userId)
      .then((res) => {
        if (cancelled) return;
        setRows(res?.result?.object?.rows || []);
        setStatus('done');
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const renderContent = () => {
    if (status === 'loading') return <div style={messageStyle}>불러오는 중...</div>;
    if (status === 'error') return <div style={messageStyle}>불러오지 못했습니다.</div>;
    if (!rows.length) return <div style={messageStyle}>받은 알림이 없습니다.</div>;
    return rows.map((row) => (
      <div
        key={row.campaign_id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '8px 10px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '12px' }}>
            {row.title}
            {row.is_test && (
              <span className="badge badge-gray" style={{ marginLeft: '6px' }}>
                테스트
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
            {renderSentAt(row.sent_at)}
          </div>
        </div>
        {row.result === 'SENT' ? (
          <span className="badge badge-green">성공</span>
        ) : (
          <span className="badge badge-red" style={{ whiteSpace: 'nowrap' }}>
            실패
            {row.fail_reason_label || row.fail_reason
              ? ` · ${row.fail_reason_label || getNotificationFailReasonLabel(row.fail_reason)}`
              : ''}
          </span>
        )}
      </div>
    ));
  };

  return (
    <div className="form-group">
      <div className="form-label">받은 알림</div>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-sm)',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {renderContent()}
      </div>
      <div className="form-hint">수신 기록은 90일 보관 후 삭제됩니다.</div>
    </div>
  );
};
