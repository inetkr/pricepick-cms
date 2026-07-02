import React from 'react';
import type { IPointStat } from 'src/types/points/point_stat';
import { StatCard } from '../common/stat-card';

interface PointsStatsProps {
  stats: IPointStat;
}

export const PointsStats: React.FC<PointsStatsProps> = ({ stats }) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        label="누적 적립 포인트"
        value={`${stats.total_accumulated.toLocaleString()}P`}
        change={{ type: 'neutral', text: '전체 누적' }}
        color="purple"
      />
      <StatCard
        label="오늘 적립"
        value={`${stats.today_accumulated.toLocaleString()}P`}
        change={{ type: 'up', text: '금일 기준' }}
        color="green"
      />
      <StatCard
        label="누적 사용·교환"
        value={`${stats.total_used.toLocaleString()}P`}
        change={{ type: 'neutral', text: '티켓 교환 포함' }}
        color="amber"
      />
      <StatCard
        label="이번달 만료"
        value={`${stats.expired_this_month.toLocaleString()}P`}
        change={{ type: 'down', text: '유효기간 1년 경과' }}
        color="red"
      />
    </div>
  );
};
