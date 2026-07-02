'use client';

import React, { useState } from 'react';
import type { IAccountStatus } from 'src/types/common';

interface MemberActionsProps {
  memberId: string;
  status: IAccountStatus;
  onViewDetail: (id: string) => void;
  onStatusChange: (id: string, newStatus: IAccountStatus) => void;
  isSuperAdmin?: boolean;
}

export const MemberActions: React.FC<MemberActionsProps> = ({
  memberId,
  status,
  onViewDetail,
  onStatusChange,
  isSuperAdmin = true,
}) => {
  const [isLoading] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onViewDetail(memberId)}
        disabled={isLoading}
      >
        상세
      </button>
    </div>
  );
};
