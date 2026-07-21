'use client';

import React from 'react';
import type { IUser } from 'src/types/users/user';
import { formatDate } from 'src/utils/helper';

interface WithdrawalDetailModalProps {
  isOpen: boolean;
  member: IUser | null;
  onClose: () => void;
}

const formatDateTime = (date: string | null) => {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
    d.getSeconds()
  ).padStart(2, '0')}`;
  return `${formatDate(date, 'YYYY/MM/DD')} ${time}`;
};

export const WithdrawalDetailModal: React.FC<WithdrawalDetailModalProps> = ({
  isOpen,
  member,
  onClose,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">탈퇴 회원 상세</div>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="policy-item">
            <div className="policy-label">식별 아이디</div>
            <div className="policy-value">{member.identified_id}</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">가입 유형(탈퇴 전)</div>
            <div className="policy-value">{member.kakao_id ? '카카오 연동' : '게스트'}</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">탈퇴일시</div>
            <div className="policy-value">{formatDateTime(member.deleted_at)}</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">상태</div>
            <div className="policy-value">탈퇴 완료 (즉시 처리 · 유예 없음)</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">PII 처리</div>
            <div className="policy-value">닉네임·카카오 식별값 스크랩됨</div>
            <div className="policy-desc">레코드는 유지, 거래 기록 참조 무결성 보호</div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
