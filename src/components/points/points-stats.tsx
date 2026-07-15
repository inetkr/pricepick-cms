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
        label="전체 원장 레코드"
        value={stats.total_transactions.toLocaleString()}
        change={{ type: 'neutral', text: 'append-only' }}
        color="green"
      />
      <StatCard
        label="누적 사용·차감"
        value={`${stats.used_and_converted.toLocaleString()}P`}
        change={{ type: 'neutral', text: '티켓 교환 포함' }}
        color="amber"
      />
      <StatCard
        label="만료 소멸"
        value={`${stats.total_expired.toLocaleString()}P`}
        change={{ type: 'neutral', text: '유효기간 경과' }}
        color="red"
      />
    </div>
  );
};
