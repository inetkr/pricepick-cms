'use client';

import React from 'react';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export interface IMemberIdentitySummary {
  nickname: string | null;
  linkedKakao: boolean;
  kakaoLoginId: string | null;
}

interface MemberIdentityCellProps {
  member: IMemberIdentitySummary | null | undefined;
  userId: string;
}

// 목록 표에서 회원을 가리킬 때 쓰는 공용 3줄 표기 — 닉네임 / 카카오톡 ID(미연동이면 빈 줄) /
// 식별 아이디. 값이 없는 줄도 자리는 그대로 두어 행 높이가 줄마다 들쭉날쭉해지지 않는다.
// 식별 아이디는 길어 말줄임되므로 눌러서 통째로 복사할 수 있게 한다.
export const MemberIdentityCell: React.FC<MemberIdentityCellProps> = ({ member, userId }) => {
  const nickname = member?.nickname ?? '';
  const kakaoId = member?.linkedKakao && member?.kakaoLoginId ? member.kakaoLoginId : '';

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      toast.success('식별 아이디를 복사했습니다.');
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  return (
    <div className="idc">
      <div className="idc-nick">{nickname}</div>
      <div className="idc-sub">{kakaoId}</div>
      <div
        className="idc-uid"
        title={userId ? '눌러서 식별 아이디 전체 복사' : undefined}
        role="button"
        tabIndex={0}
        onClick={handleCopyId}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopyId(e as unknown as React.MouseEvent);
          }
        }}
      >
        {userId}
      </div>
    </div>
  );
};
