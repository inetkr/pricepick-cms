import React from 'react';

interface InviteStatsProps {
  totalInvites: number;
  successInvites: number;
  conversionRate: string;
  totalPoints: string;
}

export const InviteStats: React.FC<InviteStatsProps> = ({
  totalInvites,
  successInvites,
  conversionRate,
  totalPoints,
}) => {
  return (
    <div className="invite-stat-grid">
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--main)' }}>
          {totalInvites.toLocaleString()}
        </div>
        <div className="invite-card-label">누적 초대 링크 발송</div>
      </div>
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--success)' }}>
          {successInvites.toLocaleString()}
        </div>
        <div className="invite-card-label">초대 성공 (가입 완료)</div>
      </div>
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--amber)' }}>
          {conversionRate}
        </div>
        <div className="invite-card-label">초대 전환율</div>
      </div>
      <div className="invite-card">
        <div className="invite-card-value" style={{ color: 'var(--info)' }}>
          {totalPoints}
        </div>
        <div className="invite-card-label">지급된 초대 포인트</div>
      </div>
    </div>
  );
};
