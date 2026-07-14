import React from 'react';
import type { ITicketStat } from 'src/types/tickets/ticket_stat';
import { StatCard } from '../common/stat-card';

interface TicketStatsProps {
  stats: ITicketStat;
}

export const TicketStats: React.FC<TicketStatsProps> = ({ stats }) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      <StatCard
        label="누적 발행 (적립)"
        value={`${stats.total_transactions.toLocaleString()}`}
        change={{ type: 'neutral', text: '전체 누적' }}
        color="purple"
      />
      <StatCard
        label="기프티콘 교환"
        value={`${stats.total_gifticon_purchases.toLocaleString()}`}
        change={{ type: 'neutral', text: '티켓 소모' }}
        color="green"
      />
      <StatCard
        label="전체 원장 레코드"
        value={`${stats.total_accumulation_transactions.toLocaleString()}`}
        change={{ type: 'neutral', text: 'append-only' }}
        color="amber"
      />
      <StatCard
        label="만료 소멸"
        value={`${stats.total_expired.toLocaleString()}`}
        change={{ type: 'neutral', text: '이벤트 티켓' }}
        color="blue"
      />
      <StatCard
        label="부정행위 회수"
        value={`${stats.total_admin_sub.toLocaleString()}`}
        change={{ type: 'neutral', text: '이번달 누적' }}
        color="red"
      />
    </div>
  );
};
