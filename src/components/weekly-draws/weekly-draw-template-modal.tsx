'use client';

import React, { useEffect, useState } from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { WeeklyDrawPrizeRows } from 'src/components/weekly-draws/weekly-draw-prize-rows';
import type { IDrawPrizeTier } from 'src/types/weekly-draws/weekly-draw';

interface WeeklyDrawTemplateModalProps {
  open: boolean;
  template: IDrawPrizeTier[];
  onClose: () => void;
  onSave: (tiers: IDrawPrizeTier[]) => Promise<boolean | void> | void;
}

export const WeeklyDrawTemplateModal: React.FC<WeeklyDrawTemplateModalProps> = ({
  open,
  template,
  onClose,
  onSave,
}) => {
  const [tiers, setTiers] = useState<IDrawPrizeTier[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTiers(template.map((t) => ({ ...t })));
      setError('');
    }
  }, [open, template]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

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
      await onSave(tiers);
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
          maxWidth: '560px',
          margin: '8vh auto',
          maxHeight: '80vh',
          overflow: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="card-header">
          <div className="card-title">기본 경품 구성 템플릿</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕ 닫기
          </button>
        </div>
        <div style={{ padding: '18px' }}>
          <InfoBox type="info">
            자동 생성되는 다음 주차 회차는 이 템플릿을 그대로 복사해 만들어집니다. 생성된 개별 회차는
            이후 각 회차의 &quot;경품 수정&quot;에서 별도로 조정할 수 있습니다.
          </InfoBox>
          <WeeklyDrawPrizeRows value={tiers} onChange={setTiers} hideLabelColumn />
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
            {submitting ? '저장 중...' : '템플릿 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
