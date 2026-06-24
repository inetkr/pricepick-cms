// src/components/points/PointsStats.tsx
import React from 'react';
import { StatCard } from '../common/stat-card';

interface PointsStatsProps {
  totalAccumulated: string;
  todayAccumulated: string;
  totalUsed: string;
  expiredThisMonth: string;
  todayChange?: string;
  totalUsedChange?: string;
}

export const PointsStats: React.FC<PointsStatsProps> = ({
  totalAccumulated,
  todayAccumulated,
  totalUsed,
  expiredThisMonth,
  todayChange = '↑ 8.2%',
  totalUsedChange = '티켓 교환 포함',
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        label="누적 적립 포인트"
        value={totalAccumulated}
        change={{ type: 'neutral', text: '전체 누적' }}
        color="purple"
      />
      <StatCard
        label="오늘 적립"
        value={todayAccumulated}
        change={{ type: 'up', text: todayChange }}
        color="green"
      />
      <StatCard
        label="누적 사용·교환"
        value={totalUsed}
        change={{ type: 'neutral', text: totalUsedChange }}
        color="amber"
      />
      <StatCard
        label="이번달 만료"
        value={expiredThisMonth}
        change={{ type: 'down', text: '유효기간 1년 경과' }}
        color="red"
      />
    </div>
  );
};
