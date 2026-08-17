import React from 'react';
import { Modal } from 'src/components/common/modal';
import type { IAffiliateMall, IAffiliateMallApprovalStatus } from 'src/types/config/ticket_accrual_config';

const APPROVAL_LABEL: Record<IAffiliateMallApprovalStatus, string> = {
  APPROVED: '승인',
  PENDING: '승인대기',
  REJECTED: '거부',
  NOT_APPLIED: '미신청',
};

const APPROVAL_BADGE_CLASS: Record<IAffiliateMallApprovalStatus, string> = {
  APPROVED: 'badge-green',
  PENDING: 'badge-amber',
  REJECTED: 'badge-red',
  NOT_APPLIED: 'badge-gray',
};

interface TicketAccrualMallDetailModalProps {
  mall: IAffiliateMall | null;
  onClose: () => void;
}

export const TicketAccrualMallDetailModal: React.FC<TicketAccrualMallDetailModalProps> = ({
  mall,
  onClose,
}) => {
  if (!mall) return null;
  const margin = mall.feeRate - mall.accrualRate;

  return (
    <Modal open={!!mall} onClose={onClose} title={`제휴몰 정보 — ${mall.name}`} width="480px">
      <div className="modal-body">
        <div className="policy-item">
          <div className="policy-label">제휴몰명</div>
          <div className="policy-value">{mall.name}</div>
        </div>
        <div className="policy-item">
          <div className="policy-label">카테고리</div>
          <div className="policy-value">{mall.category}</div>
        </div>
        <div className="policy-item">
          <div className="policy-label">링크프라이스 상태</div>
          <div className="policy-value">
            <span className={`badge ${APPROVAL_BADGE_CLASS[mall.approvalStatus]}`}>
              {APPROVAL_LABEL[mall.approvalStatus]}
            </span>
          </div>
        </div>
        <div className="policy-item">
          <div className="policy-label">수수료</div>
          <div className="policy-value">{mall.feeRate}%</div>
        </div>
        <div className="policy-item">
          <div className="policy-label">적립률</div>
          <div className="policy-value">{mall.accrualRate}%</div>
        </div>
        <div className="policy-item">
          <div className="policy-label">마진</div>
          <div className="policy-value" style={{ color: margin < 0 ? 'var(--danger)' : 'var(--text)' }}>
            {margin.toFixed(2)}%p
          </div>
        </div>
        <div className="policy-item">
          <div className="policy-label">실서비스 적용</div>
          <div className="policy-value">
            <span className={`badge ${mall.applied ? 'badge-green' : 'badge-gray'}`}>
              {mall.applied ? '적용' : '미적용'}
            </span>
          </div>
          <div className="policy-desc">
            링크프라이스 승인과는 별개로, 실제 서비스에 반영할지 여부를 관리자가 직접 켜고 끕니다.
          </div>
        </div>
      </div>
    </Modal>
  );
};
