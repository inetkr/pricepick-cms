'use client';

import React, { useEffect, useState } from 'react';
import { userAPI } from 'src/api';
import { useDebounce } from 'src/hooks/use-debounce';
import type { IUser } from 'src/types/users/user';

export interface PointManualActionData {
  user_identifier: string;
  action: 'ADMIN_ADD' | 'ADMIN_SUB';
  amount: number;
  description: string;
}

interface PointManualModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PointManualActionData) => void;
}

const ADMIN_ACTIONS = [
  { value: 'ADMIN_ADD', label: '지급' },
  { value: 'ADMIN_SUB', label: '회수' },
];

export const PointManualModal: React.FC<PointManualModalProps> = ({ open, onClose, onSubmit }) => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [action, setAction] = useState<'ADMIN_ADD' | 'ADMIN_SUB'>('ADMIN_ADD');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    if (open) {
      setUserIdentifier('');
      setSelectedUser(null);
      setAction('ADMIN_ADD');
      setAmount(0);
      setDescription('');
      setKeyword('');
      setSearchResults([]);
      setShowResults(false);
      setAttempted(false);
    }
  }, [open]);

  useEffect(() => {
    const trimmed = debouncedKeyword.trim();
    if (!trimmed) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    userAPI
      .searchUserByKeyword(trimmed)
      .then((res) => {
        if (cancelled) return;
        setSearchResults(res.result.object.rows || []);
        setShowResults(true);
      })
      .catch(() => {
        if (cancelled) return;
        setSearchResults([]);
        setShowResults(true);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedKeyword]);

  if (!open) return null;

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    setUserIdentifier(user.id);
    setKeyword('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setUserIdentifier('');
  };

  const isValid = userIdentifier.trim() !== '' && amount > 0 && description.trim() !== '';

  const userIdentifierError =
    attempted && userIdentifier.trim() === '' ? '대상 회원을 검색해서 선택해주세요.' : null;
  const amountError = attempted && amount <= 0 ? '포인트 금액을 입력해주세요.' : null;
  const descriptionError =
    attempted && description.trim() === '' ? '처리 사유를 입력해주세요.' : null;

  const handleSubmit = () => {
    setAttempted(true);
    if (!isValid) return;
    onSubmit({
      user_identifier: userIdentifier,
      action,
      amount,
      description,
    });
    onClose();
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
          <div className="modal-title">수동 포인트 지급 / 회수</div>
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
            <strong>주의:</strong> 포인트 원장은 append-only입니다 — 회수는 삭제가 아니라 음수
            레코드 추가로 처리되며 되돌릴 수 없습니다.
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="point-manual-user-identifier">
              대상 회원
            </label>
            <div className="user-search">
              <input
                id="point-manual-user-identifier"
                className={`form-input${userIdentifierError ? ' has-error' : ''}`}
                placeholder="대상 회원 닉네임 또는 UID"
                autoComplete="off"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowResults(true);
                }}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
              />
              {showResults && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-md)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    zIndex: 20,
                  }}
                >
                  {isSearching && (
                    <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-2)' }}>
                      검색 중...
                    </div>
                  )}
                  {!isSearching && searchResults.length === 0 && (
                    <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-2)' }}>
                      검색 결과가 없습니다
                    </div>
                  )}
                  {!isSearching &&
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectUser(user)}
                        onKeyDown={(e) =>
                          (e.key === 'Enter' || e.key === ' ') && handleSelectUser(user)
                        }
                        style={{
                          padding: '9px 12px',
                          fontSize: '13px',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border-soft)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--surface-2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {user.nickname} ·{' '}
                        {user.kakao_info ? user.kakao_info.email : '게스트(비연동)'} ·{' '}
                        {user.identified_id}
                      </div>
                    ))}
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="user-search-chips">
                <span className="user-search-chip">
                  {selectedUser.nickname} ·{' '}
                  {selectedUser.kakao_info ? selectedUser.kakao_info.email : '게스트(비연동)'} ·{' '}
                  {selectedUser.identified_id}
                  <button type="button" onClick={handleClearUser} aria-label="선택 해제">
                    ×
                  </button>
                </span>
              </div>
            )}
            {userIdentifierError && <div className="field-error">{userIdentifierError}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="point-manual-action">
                처리 유형
              </label>
              <select
                id="point-manual-action"
                className="form-select"
                value={action}
                onChange={(e) => setAction(e.target.value as 'ADMIN_ADD' | 'ADMIN_SUB')}
              >
                {ADMIN_ACTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="point-manual-amount">
                포인트 금액(P)
              </label>
              <input
                id="point-manual-amount"
                className={`form-input${amountError ? ' has-error' : ''}`}
                type="number"
                placeholder="0"
                min={1}
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              />
              {amountError && <div className="field-error">{amountError}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="point-manual-description">
              사유
            </label>
            <input
              id="point-manual-description"
              className={`form-input${descriptionError ? ' has-error' : ''}`}
              placeholder="처리 사유 (필수)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && <div className="field-error">{descriptionError}</div>}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            처리하기
          </button>
        </div>
      </div>
    </div>
  );
};
