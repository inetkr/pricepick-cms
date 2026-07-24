'use client';

import React, { useState } from 'react';
import { NOTIFICATION_TARGET_AUDIENCE_OPTIONS } from 'src/constants/notification';
import type { INotificationSendType, INotificationTargetAudience } from 'src/types/notification';
import { InfoBox } from '../stats/info-box';
import { NotificationPreviewModal } from './notification-preview-modal';

interface NotificationFormCardProps {
  isSaving: boolean;
  isSendingTest: boolean;
  onSubmit: (data: {
    title: string;
    content: string;
    target_audience: INotificationTargetAudience;
    send_type: INotificationSendType;
    scheduled_at: number | null;
  }) => Promise<boolean>;
  onSendTest: (data: {
    title: string;
    content: string;
    target_audience: INotificationTargetAudience;
  }) => Promise<boolean>;
}

export const NotificationFormCard: React.FC<NotificationFormCardProps> = ({
  isSaving,
  isSendingTest,
  onSubmit,
  onSendTest,
}) => {
  const [targetAudience, setTargetAudience] = useState<INotificationTargetAudience>('ALL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sendType, setSendType] = useState<INotificationSendType>('NOW');
  const [scheduledAt, setScheduledAt] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [sendAttempted, setSendAttempted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isValid =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    (sendType === 'NOW' || scheduledAt.trim().length > 0);

  const titleError = attempted && title.trim().length === 0 ? '제목을 입력해주세요.' : null;
  const contentError = attempted && content.trim().length === 0 ? '내용을 입력해주세요.' : null;
  const scheduledAtError =
    sendAttempted && sendType === 'SCHEDULED' && scheduledAt.trim().length === 0
      ? '예약 발송 일시를 선택해주세요.'
      : null;

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSendType('NOW');
    setScheduledAt('');
    setAttempted(false);
    setSendAttempted(false);
  };

  const handleSend = async () => {
    setAttempted(true);
    setSendAttempted(true);
    if (!isValid) return;
    const ok = await onSubmit({
      title: title.trim(),
      content: content.trim(),
      target_audience: targetAudience,
      send_type: sendType,
      scheduled_at:
        sendType === 'SCHEDULED' ? Math.floor(new Date(scheduledAt).getTime() / 1000) : null,
    });
    if (ok) resetForm();
  };

  const handleSendTest = async () => {
    setAttempted(true);
    if (title.trim().length === 0 || content.trim().length === 0 || isSendingTest) return;
    setShowPreview(true);
    await onSendTest({
      title: title.trim(),
      content: content.trim(),
      target_audience: targetAudience,
    });
  };

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div className="card-header">
        <div className="card-title">알림 작성 · 발송</div>
      </div>
      <div style={{ padding: '18px' }}>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-2)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '.4px',
              }}
            >
              발송 채널
            </span>
            <div className="filter-sel" style={{ width: '100%', cursor: 'default' }}>
              앱 푸시
            </div>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="notification-target">
              발송 대상
            </label>
            <select
              id="notification-target"
              className="form-select"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as INotificationTargetAudience)}
            >
              {NOTIFICATION_TARGET_AUDIENCE_OPTIONS.map((opt) => (
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
            className={`form-input${titleError ? ' has-error' : ''}`}
            placeholder="예: 이번 주 추첨 마감 D-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleError && <div className="field-error">{titleError}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notification-content">
            내용
          </label>
          <textarea
            id="notification-content"
            className={`form-input${contentError ? ' has-error' : ''}`}
            style={{ minHeight: '110px', resize: 'vertical' }}
            placeholder="알림 본문을 입력하세요. 변수: {닉네임}, {보유티켓}"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {contentError && <div className="field-error">{contentError}</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="notification-send-type">
              발송 시점
            </label>
            <select
              id="notification-send-type"
              className="form-select"
              value={sendType}
              onChange={(e) => setSendType(e.target.value as INotificationSendType)}
            >
              <option value="NOW">즉시 발송</option>
              <option value="SCHEDULED">예약 발송</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <input
              id="notification-schedule-at"
              type="datetime-local"
              className="search-box"
              style={{ width: 'auto', borderColor: scheduledAtError ? 'var(--danger)' : undefined }}
              disabled={sendType !== 'SCHEDULED'}
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            {scheduledAtError && <div className="field-error">{scheduledAtError}</div>}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={isSendingTest}
              onClick={handleSendTest}
            >
              {isSendingTest ? '전송 중...' : '테스트 발송'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSaving}
              onClick={handleSend}
            >
              {isSaving ? '처리 중...' : '발송'}
            </button>
          </div>
        </div>

        <InfoBox style={{ marginTop: '14px' }}>
          마케팅성 알림은 수신 동의 회원에게만 발송됩니다. 서비스 필수 알림(티켓 지급·기프티콘
          발송·경품 당첨)은 동의 여부와 무관하게 발송됩니다.
        </InfoBox>
      </div>

      <NotificationPreviewModal
        open={showPreview}
        title={title.trim()}
        content={content.trim()}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};
