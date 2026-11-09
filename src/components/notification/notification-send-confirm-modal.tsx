'use client';

import React, { useEffect, useState } from 'react';
import { notificationAPI } from 'src/api';
import { NOTIFICATION_TARGET_AUDIENCE_LABEL } from 'src/constants/notification';
import type {
  INotificationAudienceCount,
  INotificationSendType,
  INotificationTargetAudience,
} from 'src/types/notification';
import { Modal } from '../common/modal';

// 「발송」을 누르면 바로 보내지 않고 한 번 더 확인받는다 — 회원 화면에 어떻게 뜨는지,
// 고른 발송 대상에서 실제로 몇 명이 받는지(수신 동의만, 미동의는 제외)를 보여 준다.

export type INotificationSendConfirmData = {
  title: string;
  content: string;
  target_audience: INotificationTargetAudience;
  send_type: INotificationSendType;
  // unix timestamp(초) — 예약 발송일 때만
  scheduled_at: number | null;
};

interface NotificationSendConfirmModalProps {
  data: INotificationSendConfirmData | null;
  isSending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const fmtSchedule = (seconds: number | null) => {
  if (!seconds) return '예약 발송';
  const d = new Date(seconds * 1000);
  return `예약 발송 · ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// 사이드바 로고와 같은 PricePick 마크 — 앱 아이콘 자리에 쓴다
const AppIcon = () => (
  <div className="ni-confirm-app-icon">
    <svg width="26" height="26" viewBox="0 0 360 363" fill="none">
      <path
        d="M178.702 82.69C125.37 82.69 82.14 125.94 82.14 179.29V277.43H115.61V252.41C132.54 267.04 154.59 275.87 178.7 275.87C232.03 275.87 275.27 232.62 275.27 179.28C275.27 125.93 232.03 82.68 178.7 82.68L178.702 82.69ZM178.7 242.4C143.85 242.4 115.61 214.15 115.61 179.29C115.61 144.43 143.85 116.18 178.7 116.18C213.55 116.18 241.79 144.43 241.79 179.29C241.79 214.15 213.55 242.4 178.7 242.4Z"
        fill="white"
      />
      <path
        d="M180 0C80.59 0 0 80.62 0 180.06V363H62.4V316.37C93.94 343.63 135.04 360.12 180 360.12C279.41 360.12 360 279.5 360 180.06C360 80.62 279.42 0 180 0ZM180 297.7C115.05 297.7 62.4 245.02 62.4 180.06C62.4 115.1 115.06 62.42 180 62.42C244.94 62.42 297.6 115.1 297.6 180.06C297.6 245.02 244.94 297.7 180 297.7Z"
        fill="rgba(255,255,255,0.65)"
      />
    </svg>
  </div>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const NotificationSendConfirmModal: React.FC<NotificationSendConfirmModalProps> = ({
  data,
  isSending,
  onClose,
  onConfirm,
}) => {
  const [count, setCount] = useState<INotificationAudienceCount | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [countFailed, setCountFailed] = useState(false);
  const targetAudience = data?.target_audience;

  // 팝업을 열 때마다 새로 센다 — 그 사이 가입·수신 동의가 바뀌었을 수 있다
  useEffect(() => {
    if (!targetAudience) return undefined;
    let cancelled = false;
    setCount(null);
    setCountFailed(false);
    setIsCounting(true);
    notificationAPI
      .getAudienceCount(targetAudience)
      .then((res) => {
        if (!cancelled) setCount(res?.result?.object ?? null);
      })
      .catch(() => {
        if (!cancelled) setCountFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsCounting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [data, targetAudience]);

  if (!data) return null;

  const audienceLabel = NOTIFICATION_TARGET_AUDIENCE_LABEL[data.target_audience];

  const renderCount = () => {
    if (isCounting) return <span className="ni-confirm-count muted">…</span>;
    if (countFailed || !count) return <span className="ni-confirm-count muted">—</span>;
    return <span className="ni-confirm-count">{count.recipient_count.toLocaleString()}명</span>;
  };

  return (
    <Modal open={!!data} onClose={onClose} title="발송 확인" width="460px">
      <div className="modal-body">
        <div className="ni-confirm-label">회원 화면 미리보기</div>
        <div className="ni-confirm-preview">
          <AppIcon />
          <div style={{ minWidth: 0 }}>
            <div className="ni-confirm-preview-title">{data.title}</div>
            <div className="ni-confirm-preview-content">{data.content}</div>
          </div>
        </div>

        <div className="ni-confirm-audience">
          <span>{audienceLabel}</span>
          {renderCount()}
        </div>
        <div className="ni-confirm-note">
          {countFailed
            ? '대상 인원을 불러오지 못했습니다. 수신 동의 회원에게만 발송됩니다.'
            : `수신 동의 회원 한정${
                count && count.excluded_count > 0
                  ? ` · 미동의 ${count.excluded_count.toLocaleString()}명 제외`
                  : ''
              }`}
        </div>

        <div className="ni-confirm-when">
          <ClockIcon />
          {data.send_type === 'SCHEDULED' ? fmtSchedule(data.scheduled_at) : '즉시 발송'}
        </div>

        <div className="ni-confirm-question">위와 같이 발송하시겠습니까?</div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isSending || isCounting}
            onClick={onConfirm}
          >
            {isSending ? '발송 중...' : '발송'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
