import React from 'react';
import { StatCard } from '../common/stat-card';

interface SettlementStatsProps {
  monthlyConfirmed: string;
  monthlyEstimated: string;
  yearlyTotal: string;
  confirmedDesc?: string;
  estimatedDesc?: string;
  yearlyChange?: string;
  yearlyChangeType?: 'up' | 'down' | 'neutral';
}

export const SettlementStats: React.FC<SettlementStatsProps> = ({
  monthlyConfirmed,
  monthlyEstimated,
  yearlyTotal,
  confirmedDesc = '전월 확정분',
  estimatedDesc = '이번달 포스트백 기준',
  yearlyChange,
  yearlyChangeType = 'up',
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard
        label="이번달 확정 정산"
        value={monthlyConfirmed}
        change={{ type: 'neutral', text: confirmedDesc }}
        color="green"
      />
      <StatCard
        label="이번달 추정 매출"
        value={monthlyEstimated}
        change={{ type: 'neutral', text: estimatedDesc }}
        color="purple"
      />
      <StatCard
        label="누적 수익 (올해)"
        value={yearlyTotal}
        change={{ type: yearlyChangeType, text: yearlyChange ?? '' }}
        color="amber"
      />
    </div>
  );
};
