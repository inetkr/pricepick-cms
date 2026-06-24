// src/components/tickets/TicketStats.tsx
import React from 'react';
import { StatCard } from '../common/stat-card';

interface TicketStatsProps {
  totalIssued: string;
  todayIssued: string;
  gifticonExchanged: string;
  prizeUsed: string;
  clawback: string;
  todayIssuedChange?: string;
}

export const TicketStats: React.FC<TicketStatsProps> = ({
  totalIssued,
  todayIssued,
  gifticonExchanged,
  prizeUsed,
  clawback,
  todayIssuedChange = '↑ 12.4%',
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      <StatCard
        label="누적 발행"
        value={totalIssued}
        change={{ type: 'neutral', text: '전체 누적' }}
        color="purple"
      />
      <StatCard
        label="오늘 발행"
        value={todayIssued}
        change={{ type: 'up', text: todayIssuedChange }}
        color="green"
      />
      <StatCard
        label="기프티콘 교환"
        value={gifticonExchanged}
        change={{ type: 'neutral', text: '이번달 누적' }}
        color="amber"
      />
      <StatCard
        label="경품 응모 소모"
        value={prizeUsed}
        change={{ type: 'neutral', text: '이벤트 티켓' }}
        color="blue"
      />
      <StatCard
        label="부정행위 회수"
        value={clawback}
        change={{ type: 'down', text: '이번달 누적' }}
        color="red"
      />
    </div>
  );
};
