import React from 'react';
import type { IUserStat } from 'src/types/users/user_stat';

interface MemberStatsProps {
  stats: IUserStat;
}

export const MemberStats: React.FC<MemberStatsProps> = ({ stats }) => {
  const renderStatItem = (
    label: string,
    value: number,
    color: string,
    labelColor: string,
    percentage?: number,
    dotIcon?: boolean
  ) => (
    <span>
      {dotIcon && (
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
      {percentage !== undefined && percentage > 0 ? (
        <span style={{ color: labelColor }}>
          {label}
          <strong style={{ color, paddingLeft: '4px' }}>
            {value.toLocaleString()}명 {percentage && percentage > 0 && ` (${percentage}%)`}
          </strong>
        </span>
      ) : (
        <span style={{ color: labelColor }}>
          {label}
          <strong style={{ color, paddingLeft: '4px' }} id="mem-mkt">
            운영 데이터 없음
          </strong>
        </span>
      )}
    </span>
  );

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
          총 {stats.total_users.toLocaleString()}명
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
        {renderStatItem(
          '카카오 연동',
          stats.total_kakao_linked,
          'var(--main)',
          'var(--text-2)',
          stats.total_kakao_linked / stats.total_users > 0
            ? Math.round((stats.total_kakao_linked / stats.total_users) * 100)
            : 0,
          true
        )}
        {renderStatItem(
          '게스트(미연동)',
          stats.total_kakao_not_linked,
          'rgb(217, 122, 23)',
          'var(--text-2)',
          stats.total_kakao_not_linked / stats.total_users > 0
            ? Math.round((stats.total_kakao_not_linked / stats.total_users) * 100)
            : 0,
          true
        )}
        {renderStatItem(
          '마케팅 수신 동의',
          stats.total_marketing_consent,
          'var(--text-2)',
          'var(--text-3)',
          stats.total_marketing_consent / stats.total_users > 0
            ? Math.round((stats.total_marketing_consent / stats.total_users) * 100)
            : 0,
          false
        )}
      </div>
    </div>
  );
};
