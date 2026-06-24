// src/components/notice/NoticeStats.tsx
import React from 'react';
import { StatCard } from '../common/stat-card';

interface NoticeStatsProps {
  published: number;
  monthlyCreated: number;
  drafts: number;
  monthlyChange?: string;
}

export const NoticeStats: React.FC<NoticeStatsProps> = ({
  published,
  monthlyCreated,
  drafts,
  monthlyChange = '↑ 전월 +2',
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard
        label="게시 중 공지"
        value={published}
        change={{ type: 'neutral', text: '앱 공지사항 노출' }}
        color="purple"
      />
      <StatCard
        label="이번달 등록"
        value={monthlyCreated}
        change={{ type: 'up', text: monthlyChange }}
        color="green"
      />
      <StatCard
        label="임시저장"
        value={drafts}
        change={{ type: 'neutral', text: '미게시' }}
        color="amber"
      />
    </div>
  );
};
