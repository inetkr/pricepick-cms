import React from 'react';
import { StatCard } from 'src/components/common/stat-card';

interface RevenueStatsProps {
  feeRevenue: string;
  gifticonRevenue: string;
  totalRevenue: string;
  feeChange?: string;
  gifticonChange?: string;
  totalChange?: string;
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({
  feeRevenue,
  gifticonRevenue,
  totalRevenue,
  feeChange = '제휴몰 D+30 정산',
  gifticonChange = '교환 마진 · 즉시',
  totalChange = '포스트백 + 교환 마진',
}) => {
  return (
    <div className="stats-grid">
      <StatCard
        label="제휴 수수료 매출"
        value={feeRevenue}
        change={{ type: 'neutral', text: feeChange }}
        color="purple"
      />
      <StatCard
        label="기프티콘 판매 매출"
        value={gifticonRevenue}
        change={{ type: 'neutral', text: gifticonChange }}
        color="amber"
      />
      <StatCard
        label="총 매출"
        value={totalRevenue}
        change={{ type: 'neutral', text: totalChange }}
        color="green"
      />
    </div>
  );
};
