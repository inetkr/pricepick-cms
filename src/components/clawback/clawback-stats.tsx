// src/components/clawback/ClawbackStats.tsx
import React from 'react';
import { StatCard } from '../common/stat-card';

interface ClawbackStatsProps {
  totalCount: number;
  totalBronze: number;
  totalSilver: number;
  totalGold: number;
  bronzeChange?: string;
  silverChange?: string;
  goldChange?: string;
  totalChange?: string;
}

export const ClawbackStats: React.FC<ClawbackStatsProps> = ({
  totalCount,
  totalBronze,
  totalSilver,
  totalGold,
  totalChange = '↑ 전월 +8건',
  bronzeChange = '이번달 누적',
  silverChange = '이번달 누적',
  goldChange = '이번달 누적',
}) => {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        label="이번달 환수 건수"
        value={totalCount}
        change={{ type: 'down', text: totalChange }}
        color="red"
      />
      <StatCard
        label="환수 티켓 (브론즈)"
        value={`${totalBronze}장`}
        change={{ type: 'down', text: bronzeChange }}
        color="amber"
      />
      <StatCard
        label="환수 티켓 (실버)"
        value={`${totalSilver}장`}
        change={{ type: 'neutral', text: silverChange }}
        color="amber"
      />
      <StatCard
        label="환수 티켓 (골드)"
        value={`${totalGold}장`}
        change={{ type: 'neutral', text: goldChange }}
      />
    </div>
  );
};
