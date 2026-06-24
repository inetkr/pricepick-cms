'use client';

import React, { useState } from 'react';

interface TicketEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (qty: number) => void;
  productName: string;
  price: number;
  grade: 'bronze' | 'silver' | 'gold';
  autoQty: number;
  currentQty: number;
}

export const TicketEditModal: React.FC<TicketEditModalProps> = ({
  open,
  onClose,
  onSave,
  productName,
  price,
  grade,
  autoQty,
  currentQty,
}) => {
  const [qty, setQty] = useState(currentQty || autoQty);

  if (!open) return null;

  const handleSave = () => {
    onSave(qty);
    onClose();
  };

  const gradeLabels = {
    bronze: '브론즈',
    silver: '실버',
    gold: '골드',
  };

  const isManual = qty !== autoQty;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: '440px' }}>
        <div className="modal-header">
          <div className="modal-title">교환 티켓 수정</div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div
          className="modal-body"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>
              상품명
            </div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{productName}</div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>
                판매 가격
              </div>
              <div style={{ fontWeight: 600 }}>{price.toLocaleString()}원</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>
                등급
              </div>
              <div>
                <span className={`tk-chip ${grade} bare`}>{gradeLabels[grade]}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'var(--bg-2)',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-2)',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              자동 계산 공식
            </div>
            <div
              style={{
                fontSize: '13px',
                fontFamily: 'monospace',
                color: 'var(--text-1)',
                lineHeight: '1.6',
              }}
            >
              {price.toLocaleString()}원 × 1.1 = {(price * 1.1).toLocaleString()}원 ÷{' '}
              {grade === 'bronze' ? '100' : grade === 'silver' ? '1000' : '2000'}원(
              {gradeLabels[grade]}) ={' '}
              {(
                (price * 1.1) /
                (grade === 'bronze' ? 100 : grade === 'silver' ? 1000 : 2000)
              ).toFixed(2)}{' '}
              → 올림 {autoQty}장
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: '12px',
                color: 'var(--text-2)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              교환 티켓 수량
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                min={1}
                max={999}
                style={{
                  width: '100px',
                  padding: '8px 10px',
                  border: '1.5px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textAlign: 'center',
                  background: 'var(--bg)',
                  color: 'var(--text-1)',
                }}
              />
              {isManual && (
                <span
                  style={{
                    fontSize: '11px',
                    background: '#FEF3C7',
                    color: '#92400E',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: 600,
                  }}
                >
                  자동값과 다름
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '5px' }}>
              자동 계산값: {autoQty}장
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
