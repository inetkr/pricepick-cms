'use client';

import React, { useEffect, useState } from 'react';
import {
  getNextTier,
  WeeklyDrawPrizeRows,
} from 'src/components/weekly-draws/weekly-draw-prize-rows';
import type { IDrawPrizeTier, IDrawRound } from 'src/types/weekly-draws/weekly-draw';
import { formatDrawRoundLabel } from 'src/utils/weekly-draw';

interface WeeklyDrawRoundModalProps {
  open: boolean;
  round: IDrawRound | null;
  onClose: () => void;
  onSubmit: (roundId: string, tiers: IDrawPrizeTier[]) => Promise<boolean | void> | void;
}

export const WeeklyDrawRoundModal: React.FC<WeeklyDrawRoundModalProps> = ({
  open,
  round,
  onClose,
  onSubmit,
}) => {
  const [tiers, setTiers] = useState<IDrawPrizeTier[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !round) return;
    setTiers(round.tiers.map((t) => ({ ...t })));
    setError('');
  }, [open, round]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !round) return null;

  const handleAddRow = () => {
    setTiers((prev) => [
      ...prev,
      { tier: getNextTier(prev), label: '', prize_name: '', winner_count: 1 },
    ]);
  };

  const handleSubmit = async () => {
    if (tiers.length === 0) {
      setError('등수별 경품 구성을 1개 이상 입력해주세요.');
      return;
    }
    if (tiers.some((t) => !t.prize_name.trim())) {
      setError('경품명을 입력해주세요.');
      return;
    }
    if (tiers.some((t) => t.winner_count < 1)) {
      setError('당첨 인원수는 1 이상이어야 합니다.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(round.id, tiers);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0, 0, 0, .45)',
      }}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) =>
        e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ') && onClose()
      }
    >
      <div
        className="card"
        style={{
          maxWidth: '620px',
          margin: '5vh auto',
          maxHeight: '86vh',
          overflow: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="card-header">
          <div className="card-title">경품 수정 — {formatDrawRoundLabel(round)}</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕ 닫기
          </button>
        </div>
        <div style={{ padding: '18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <label className="form-label" style={{ margin: 0 }}>
              등수별 경품 구성{' '}
              <span style={{ fontWeight: 500, color: 'var(--text-3)', fontSize: '11px' }}>
                · 등수는 목록 순서대로 자동 지정, 한 등수에 여러 명 가능
              </span>
            </label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleAddRow}>
              + 등수 추가
            </button>
          </div>
          <WeeklyDrawPrizeRows value={tiers} onChange={setTiers} hideAddButton hideLabelColumn />
          {error && (
            <div className="field-error" style={{ marginTop: '10px' }}>
              {error}
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '16px', display: 'block' }}
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
