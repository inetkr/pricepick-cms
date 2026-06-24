import React from 'react';

type DrawStatus = '진행 중' | '완료' | '예정' | '마감';

interface DrawStatusBadgeProps {
  status: DrawStatus;
}

export const DrawStatusBadge: React.FC<DrawStatusBadgeProps> = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case '진행 중':
        return 'badge-amber';
      case '완료':
        return 'badge-green';
      case '예정':
        return 'badge-blue';
      case '마감':
        return 'badge-red';
      default:
        return 'badge-gray';
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{status}</span>;
};
