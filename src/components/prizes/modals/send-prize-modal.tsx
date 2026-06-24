'use client';

import React, { useState } from 'react';
import { Modal } from 'src/components/common/modal';

interface SendPrizeModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: SendPrizeData) => void;
  recipientName: string;
  prizeName: string;
}

export interface SendPrizeData {
  method: 'kakao' | 'push' | 'manual';
  code?: string;
}

export const SendPrizeModal: React.FC<SendPrizeModalProps> = ({
  open,
  onClose,
  onSend,
  recipientName,
  prizeName,
}) => {
  const [method, setMethod] = useState<'kakao' | 'push' | 'manual'>('kakao');
  const [code, setCode] = useState('');
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value as any);
  };

  const handleSend = () => {
    onSend({ method, code: method === 'manual' ? code : undefined });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="경품 발송"
      width="440px"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary" onClick={handleSend}>
            발송하기
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">수신자</label>
          <input className="form-input" value={recipientName} readOnly />
        </div>

        <div className="form-group">
          <label className="form-label">경품</label>
          <input className="form-input" value={prizeName} readOnly />
        </div>

        <div className="form-group">
          <label className="form-label">발송 방법</label>
          <select className="form-select" value={method} onChange={handleMethodChange}>
            <option value="kakao">카카오 알림톡</option>
            <option value="push">앱 푸시</option>
            <option value="manual">수동 처리</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">기프티콘 코드 (수동 시)</label>
          <input className="form-input" value={code} placeholder="코드 입력" />
        </div>

        {method === 'manual' && (
          <div className="form-group">
            <label className="form-label">기프티콘 코드 (수동 시)</label>
            <input
              className="form-input"
              type="text"
              placeholder="코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
