'use client';

import React, { useEffect, useState } from 'react';
import type { IAdmin, IUpdateEmployeePayload } from 'src/types/admin';

interface AccountEditModalProps {
  open: boolean;
  account: IAdmin | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (id: string, payload: IUpdateEmployeePayload) => void;
}

const initialForm: IUpdateEmployeePayload = { fullname: '', role: 'ADMIN' };

export const AccountEditModal: React.FC<AccountEditModalProps> = ({
  open,
  account,
  isSaving = false,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<IUpdateEmployeePayload>(initialForm);

  useEffect(() => {
    if (open && account) {
      setForm({
        fullname: account.fullname || '',
        role: 'ADMIN',
      });
    }
  }, [open, account]);

  if (!open || !account) return null;

  const isValid = form.fullname.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(account.id, form);
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
          <div className="modal-title">관리자 계정 수정</div>
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
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="ae-username">
                로그인 아이디
              </label>
              <input id="ae-username" className="form-input" value={account.username} disabled />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ae-email">
                이메일
              </label>
              <input id="ae-email" className="form-input" value={account.email} disabled />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ae-fullname">
              이름
            </label>
            <input
              id="ae-fullname"
              className="form-input"
              value={form.fullname}
              onChange={(e) => setForm((prev) => ({ ...prev, fullname: e.target.value }))}
            />
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
            disabled={!isValid || isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
