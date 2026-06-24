'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ExchangeRate, ExchangeRateCard } from 'src/components/point-policy/exchange-rate-card';
import { PointPolicyCard } from 'src/components/point-policy/point-policy-card';

// Mock data cho tỷ lệ quy đổi
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

// Mock policy
const defaultPolicy = {
  exchangeRate: '10P = 1원',
  expiryPeriod: '적립일로부터 1년',
  dailyLimit: '없음',
  exchangeDirection: '포인트 ↔ 티켓 쌍방 교환',
  mainEarningPath: '출석체크 (일 100P)',
};

export const PointPolicySection: React.FC = () => {
  const [policy] = useState(defaultPolicy);

  const handleEditExchangeRate = () => {
    // TODO: Open modal for editing exchange rates
    toast.info('교환 비율 수정 기능은 준비 중입니다.');
  };

  const handleEditPolicy = () => {
    // TODO: Open modal for editing policy
    toast.info('정책 수정 기능은 준비 중입니다.');
  };

  return (
    <div className="section active">
      <div className="info-box">
        <strong>포인트 기준 환율</strong> — 10P = 1원. 포인트는 티켓과 양방향 교환되며, 교환 비율은
        환산가치 1:1 등가입니다.
      </div>

      {/* Bảng tỷ lệ quy đổi */}
      <ExchangeRateCard data={exchangeRateData} onEdit={handleEditExchangeRate} />

      {/* Chính sách tích lũy và hết hạn */}
      <PointPolicyCard policy={policy} onEdit={handleEditPolicy} />
    </div>
  );
};
