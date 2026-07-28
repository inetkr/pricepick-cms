'use client';

import React from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { InviteStats } from 'src/components/invites/invite-stats';
import { InviteTable } from 'src/components/invites/invite-table';
import { useInvites } from 'src/sections/invites/hooks/use-invites';

export const InviteSection: React.FC = () => {
  const { ranking, stats, isLoading } = useInvites();

  return (
    <div className="section active">
      <InfoBox>
        <strong>정책 확정 반영</strong> — 친구초대 보상 = 양쪽 각 500P(포인트), 초대자 월 최대 10명.
        (이벤트 티켓 → 포인트 변경)
      </InfoBox>

      <InviteStats stats={stats} />

      <InfoBox>
        <strong>친구초대 보상</strong> — 초대자·피초대자 양쪽 각 <strong>500P(포인트)</strong> ·
        성사 기준 피초대자 첫 픽구매 완료(성사 시점 양쪽 지급) · 초대자 월 최대 10명. 상세 정책은{' '}
        <strong>운영 정책 &gt; 참여·이벤트</strong> 탭 참조.
      </InfoBox>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <InviteTable data={ranking} />
      )}
    </div>
  );
};
