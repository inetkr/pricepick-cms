'use client';

import React, { useState } from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { InviteStats } from 'src/components/invites/invite-stats';
import { InviteTable } from 'src/components/invites/invite-table';

// Mock data
const mockInviteData = [
  {
    rank: 1,
    nickname: '친구초대왕',
    kakaoId: 'invite_king',
    totalInvites: 47,
    successInvites: 31,
    points: 15500,
    monthly: 8,
  },
  {
    rank: 2,
    nickname: '쇼핑왕민준',
    kakaoId: 'minjun_kakao',
    totalInvites: 23,
    successInvites: 18,
    points: 9000,
    monthly: 3,
  },
  {
    rank: 3,
    nickname: '가격헌터서연',
    kakaoId: 'seoyeon_kko',
    totalInvites: 19,
    successInvites: 12,
    points: 6000,
    monthly: 5,
  },
];

export const InviteSection: React.FC = () => {
  const [data] = useState(mockInviteData);

  return (
    <div className="section active">
      <InfoBox>
        <strong>정책 확정 반영</strong> — 친구초대 보상 = 양쪽 각 500P(포인트), 초대자 월 최대 10명.
        (이벤트 티켓 → 포인트 변경)
      </InfoBox>

      <InviteStats
        totalInvites={4821}
        successInvites={1284}
        conversionRate="26.6%"
        totalPoints="642,000P"
      />

      <InfoBox>
        <strong>친구초대 보상</strong> — 초대자·피초대자 양쪽 각 <strong>500P(포인트)</strong> ·
        성사 기준 피초대자 첫 픽구매 완료(성사 시점 양쪽 지급) · 초대자 월 최대 10명. 상세 정책은{' '}
        <strong>운영 정책 &gt; 참여·이벤트</strong> 탭 참조.
      </InfoBox>

      <InviteTable data={data} />
    </div>
  );
};
