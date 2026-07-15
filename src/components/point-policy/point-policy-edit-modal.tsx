'use client';

import React, { useEffect, useState } from 'react';
import type { IPointPolicyConfigValue } from 'src/types/config/point_policy_config';

interface PointPolicyEditModalProps {
  open: boolean;
  config: IPointPolicyConfigValue;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (config: IPointPolicyConfigValue) => void;
}

const expiryOptions: { value: IPointPolicyConfigValue['expiry_policy']; label: string }[] = [
  { value: 'ONE_YEAR', label: '적립일 + 1년 (FIFO 소멸)' },
  { value: 'SIX_MONTHS', label: '적립일 + 6개월' },
  { value: 'NO_EXPIRY', label: '만료 없음' },
];

const directionOptions: {
  value: IPointPolicyConfigValue['conversion_direction'];
  label: string;
}[] = [
  { value: 'BIDIRECTIONAL', label: '양방향 (포인트 ↔ 티켓)' },
  { value: 'ONE_WAY_POINT_TO_TICKET', label: '단방향 (포인트 → 티켓)' },
];

const applyTimingOptions: { value: IPointPolicyConfigValue['apply_timing']; label: string }[] = [
  { value: 'IMMEDIATE', label: '즉시 적용' },
  { value: 'SCHEDULED', label: '예약 적용' },
];

export const PointPolicyEditModal: React.FC<PointPolicyEditModalProps> = ({
  open,
  config,
  isSaving = false,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<IPointPolicyConfigValue>(config);
  const [scheduleError, setScheduleError] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(config);
      setScheduleError(false);
    }
  }, [open, config]);

  if (!open) return null;

  const handleSubmit = () => {
    if (form.apply_timing === 'SCHEDULED' && !form.scheduled_at) {
      setScheduleError(true);
      return;
    }
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
          <div className="modal-title">포인트 정책 수정</div>
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
              <label className="form-label" htmlFor="pp-edit-rate-point">
                교환 비율 (P = 원)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  id="pp-edit-rate-point"
                  className="form-input"
                  type="number"
                  min={1}
                  value={form.exchange_rate.point}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      exchange_rate: {
                        ...prev.exchange_rate,
                        point: Math.max(1, Number(e.target.value) || 0),
                      },
                    }))
                  }
                />
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>P =</span>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  aria-label="원 환산값"
                  value={form.exchange_rate.won}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      exchange_rate: {
                        ...prev.exchange_rate,
                        won: Math.max(1, Number(e.target.value) || 0),
                      },
                    }))
                  }
                />
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>원</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pp-edit-expiry">
                만료 기간
              </label>
              <select
                id="pp-edit-expiry"
                className="form-select"
                value={form.expiry_policy}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    expiry_policy: e.target.value as IPointPolicyConfigValue['expiry_policy'],
                  }))
                }
              >
                {expiryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="pp-edit-daily-limit">
                일일 적립 한도
              </label>
              <input
                id="pp-edit-daily-limit"
                className="form-input"
                type="number"
                min={0}
                placeholder="없음 (무제한)"
                value={form.daily_accumulation_limit ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    daily_accumulation_limit: e.target.value === '' ? null : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pp-edit-direction">
                교환 방향
              </label>
              <select
                id="pp-edit-direction"
                className="form-select"
                value={form.conversion_direction}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    conversion_direction: e.target
                      .value as IPointPolicyConfigValue['conversion_direction'],
                  }))
                }
              >
                {directionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pp-edit-apply-timing">
              적용 시점
            </label>
            <select
              id="pp-edit-apply-timing"
              className="form-select"
              value={form.apply_timing}
              onChange={(e) => {
                const apply_timing = e.target.value as IPointPolicyConfigValue['apply_timing'];
                setForm((prev) => ({
                  ...prev,
                  apply_timing,
                  scheduled_at: apply_timing === 'IMMEDIATE' ? null : prev.scheduled_at,
                }));
                if (apply_timing === 'IMMEDIATE') setScheduleError(false);
              }}
            >
              {applyTimingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {form.apply_timing === 'SCHEDULED' && (
              <>
                <input
                  className="form-input"
                  style={{ marginTop: '8px' }}
                  type="datetime-local"
                  aria-label="적용 예정 일시"
                  value={form.scheduled_at ?? ''}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, scheduled_at: e.target.value || null }));
                    if (e.target.value) setScheduleError(false);
                  }}
                />
                {scheduleError && (
                  <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--danger)' }}>
                    적용 예정 일시를 선택해 주세요.
                  </div>
                )}
              </>
            )}
          </div>
          <div className="warn-box">
            <strong>주의:</strong> 포인트 환율·만료는 비용·민원 직결. 저장 시 변경 전후 비교 + 변경
            이력이 기록됩니다.
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
