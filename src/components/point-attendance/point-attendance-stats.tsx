import React from 'react';
import { StatCard } from '../common/stat-card';
import { IAttendanceStat } from 'src/types/points/attendance_stat';

interface PointAttendanceStatsProps {
  stats: IAttendanceStat;
  isLoading?: boolean;
}

export const PointAttendanceStats: React.FC<PointAttendanceStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard
        label="오늘 출석 인원"
        value={isLoading ? '—' : `${stats.checked_in_today.toLocaleString()}명`}
        change={{ type: 'neutral', text: '오늘 기준' }}
        color="purple"
      />
      <StatCard
        label="오늘 지급 포인트"
        value={isLoading ? '—' : `${stats.points_granted_today.toLocaleString()}P`}
        change={{ type: 'neutral', text: '오늘 기준' }}
        color="green"
      />
      <StatCard
        label="5일 연속 달성"
        value={isLoading ? '—' : `${stats.streak_milestone_today.toLocaleString()}명`}
        change={{ type: 'neutral', text: '오늘 기준' }}
        color="amber"
      />
    </div>
  );
};
