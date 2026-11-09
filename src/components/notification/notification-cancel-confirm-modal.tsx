import React from 'react';
import type { INotification } from 'src/types/notification';
import { Modal } from '../common/modal';

// 예약 건의 「취소」를 누르면 한 번 더 확인받는다 — 취소한 건은 지워지지 않고 「취소됨」으로 남는다

interface NotificationCancelConfirmModalProps {
  notification: INotification | null;
  isCancelling: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const NotificationCancelConfirmModal: React.FC<NotificationCancelConfirmModalProps> = ({
  notification,
  isCancelling,
  onClose,
  onConfirm,
}) => (
  <Modal open={!!notification} onClose={onClose} title="예약 발송 취소" width="460px">
    <div className="modal-body">
      <div className="ni-confirm-question" style={{ marginTop: 0, marginBottom: '14px' }}>
        예약 발송을 취소하시겠습니까?
      </div>
      <div className="ni-cancel-title">{notification?.title}</div>
      <div className="ni-cancel-note">
        취소한 건은 <span>「취소됨」</span>으로 남고 발송되지 않습니다.
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          취소
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={isCancelling}
          onClick={onConfirm}
        >
          {isCancelling ? '처리 중...' : '확인'}
        </button>
      </div>
    </div>
  </Modal>
);
