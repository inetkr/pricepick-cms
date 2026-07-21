'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import type { ExchangeRate } from 'src/components/point-policy/exchange-rate-card';
import { ExchangeRateCard } from 'src/components/point-policy/exchange-rate-card';
import { PointPolicyCard } from 'src/components/point-policy/point-policy-card';
import { PointPolicyEditModal } from 'src/components/point-policy/point-policy-edit-modal';
import { usePointPolicy } from 'src/sections/point-policy/hooks/use-point-policy';
import type { IPointPolicyConfigValue } from 'src/types/config/point_policy_config';

const exchangeRateData: ExchangeRate[] = [
  {
    grade: 'bronze',
    pointsToTicket: '1,000P → 1장',
    ticketToPoints: '1장 → 1,000P',
    usdValue: '100원',
  },
  {
    grade: 'silver',
    pointsToTicket: '10,000P → 1장',
    ticketToPoints: '1장 → 10,000P',
    usdValue: '1,000원',
  },
  {
    grade: 'gold',
    pointsToTicket: '20,000P → 1장',
    ticketToPoints: '1장 → 20,000P',
    usdValue: '2,000원',
  },
];

export const PointPolicySection: React.FC = () => {
  const { config, isLoading, isSaving, saveConfig } = usePointPolicy();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = async (next: IPointPolicyConfigValue) => {
    const ok = await saveConfig(next);
    if (ok) {
      setIsEditOpen(false);
      toast.success('포인트 정책이 저장되었습니다.');
    } else {
      toast.error('포인트 정책 저장에 실패했습니다.');
    }
  };

  return (
    <div className="section active">
      <div className="info-box">
        <strong>포인트 기준 환율</strong> — 10P = 1원. 포인트는 티켓과 양방향 교환되며, 교환 비율은
        환산가치 1:1 등가입니다.
      </div>

      <ExchangeRateCard data={exchangeRateData} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <PointPolicyCard config={config} onEdit={() => setIsEditOpen(true)} />
      )}

      <PointPolicyEditModal
        open={isEditOpen}
        config={config}
        isSaving={isSaving}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
};
