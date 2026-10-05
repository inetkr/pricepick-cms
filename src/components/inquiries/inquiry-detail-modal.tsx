'use client';

import { formatDate } from 'src/utils/helper';
import React, { useEffect, useState } from 'react';
import { QNA_TYPE_LABELS } from 'src/constants/qna';
import type { IQna, IUpdateQnaPayload } from 'src/types/qna';

interface InquiryDetailModalProps {
  open: boolean;
  inquiry: IQna | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (id: string, payload: IUpdateQnaPayload) => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const InquiryDetailModal: React.FC<InquiryDetailModalProps> = ({
  open,
  inquiry,
  isSaving = false,
  onClose,
  onSubmit,
}) => {
  const [answer, setAnswer] = useState('');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (open && inquiry) {
      setAnswer(inquiry.answer || '');
      setAttempted(false);
    }
  }, [open, inquiry]);

  if (!open || !inquiry) return null;

  const isValid = answer.trim() !== '';
  const answerError = attempted && answer.trim() === '' ? '답변 내용을 입력해주세요.' : null;

  const handleSubmit = () => {
    setAttempted(true);
    if (!isValid) return;
    // 답변을 등록하면 자동으로 처리 완료 — 상태를 따로 고르지 않는다
    onSubmit(inquiry.id, { answer, state: 'COMPLETED' });
  };

  return (
    <div
      className="modal-overlay open"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) =>
        e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ') && onClose()
      }
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">문의 상세 / 답변</div>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="info-box">
            <strong>{inquiry.user?.nickname ?? '-'}</strong> &nbsp;·&nbsp;{' '}
            {formatDateTime(inquiry.created_at)} &nbsp;·&nbsp; {inquiry.title}
            <br />
            <strong>유형:</strong> {QNA_TYPE_LABELS[inquiry.type] ?? inquiry.type}
          </div>

          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: '14px',
              marginBottom: '14px',
              fontSize: '13px',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {inquiry.content}
          </div>

          {inquiry.answer && (
            <div className="form-group">
              <div className="form-label">
                기존 답변
                {inquiry.processed_at && (
                  <span style={{ marginLeft: '8px', fontWeight: 400, color: 'var(--text-3)' }}>
                    답변일 {formatDate(inquiry.processed_at, 'YYYY/MM/DD')}
                  </span>
                )}
              </div>
              <div
                style={{
                  background: 'var(--main-soft)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {inquiry.answer}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="inq-answer">
              답변 작성
            </label>
            <textarea
              id="inq-answer"
              className={`form-input${answerError ? ' has-error' : ''}`}
              style={{ minHeight: '100px' }}
              placeholder="답변을 입력하세요..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {answerError && <div className="field-error">{answerError}</div>}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            닫기
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? '발송 중...' : '답변 발송'}
          </button>
        </div>
      </div>
    </div>
  );
};
