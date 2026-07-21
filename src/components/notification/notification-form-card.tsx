'use client';

import React, { useState } from 'react';
import {
  NOTIFICATION_CHANNEL_OPTIONS,
  NOTIFICATION_TARGET_OPTIONS,
} from 'src/constants/notification';
import type { INotificationChannel, INotificationTarget } from 'src/types/notification';
import { InfoBox } from '../stats/info-box';

type ITiming = 'NOW' | 'SCHEDULED';

interface NotificationFormCardProps {
  isSaving: boolean;
  onSubmit: (data: {
    title: string;
    body: string;
    channel: INotificationChannel;
    target: INotificationTarget;
    scheduledAt: string | null;
  }) => Promise<boolean>;
  onSendTest: (data: {
    title: string;
    body: string;
    channel: INotificationChannel;
  }) => Promise<boolean>;
}

export const NotificationFormCard: React.FC<NotificationFormCardProps> = ({
  isSaving,
  onSubmit,
  onSendTest,
}) => {
  const [channel, setChannel] = useState<INotificationChannel>('PUSH');
  const [target, setTarget] = useState<INotificationTarget>('ALL');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [timing, setTiming] = useState<ITiming>('NOW');
  const [scheduledAt, setScheduledAt] = useState('');

  const hasContent = title.trim().length > 0 && body.trim().length > 0;
  const canSubmit = hasContent && !isSaving && (timing === 'NOW' || scheduledAt.trim().length > 0);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setTiming('NOW');
    setScheduledAt('');
  };

  const handleSend = async () => {
    if (!canSubmit) return;
    const ok = await onSubmit({
      title: title.trim(),
      body: body.trim(),
      channel,
      target,
      scheduledAt: timing === 'SCHEDULED' ? scheduledAt : null,
    });
    if (ok) resetForm();
  };

  const handleSendTest = async () => {
    if (!hasContent || isSaving) return;
    await onSendTest({ title: title.trim(), body: body.trim(), channel });
  };

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div className="card-header">
        <div className="card-title">알림 작성 · 발송</div>
      </div>
      <div style={{ padding: '18px' }}>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="notification-channel">
              발송 채널
            </label>
            <select
              id="notification-channel"
              className="form-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value as INotificationChannel)}
            >
              {NOTIFICATION_CHANNEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="notification-target">
              발송 대상
            </label>
            <select
              id="notification-target"
              className="form-select"
              value={target}
              onChange={(e) => setTarget(e.target.value as INotificationTarget)}
            >
              {NOTIFICATION_TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notification-title">
            제목
          </label>
          <input
            id="notification-title"
            className="form-input"
            placeholder="예: 이번 주 추첨 마감 D-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notification-body">
            내용
          </label>
          <textarea
            id="notification-body"
            className="form-input"
            style={{ minHeight: '110px', resize: 'vertical' }}
            placeholder="알림 본문을 입력하세요. 변수: {닉네임}, {보유티켓}"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="notification-timing">
              발송 시점
            </label>
            <select
              id="notification-timing"
              className="form-select"
              value={timing}
              onChange={(e) => setTiming(e.target.value as ITiming)}
            >
              <option value="NOW">즉시 발송</option>
              <option value="SCHEDULED">예약 발송</option>
            </select>
          </div>
          <input
            id="notification-schedule-at"
            type="datetime-local"
            className="search-box"
            style={{ width: 'auto' }}
            disabled={timing !== 'SCHEDULED'}
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={!hasContent || isSaving}
              onClick={handleSendTest}
            >
              테스트 발송
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canSubmit}
              onClick={handleSend}
            >
              {isSaving ? '처리 중...' : '발송'}
            </button>
          </div>
        </div>

        <InfoBox style={{ marginTop: '14px' }}>
          마케팅성 알림은 수신 동의 회원에게만 발송됩니다. 서비스 필수 알림(티켓 지급·기프티콘
          발송·경품 당첨)은 동의 여부와 무관하게 발송됩니다. <strong>데모 범위 밖</strong> — 실제
          FCM/카카오 알림톡 발송 연동은 없고, 발송 내역만 Firestore에 기록됩니다(대상 인원은
          실집계).
        </InfoBox>
      </div>
    </div>
  );
};
