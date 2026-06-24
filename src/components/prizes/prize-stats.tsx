import React from 'react';
import { StatCard } from '../common/stat-card';

interface PrizeStatsProps {
  todayEntries: string;
  todayWinners: string;
  eventTicketsUsed: string;
  unshippedPrizes: string;
}

export const PrizeStats: React.FC<PrizeStatsProps> = ({
  todayEntries,
  todayWinners,
  eventTicketsUsed,
  unshippedPrizes,
}) => {
  return (
    <div className="stats-grid">
      <StatCard
        label="오늘 응모 수"
        value={todayEntries}
        change={{ type: 'neutral', text: '1회 추첨 최대 10장' }}
        color="purple"
      />
      <StatCard
        label="오늘 당첨자"
        value={todayWinners}
        change={{ type: 'up', text: '1등17 · 2등51 · 3등59' }}
        color="green"
      />
      <StatCard
        label="소모 이벤트 티켓"
        value={eventTicketsUsed}
        change={{ type: 'neutral', text: '응모당 1장' }}
        color="amber"
      />
      <StatCard
        label="미발송 경품"
        value={unshippedPrizes}
        change={{ type: 'down', text: '빠른 발송 필요' }}
        color="red"
      />
    </div>
  );
};
