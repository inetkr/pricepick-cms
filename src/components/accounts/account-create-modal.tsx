'use client';

import React, { useEffect, useState } from 'react';
import { EMPLOYEE_ROLE_OPTIONS } from 'src/constants/employee';
import type { ICreateEmployeePayload } from 'src/types/admin';

interface AccountCreateModalProps {
  open: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (payload: ICreateEmployeePayload) => void;
}

const initialForm: ICreateEmployeePayload = {
  username: '',
  email: '',
  password: '',
  fullname: '',
  role: 'ADMIN',
};

export const AccountCreateModal: React.FC<AccountCreateModalProps> = ({
  open,
  isSaving = false,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ICreateEmployeePayload>(initialForm);

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  if (!open) return null;

  const isValid =
    form.username.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.trim().length >= 6 &&
    form.fullname.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(form);
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
          <div className="modal-title">관리자 계정 추가</div>
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
          <div className="form-group">
            <label className="form-label" htmlFor="ac-fullname">
              이름
            </label>
            <input
              id="ac-fullname"
              className="form-input"
              placeholder="예: 홍길동"
              value={form.fullname}
              onChange={(e) => setForm((prev) => ({ ...prev, fullname: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ac-username">
              로그인 아이디
            </label>
            <input
              id="ac-username"
              className="form-input"
              placeholder="예: hong (실제 로그인 아이디)"
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ac-email">
              이메일
            </label>
            <input
              id="ac-email"
              className="form-input"
              type="email"
              placeholder="예: hong@pricepick.co.kr"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ac-role">
              역할
            </label>
            <select
              id="ac-role"
              className="form-select"
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  role: e.target.value as ICreateEmployeePayload['role'],
                }))
              }
            >
              {EMPLOYEE_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="form-hint">슈퍼어드민 계정은 추가할 수 없습니다.</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ac-password">
              임시 비밀번호
            </label>
            <input
              id="ac-password"
              className="form-input"
              type="password"
              placeholder="최초 로그인 후 변경 필요 (6자 이상)"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
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
            {isSaving ? '생성 중...' : '계정 생성'}
          </button>
        </div>
      </div>
    </div>
  );
};
