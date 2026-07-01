import React from 'react';
import { ITicketStat } from 'src/types/tickets/ticket_stat';
import { StatCard } from '../common/stat-card';

interface TicketStatsProps {
  stats: ITicketStat;
}

export const TicketStats: React.FC<TicketStatsProps> = ({ stats }) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      <StatCard
        label="누적 발행"
        value={`${stats.total_issued.toLocaleString()}장`}
        change={{ type: 'neutral', text: '전체 누적' }}
        color="purple"
      />
      <StatCard
        label="오늘 발행"
        value={`${stats.today_issued.toLocaleString()}장`}
        change={{ type: 'up', text: '금일 기준' }}
        color="green"
      />
      <StatCard
        label="기프티콘 교환"
        value={`${stats.gifticon_exchanged.toLocaleString()}장`}
        change={{ type: 'neutral', text: '이번달 누적' }}
        color="amber"
      />
      <StatCard
        label="경품 응모 소모"
        value={`${stats.prize_used.toLocaleString()}장`}
        change={{ type: 'neutral', text: '이벤트 티켓' }}
        color="blue"
      />
      <StatCard
        label="부정행위 회수"
        value={`${stats.clawback.toLocaleString()}장`}
        change={{ type: 'down', text: '이번달 누적' }}
        color="red"
      />
    </div>
  );
};
