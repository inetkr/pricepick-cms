'use client';

import React, { useEffect, useState } from 'react';

export interface TicketManualActionData {
  user_identifier: string; // 닉네임 또는 UID
  action: 'ADMIN_ADD' | 'ADMIN_SUB';
  ticket_type: 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT';
  amount: number;
  description: string;
}

interface TicketManualModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TicketManualActionData) => void;
}

const INITIAL_STATE: TicketManualActionData = {
  user_identifier: '',
  action: 'ADMIN_ADD',
  ticket_type: 'BRONZE',
  amount: 1,
  description: '',
};

const ADMIN_ACTIONS = [
  { value: 'ADMIN_ADD', label: '지급' },
  { value: 'ADMIN_SUB', label: '회수' },
];

const TICKET_TYPES = [
  { value: 'BRONZE', label: '브론즈' },
  { value: 'SILVER', label: '실버' },
  { value: 'GOLD', label: '골드' },
  { value: 'EVENT', label: '이벤트' },
];

export const TicketManualModal: React.FC<TicketManualModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TicketManualActionData>(INITIAL_STATE);

  useEffect(() => {
    if (open) {
      setFormData(INITIAL_STATE);
    }
  }, [open]);

  if (!open) return null;

  const isValid =
    formData.user_identifier.trim() !== '' &&
    formData.amount >= 1 &&
    formData.description.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div
      className="modal-overlay open"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) =>
        e.target === e.currentTarget &&
        (e.key === 'Enter' || e.key === ' ') &&
        onClose()
      }
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">수동 티켓 지급 / 회수</div>
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
          <div className="warn-box">
            <strong>주의:</strong> 수동 처리는 로그에 기록되며 되돌릴 수 없습니다.
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-manual-user-identifier">
              닉네임
            </label>
            <input
              id="ticket-manual-user-identifier"
              className="form-input"
              placeholder="대상 회원 닉네임 또는 UID"
              value={formData.user_identifier}
              onChange={(e) => setFormData({ ...formData, user_identifier: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="ticket-manual-action">
                처리 유형
              </label>
              <select
                id="ticket-manual-action"
                className="form-select"
                value={formData.action}
                onChange={(e) =>
                  setFormData({ ...formData, action: e.target.value as 'ADMIN_ADD' | 'ADMIN_SUB' })
                }
              >
                {ADMIN_ACTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ticket-manual-ticket-type">
                티켓 등급
              </label>
              <select
                id="ticket-manual-ticket-type"
                className="form-select"
                value={formData.ticket_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ticket_type: e.target.value as 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT',
                  })
                }
              >
                {TICKET_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="ticket-manual-amount">
                수량
              </label>
              <input
                id="ticket-manual-amount"
                className="form-input"
                type="number"
                placeholder="0"
                min={1}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ticket-manual-description">
                사유
              </label>
              <input
                id="ticket-manual-description"
                className="form-input"
                placeholder="처리 사유 (필수)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            처리하기
          </button>
        </div>
      </div>
    </div>
  );
};
