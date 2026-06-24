import React from 'react';
import { StatCard } from '../common/stat-card';

interface PointAttendanceStatsProps {
  todayMembers: number;
  todayPoints: number;
  streakCount: number;
  conversionRate: number;
  conversionChange?: string;
}

export const PointAttendanceStats: React.FC<PointAttendanceStatsProps> = ({
  todayMembers,
  todayPoints,
  streakCount,
  conversionRate,
  conversionChange = '방문→복귀 완료',
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        label="오늘 출석 회원"
        value={todayMembers.toLocaleString()}
        change={{ type: 'neutral', text: '복귀 완료 기준' }}
        color="purple"
      />
      <StatCard
        label="오늘 지급 포인트"
        value={`${todayPoints.toLocaleString()}P`}
        change={{ type: 'up', text: `${todayMembers}명 × 100P` }}
        color="green"
      />
      <StatCard
        label="5일 연속 달성"
        value={streakCount.toLocaleString()}
        change={{ type: 'neutral', text: '이벤트 티켓 지급' }}
        color="amber"
      />
      <StatCard
        label="제휴몰 방문 전환율"
        value={`${conversionRate}%`}
        change={{ type: 'up', text: conversionChange }}
        color="blue"
      />
    </div>
  );
};
