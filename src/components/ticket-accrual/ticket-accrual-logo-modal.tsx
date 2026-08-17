'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components/common/modal';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';

interface TicketAccrualLogoModalProps {
  mall: IAffiliateMall | null;
  onApply: (id: string, logoUrl: string) => void;
  onClose: () => void;
}

// 여기서 "적용"을 눌러도 서버에는 아무것도 쓰지 않는다 — 목록 행의 로고만 로컬 상태로 바꿔
// 저장하지 않은 변경으로 잡히게 할 뿐, 실제 반영은 그 목록의 저장 버튼을 눌렀을 때 이뤄진다.
export const TicketAccrualLogoModal: React.FC<TicketAccrualLogoModalProps> = ({
  mall,
  onApply,
  onClose,
}) => {
  const [url, setUrl] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (mall) {
      setUrl(mall.logoUrl);
      setImgError(false);
    }
  }, [mall]);

  if (!mall) return null;

  const initial = (mall.name.trim().charAt(0) || '?').toUpperCase();
  const showImage = !!url && !imgError;

  const handleApply = () => {
    onApply(mall.id, url.trim());
    onClose();
  };

  return (
    <Modal
      open={!!mall}
      onClose={onClose}
      title="로고 등록"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => setUrl('')}>
            삭제
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn-primary" onClick={handleApply}>
            적용
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          {showImage ? (
            <img
              src={url}
              alt=""
              onError={() => setImgError(true)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                display: 'block',
                flexShrink: 0,
              }}
            />
          ) : (
            <span
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--main-soft)',
                color: 'var(--main-hover, var(--main))',
                fontSize: '20px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initial}
            </span>
          )}
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{mall.name}</div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ta-logo-url">
            로고 이미지 주소 (URL)
          </label>
          <input
            id="ta-logo-url"
            className="form-input"
            type="text"
            placeholder="https://..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setImgError(false);
            }}
          />
        </div>
        <div className="info-box">
          이미지 호스팅 서비스에 로고 파일을 올린 뒤 그 주소를 붙여넣으세요. 비워두면 몰 이름 첫
          글자 배지로 대신 표시됩니다. <strong>적용</strong>을 눌러도 이 카드 자체는 저장되지 않으며,
          목록의 저장 버튼을 눌러야 실제로 반영됩니다.
        </div>
      </div>
    </Modal>
  );
};
