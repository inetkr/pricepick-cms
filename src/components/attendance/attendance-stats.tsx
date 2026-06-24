// src/components/attendance/AttendanceStats.tsx
import React from 'react';
import { StatCard } from '../common/stat-card';

interface AttendanceStatsProps {
  totalParticipants: string;
  winners: string;
  winRate: string;
  ticketsUsed: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  totalParticipants,
  winners,
  winRate,
  ticketsUsed,
}) => {
  return (
    <div className="stats-grid">
      <StatCard
        label="이번주 자동 응모자"
        value={totalParticipants}
        change={{ type: 'neutral', text: '이벤트 티켓 보유 회원' }}
        color="purple"
      />
      <StatCard
        label="당첨자 수"
        value={winners}
        change={{ type: 'up', text: `당첨률 ${winRate}` }}
        color="green"
      />
      <StatCard
        label="지급된 당첨 경품"
        value={winners}
        change={{ type: 'neutral', text: '기프티콘·실물 등' }}
        color="amber"
      />
      <StatCard
        label="이번주 소진 티켓"
        value={ticketsUsed}
        change={{ type: 'down', text: '경품 응모 사용' }}
        color="red"
      />
    </div>
  );
};
