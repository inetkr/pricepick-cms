import React from 'react';

interface AccountStatusBadgeProps {
  status: boolean;
}

export const AccountStatusBadge: React.FC<AccountStatusBadgeProps> = ({ status }) => (
  <span className={`badge ${status ? 'badge-green' : 'badge-gray'}`}>
    {status ? '활성' : '비활성'}
  </span>
);
