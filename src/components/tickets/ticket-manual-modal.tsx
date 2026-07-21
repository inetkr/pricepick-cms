'use client';

import React, { useEffect, useRef, useState } from 'react';
import { userAPI } from 'src/api';
import { useDebounce } from 'src/hooks/use-debounce';
import type { IUser } from 'src/types/users/user';

export interface TicketManualActionData {
  user_identifier: string; // 닉네임 또는 UID
  action: 'ADMIN_ADD' | 'ADMIN_SUB';
  tickets: {
    ticket_type: 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT';
    amount: number;
  }[];
  description: string;
}

interface TicketManualModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TicketManualActionData) => void;
}

type TicketGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT';

const ADMIN_ACTIONS = [
  { value: 'ADMIN_ADD', label: '지급' },
  { value: 'ADMIN_SUB', label: '회수' },
];

const TICKET_GRADES: { value: TicketGrade; label: string }[] = [
  { value: 'BRONZE', label: '브론즈' },
  { value: 'SILVER', label: '실버' },
  { value: 'GOLD', label: '골드' },
  { value: 'EVENT', label: '이벤트' },
];

const INITIAL_QUANTITIES: Record<TicketGrade, number> = {
  BRONZE: 0,
  SILVER: 0,
  GOLD: 0,
  EVENT: 0,
};

export const TicketManualModal: React.FC<TicketManualModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [action, setAction] = useState<'ADMIN_ADD' | 'ADMIN_SUB'>('ADMIN_ADD');
  const [quantities, setQuantities] = useState<Record<TicketGrade, number>>(INITIAL_QUANTITIES);
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);
  const lastSelectedKeywordRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      setUserIdentifier('');
      setAction('ADMIN_ADD');
      setQuantities(INITIAL_QUANTITIES);
      setDescription('');
      setKeyword('');
      setSearchResults([]);
      setShowResults(false);
      lastSelectedKeywordRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const trimmed = debouncedKeyword.trim();
    if (!trimmed) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    if (debouncedKeyword === lastSelectedKeywordRef.current) {
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
    const label = `${user.username} · ${user.nickname} · ${user.id}`;
    lastSelectedKeywordRef.current = label;
    setKeyword(label);
    setUserIdentifier(user.id);
    setSearchResults([]);
    setShowResults(false);
  };

  const stepQty = (grade: TicketGrade, delta: number) => {
    setQuantities((prev) => ({ ...prev, [grade]: Math.max(0, prev[grade] + delta) }));
  };

  const setQty = (grade: TicketGrade, value: number) => {
    setQuantities((prev) => ({ ...prev, [grade]: Number.isFinite(value) ? Math.max(0, value) : 0 }));
  };

  const hasQuantity = TICKET_GRADES.some((g) => quantities[g.value] > 0);

  const isValid =
    userIdentifier.trim() !== '' && hasQuantity && description.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      user_identifier: userIdentifier,
      action,
      tickets: TICKET_GRADES.filter((g) => quantities[g.value] > 0).map((g) => ({
        ticket_type: g.value,
        amount: quantities[g.value],
      })),
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
              대상 회원
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="ticket-manual-user-identifier"
                className="form-input"
                placeholder="대상 회원 닉네임 또는 UID"
                autoComplete="off"
                value={keyword}
                onChange={(e) => {
                  const { value } = e.target;
                  setKeyword(value);
                  setUserIdentifier(value);
                }}
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
                      <button
                        key={user.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectUser(user)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '9px 12px',
                          fontSize: '13px',
                          color: 'var(--text)',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--border-soft)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--surface-2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {user.username} · {user.nickname} · {user.id}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-manual-action">
              처리 유형
            </label>
            <select
              id="ticket-manual-action"
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
            <div className="form-label">티켓 수량 (등급별, 0보다 큰 것만 처리)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TICKET_GRADES.map((g) => (
                <div key={g.value} className="tm-grade-row">
                  <span className="tm-grade-label">{g.label}</span>
                  <div className="tm-stepper">
                    <button
                      type="button"
                      className="tm-stepper-btn"
                      onClick={() => stepQty(g.value, -1)}
                    >
                      −
                    </button>
                    <input
                      className="form-input"
                      type="number"
                      min={0}
                      value={quantities[g.value]}
                      onChange={(e) => setQty(g.value, Number(e.target.value))}
                    />
                    <button
                      type="button"
                      className="tm-stepper-btn"
                      onClick={() => stepQty(g.value, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-manual-description">
              사유
            </label>
            <input
              id="ticket-manual-description"
              className="form-input"
              placeholder="처리 사유 (필수)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            disabled={!isValid}
          >
            처리하기
          </button>
        </div>
      </div>
    </div>
  );
};
