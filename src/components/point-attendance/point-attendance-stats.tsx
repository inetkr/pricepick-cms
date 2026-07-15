import React from 'react';
import { StatCard } from '../common/stat-card';

interface PointAttendanceStatsProps {
  todayVisits: number;
  todayPoints: number;
  isLoading?: boolean;
}

export const PointAttendanceStats: React.FC<PointAttendanceStatsProps> = ({
  todayVisits,
  todayPoints,
  isLoading = false,
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard
        label="오늘 출석 인원"
        value={isLoading ? '—' : `${todayVisits.toLocaleString()}명`}
        change={{ type: 'neutral', text: '오늘 기준' }}
        color="purple"
      />
      <StatCard
        label="오늘 지급 포인트"
        value={isLoading ? '—' : `${todayPoints.toLocaleString()}P`}
        change={{ type: 'neutral', text: '오늘 기준' }}
        color="green"
      />
      <StatCard
        label="5일 연속 달성"
        value="—"
        change={{ type: 'neutral', text: '오늘 기준' }}
        color="amber"
      />
    </div>
  );
};
