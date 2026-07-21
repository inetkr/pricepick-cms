import React from 'react';
import { StatCard } from '../common/stat-card';
import type { IWithdrawalStat } from 'src/types/users/withdrawal_stat';

interface WithdrawalStatsProps {
  stats: IWithdrawalStat;
}

export const WithdrawalStats: React.FC<WithdrawalStatsProps> = ({ stats }) => (
  <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
    <StatCard
      label="이번달 탈퇴"
      value={`${stats.deleted_this_month.toLocaleString()}명`}
      change={{ type: 'neutral', text: '누적' }}
      color="purple"
    />
    <StatCard
      label="누적 탈퇴 회원"
      value={`${stats.deleted_total.toLocaleString()}명`}
      change={{ type: 'neutral', text: '전체' }}
      color="green"
    />
  </div>
);
