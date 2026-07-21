import React from 'react';
import { StatCard } from '../common/stat-card';
import type { IAnnouncementStat } from 'src/types/announcement';

interface AnnouncementStatsProps {
  stats: IAnnouncementStat;
}

export const AnnouncementStats: React.FC<AnnouncementStatsProps> = ({ stats }) => (
  <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
    <StatCard
      label="게시 중 공지"
      value={`${stats.published?.toLocaleString()}건`}
      color="green"
      change={{ type: 'neutral', text: '앱 공지사항 노출' }}
    />
    <StatCard
      label="전체 공지"
      value={`${stats.published_diff_vs_last_month?.toLocaleString()}건`}
      color="blue"
      change={{ type: 'neutral', text: '등록 누적' }}
    />
    <StatCard
      label="임시저장"
      value={`${stats.draft?.toLocaleString()}건`}
      color="amber"
      change={{ type: 'neutral', text: '미게시' }}
    />
  </div>
);
