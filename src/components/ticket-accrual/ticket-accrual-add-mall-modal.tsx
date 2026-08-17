'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components/common/modal';
import { defaultAccrualRate } from 'src/utils/ticket-accrual';

interface TicketAccrualAddMallModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, category: string, feeRate: number) => boolean;
}

export const TicketAccrualAddMallModal: React.FC<TicketAccrualAddMallModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [feeRate, setFeeRate] = useState(0);

  useEffect(() => {
    if (open) {
      setName('');
      setCategory('');
      setFeeRate(0);
    }
  }, [open]);

  const handleSubmit = () => {
    const ok = onSubmit(name, category, feeRate);
    if (ok) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="제휴몰(링크프라이스) 추가"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            추가
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label" htmlFor="ta-add-name">
            몰 이름
          </label>
          <input
            id="ta-add-name"
            className="form-input"
            type="text"
            placeholder="예: 티몬"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ta-add-category">
            카테고리
          </label>
          <input
            id="ta-add-category"
            className="form-input"
            type="text"
            placeholder="예: 종합몰"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ta-add-fee">
            수수료 % (기본 적립률 = 수수료 × 60%)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="ta-add-fee"
              className="form-input"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={feeRate}
              style={{ maxWidth: '120px' }}
              onChange={(e) => setFeeRate(Number(e.target.value))}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>
              → 적립률 {defaultAccrualRate(feeRate)}%로 시작합니다
            </span>
          </div>
        </div>
        <div className="info-box">
          추가하면 <strong>미신청 · 미적용</strong> 상태로 즉시 등록됩니다. 실제 서비스 적용 여부는
          목록에서 따로 켤 수 있습니다.
        </div>
      </div>
    </Modal>
  );
};
