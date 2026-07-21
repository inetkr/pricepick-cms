import React from 'react';
import { StatCard } from '../common/stat-card';
import type { INotificationStat } from 'src/types/notification';

interface NotificationStatsProps {
  stats: INotificationStat;
}

export const NotificationStats: React.FC<NotificationStatsProps> = ({ stats }) => (
  <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
    <StatCard
      label="이번달 발송"
      value={`${stats.sent_this_month?.toLocaleString()}건`}
      color="purple"
      change={{ type: 'neutral', text: '이번달 누적' }}
    />
    <StatCard
      label="평균 오픈율"
      value={`${stats.avg_open_rate?.toLocaleString()}%`}
      color="green"
      change={{ type: 'neutral', text: '발송 기준' }}
    />
    <StatCard
      label="예약 대기"
      value={`${stats.scheduled_count?.toLocaleString()}건`}
      color="amber"
      change={{ type: 'neutral', text: '발송 예정' }}
    />
  </div>
);
