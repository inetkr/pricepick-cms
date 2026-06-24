import React from 'react';
import { MemberStats as MemberStatsType } from 'src/types/members/member';

interface MemberStatsProps {
  stats: MemberStatsType;
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
        ></span>
      )}
      <span style={{ color: labelColor }}>
        {label} <strong style={{ color }}>{value.toLocaleString()}명</strong>
        {percentage && percentage > 0 && ` (${percentage}%)`}
      </span>
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
          총 {stats.total.toLocaleString()}명
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
        {renderStatItem(
          '카카오 연동',
          stats.kakao,
          'var(--main)',
          'var(--text-2)',
          stats.kakaoRate,
          true
        )}
        {renderStatItem(
          '게스트(미연동)',
          stats.notLinked,
          'rgb(217, 122, 23)',
          'var(--text-2)',
          stats.notLinkedRate,
          true
        )}
        {renderStatItem(
          '마케팅 수신 동의',
          stats.marketingAgreed,
          'var(--text-2)',
          'var(--text-3)',
          stats.marketingRate,
          false
        )}
      </div>
    </div>
  );
};
