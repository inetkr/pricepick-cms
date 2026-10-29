import React from 'react';
import type { IUserStat } from 'src/types/users/user_stat';

interface MemberStatsProps {
  stats: IUserStat;
}

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  labelColor?: string;
  // 비율의 분모 — 없으면 비율을 적지 않는다
  total?: number;
  dot?: boolean;
}

// 비율은 소수 첫째 자리까지 (예: 41 / 160 → 25.6%)
const formatPercent = (value: number, total: number) =>
  `${Math.round((value / total) * 1000) / 10}%`;

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  color,
  labelColor = 'var(--text-2)',
  total,
  dot = true,
}) => (
  <span style={{ whiteSpace: 'nowrap' }}>
    {dot && (
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
          marginRight: '5px',
          verticalAlign: 'middle',
        }}
      />
    )}
    <span style={{ color: labelColor }}>
      {label}
      <strong style={{ color, paddingLeft: '4px' }}>
        {value.toLocaleString()}명
        {total ? ` (${formatPercent(value, total)})` : ''}
      </strong>
    </span>
  </span>
);

// 회원 목록 머리 — 총 인원과 연동·상태별 인원은 모두 정상 회원(total_normal_users) 기준이다
export const MemberStats: React.FC<MemberStatsProps> = ({ stats }) => {
  const total = stats.total_normal_users;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        padding: '0 2px',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 700 }}>
        회원 목록{' '}
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>
          총 {total.toLocaleString()}명
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
        <StatItem
          label="카카오 연동"
          value={stats.total_kakao_linked}
          color="var(--main)"
          total={total}
        />
        <StatItem
          label="게스트(미연동)"
          value={stats.total_kakao_not_linked}
          color="rgb(217, 122, 23)"
          total={total}
        />
        <StatItem label="정상" value={stats.total_normal_users} color="var(--success)" />
        <StatItem label="차단" value={stats.total_blocked_users} color="var(--danger)" />
        <StatItem label="탈퇴" value={stats.total_deleted_users} color="var(--text-3)" />
        <StatItem
          label="마케팅 수신 동의"
          value={stats.total_marketing_consent}
          color="var(--text)"
          labelColor="var(--text-3)"
          total={total}
          dot={false}
        />
      </div>
    </div>
  );
};
