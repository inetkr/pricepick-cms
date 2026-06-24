// src/components/gifticons/GifticonStats.tsx
import React from 'react';
import { StatCard } from '../common/stat-card';

interface GifticonStatsProps {
  totalCount: number;
  usedCount: number;
  unusedCount: number;
  expiredCount: number;
}

export const GifticonStats: React.FC<GifticonStatsProps> = ({
  totalCount,
  usedCount,
  unusedCount,
  expiredCount,
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        label="총 발급"
        value={totalCount.toLocaleString()}
        change={{ type: 'neutral', text: '전체 누적' }}
        color="purple"
      />
      <StatCard
        label="사용 완료"
        value={usedCount.toLocaleString()}
        change={{ type: 'down', text: '이번달' }}
        color="green"
      />
      <StatCard
        label="미사용"
        value={unusedCount.toLocaleString()}
        change={{ type: 'neutral', text: '사용 가능' }}
        color="amber"
      />
      <StatCard
        label="만료"
        value={expiredCount.toLocaleString()}
        change={{ type: 'down', text: '이번달' }}
        color="red"
      />
    </div>
  );
};
