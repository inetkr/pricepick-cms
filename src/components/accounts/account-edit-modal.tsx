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
  const [attempted, setAttempted] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    if (open && account) {
      setForm({
        fullname: account.fullname || '',
        role: 'ADMIN',
      });
      setPassword('');
      setPasswordConfirm('');
      setAttempted(false);
    }
  }, [open, account]);

  if (!open || !account) return null;

  // 비밀번호는 바꿀 때만 입력한다 — 생성 화면과 같은 6자 이상 규칙
  const isChangingPassword = password.length > 0 || passwordConfirm.length > 0;
  const passwordError =
    attempted && isChangingPassword && password.trim().length < 6
      ? '비밀번호는 6자 이상 입력해주세요.'
      : null;
  const passwordConfirmError =
    attempted && isChangingPassword && password !== passwordConfirm
      ? '비밀번호가 일치하지 않습니다.'
      : null;
  const isValid =
    form.fullname.trim() !== '' &&
    (!isChangingPassword || (password.trim().length >= 6 && password === passwordConfirm));
  const fullnameError = attempted && form.fullname.trim() === '' ? '이름을 입력해주세요.' : null;

  const handleSubmit = () => {
    setAttempted(true);
    if (!isValid) return;
    onSubmit(account.id, isChangingPassword ? { ...form, password } : form);
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
              className={`form-input${fullnameError ? ' has-error' : ''}`}
              value={form.fullname}
              onChange={(e) => setForm((prev) => ({ ...prev, fullname: e.target.value }))}
            />
            {fullnameError && <div className="field-error">{fullnameError}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="ae-password">
                새 비밀번호
              </label>
              <input
                id="ae-password"
                className={`form-input${passwordError ? ' has-error' : ''}`}
                type="password"
                placeholder="변경할 때만 입력"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="field-error">{passwordError}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ae-password-confirm">
                새 비밀번호 확인
              </label>
              <input
                id="ae-password-confirm"
                className={`form-input${passwordConfirmError ? ' has-error' : ''}`}
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              {passwordConfirmError && <div className="field-error">{passwordConfirmError}</div>}
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
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
