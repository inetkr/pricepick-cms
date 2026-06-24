'use client';

import React, { useState } from 'react';

interface MemberActionsProps {
  memberId: number;
  status: '정상' | '정지' | '탈퇴';
  onViewDetail: (id: number) => void;
  onStatusChange: (id: number, newStatus: '정상' | '정지' | '탈퇴') => void;
  isSuperAdmin?: boolean;
}

export const MemberActions: React.FC<MemberActionsProps> = ({
  memberId,
  status,
  onViewDetail,
  onStatusChange,
  isSuperAdmin = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusToggle = async () => {
    if (status === '탈퇴') return;
    const newStatus = status === '정상' ? '정지' : '정상';
    const confirmMessage =
      newStatus === '정지'
        ? '이 회원을 정지 처리하시겠습니까?'
        : '이 회원의 정지를 해제하시겠습니까?';

    if (!window.confirm(confirmMessage)) return;

    setIsLoading(true);
    try {
      // TODO: Call API
      await new Promise((resolve) => setTimeout(resolve, 500));
      onStatusChange(memberId, newStatus);
      (window as any).toast?.(`회원이 ${newStatus === '정지' ? '정지' : '활성화'}되었습니다.`);
    } catch (error) {
      (window as any).toast?.('처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onViewDetail(memberId)}
        disabled={isLoading}
      >
        상세
      </button>
    </div>
  );
};
