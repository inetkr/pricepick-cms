import React from 'react';
import type { IQnaStats } from 'src/types/qna';
import { StatCard } from '../common/stat-card';

interface InquiryStatsProps {
  stats: IQnaStats;
  isLoading?: boolean;
}

export const InquiryStats: React.FC<InquiryStatsProps> = ({ stats, isLoading = false }) => {
  const diff = stats.completed_diff_vs_yesterday || 0;
  const diffType: 'up' | 'down' | 'neutral' = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
  const diffText = diff === 0 ? '전일과 동일' : `전일 대비 ${diff > 0 ? '+' : ''}${diff}건`;
  const avgHours = Number(stats.avg_response_hours_this_month || 0);

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        label="미처리"
        value={isLoading ? '—' : `${stats.pending.toLocaleString()}건`}
        change={{ type: 'down', text: '빠른 처리 필요' }}
        color="red"
      />
      <StatCard
        label="처리 중"
        value={isLoading ? '—' : `${stats.processing.toLocaleString()}건`}
        change={{ type: 'neutral', text: '답변 대기' }}
        color="amber"
      />
      <StatCard
        label="오늘 완료"
        value={isLoading ? '—' : `${stats.completed_today.toLocaleString()}건`}
        change={{ type: diffType, text: diffText }}
        color="green"
      />
      <StatCard
        label="평균 응답 시간"
        value={isLoading ? '—' : `${avgHours.toFixed(1)}시간`}
        change={{ type: 'neutral', text: '이번 달 기준' }}
        color="purple"
      />
    </div>
  );
};
