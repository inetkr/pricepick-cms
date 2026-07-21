'use client';

import React from 'react';
import { InfoBox } from 'src/components/common/info-box';

interface WithdrawalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalPolicyModal: React.FC<WithdrawalPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">탈퇴 정책 안내</div>
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
            <div className="policy-label">PII 스크랩 항목</div>
            <div className="policy-value">닉네임, 카카오 닉네임, 카카오 로그인ID</div>
            <div className="policy-desc">고정 정책 → 운영자가 수정할 수 없습니다.</div>
          </div>
          <InfoBox>
            탈퇴는 <b>즉시 처리</b>됩니다(유예·철회 없음). 최종 확인과 동시에 위 항목이 회원
            문서에서 제거되고, 계정은 재로그인·복구가 불가능합니다. 티켓·결제 등 거래 기록은 회원
            문서(레코드)를 그대로 참조한 채 보존됩니다(물리 삭제 없음).
          </InfoBox>
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
