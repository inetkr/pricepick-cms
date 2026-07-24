'use client';

import React from 'react';
import { Modal } from '../common/modal';
import { InfoBox } from '../stats/info-box';

interface NotificationPreviewModalProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  open,
  title,
  content,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="테스트 발송 미리보기"
    width="420px"
    footer={
      <button type="button" className="btn btn-primary" onClick={onClose}>
        확인
      </button>
    }
  >
    <div className="modal-body">
      <InfoBox style={{ marginBottom: '14px' }}>
        실제 발송 시 보이는 모습과 동일한 형태입니다. 본인 계정으로만 발송됩니다.
      </InfoBox>
      <div className="push-preview">
        <div className="push-preview-app">
          <div className="push-preview-icon">P</div>
          <div className="push-preview-appname">PricePick</div>
          <div className="push-preview-time">지금</div>
        </div>
        <div className="push-preview-title">{title || '제목'}</div>
        <div className="push-preview-body">{content || '내용'}</div>
      </div>
    </div>
  </Modal>
);
