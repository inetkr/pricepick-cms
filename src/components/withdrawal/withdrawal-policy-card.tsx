'use client';

import React, { useState } from 'react';
import { WithdrawalPolicyModal } from './withdrawal-policy-modal';

export const WithdrawalPolicyCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="card-grid" style={{ marginTop: '16px' }}>
      <div className="card">
        <div className="card-header">
          <div className="card-title">탈퇴 정책 설정</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(true)}>
            안내
          </button>
        </div>
        <div>
          <div className="policy-item">
            <div className="policy-label">처리 방식</div>
            <div className="policy-value">즉시 처리 (유예·철회 없음)</div>
            <div className="policy-desc">확인 즉시 status=&apos;withdrawn&apos; 전환, 재로그인·복구 불가</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">PII 스크랩 항목</div>
            <div className="policy-value">닉네임, 카카오 닉네임, 카카오 로그인ID</div>
            <div className="policy-desc">탈퇴 즉시 제거 (레코드는 유지, 고정 정책)</div>
          </div>
          <div className="policy-item">
            <div className="policy-label">거래·정산 기록</div>
            <div className="policy-value">DB에 그대로 존치</div>
            <div className="policy-desc">PII 없이 user_id로만 연결 · 전자상거래법 5년 보존</div>
          </div>
        </div>
      </div>

      <WithdrawalPolicyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
