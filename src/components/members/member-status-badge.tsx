import React from 'react';

type MemberStatus = '정상' | '차단' | '탈퇴';

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

export const MemberStatusBadge: React.FC<MemberStatusBadgeProps> = ({ status }) => {
  const statusMap = {
    정상: { className: 'badge-green', label: '정상' },
    차단: { className: 'badge-red', label: '차단' },
    탈퇴: { className: 'badge-gray', label: '탈퇴' },
  };

  const info = statusMap[status];
  return <span className={`badge ${info.className}`}>{info.label}</span>;
};
