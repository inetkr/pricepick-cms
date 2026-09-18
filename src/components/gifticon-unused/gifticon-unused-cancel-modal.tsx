'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Modal } from 'src/components/common/modal';
import { MemberIdentityCell } from 'src/components/common/member-identity-cell';
import type { IGifticonOrder } from 'src/types/gifticons/gifticon_order';

// ----------------------------------------------------------------------

interface GifticonUnusedCancelModalProps {
  order: IGifticonOrder;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

// POST /gift/admin/orders/:id/cancel — 별도 사유 입력 없이 관리자 취소 여부만 확인한다.
export const GifticonUnusedCancelModal: React.FC<GifticonUnusedCancelModalProps> = ({
  order,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(order.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="관리자 취소"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
            닫기
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중…' : '관리자 취소'}
          </button>
        </>
      }
    >
      <div className="modal-body" style={{ textAlign: 'center' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '13px' }}>{order.productName}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
            구매일 {dayjs(order.createdAt).format('YYYY/MM/DD HH:mm:ss')} · 주문번호 {order.orderNo}
          </div>
          <MemberIdentityCell member={order.member} userId={order.userId} />
        </div>

        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '18px' }}>
          기프트콘을 관리자 취소하시겠습니까?
        </div>
      </div>
    </Modal>
  );
};
