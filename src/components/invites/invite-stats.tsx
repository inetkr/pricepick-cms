import React from 'react';
import type { IInviteStat } from 'src/types/invites/invite_stat';

interface InviteStatsProps {
  stats: IInviteStat;
}

export const InviteStats: React.FC<InviteStatsProps> = ({ stats }) => {
  return (
    <div className="invite-stat-grid">
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--main)' }}>
          {stats.total_referrals.toLocaleString()}
        </div>
        <div className="invite-card-label">가입 인원 (초대코드 등록)</div>
      </div>
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--success)' }}>
          {stats.total_completed.toLocaleString()}
        </div>
        <div className="invite-card-label">첫 구매 성사 인원</div>
      </div>
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--amber)' }}>
          {stats.conversion_rate.toFixed(1)}%
        </div>
        <div className="invite-card-label">초대 전환율</div>
      </div>
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--info)' }}>
          {stats.total_points_granted.toLocaleString()}P
        </div>
        <div className="invite-card-label">지급된 초대 포인트</div>
      </div>
    </div>
  );
};
