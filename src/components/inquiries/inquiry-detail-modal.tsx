'use client';

import React, { useEffect, useState } from 'react';
import { QNA_STATE_SELECT_OPTIONS, QNA_TYPE_LABELS } from 'src/constants/qna';
import type { IQna, IQnaState, IUpdateQnaPayload } from 'src/types/qna';

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
  const [state, setState] = useState<IQnaState>('PENDING');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (open && inquiry) {
      setAnswer(inquiry.answer || '');
      setState((inquiry.state as IQnaState) || 'PENDING');
      setAttempted(false);
    }
  }, [open, inquiry]);

  if (!open || !inquiry) return null;

  const isValid = answer.trim() !== '';
  const answerError = attempted && answer.trim() === '' ? '답변 내용을 입력해주세요.' : null;

  const handleSubmit = () => {
    setAttempted(true);
    if (!isValid) return;
    // 답변을 저장하는데 상태가 아직 미처리인 경우, 자동으로 처리 중 이상으로 올려준다.
    const nextState = state === 'PENDING' ? 'PROCESSING' : state;
    onSubmit(inquiry.id, { answer, state: nextState });
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
              <div className="form-label">기존 답변</div>
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

          <div className="form-group">
            <label className="form-label" htmlFor="inq-state">
              처리 상태
            </label>
            <select
              id="inq-state"
              className="form-select"
              value={state}
              onChange={(e) => setState(e.target.value as IQnaState)}
            >
              {QNA_STATE_SELECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
