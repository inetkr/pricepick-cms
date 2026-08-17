'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'src/components/common/modal';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';

interface TicketAccrualLogoModalProps {
  mall: IAffiliateMall | null;
  onApply: (id: string, logoUrl: string) => void;
  onClose: () => void;
}

const LOGO_MAX_DIM = 128;
const LOGO_MAX_SRC_BYTES = 8 * 1024 * 1024;
const LOGO_ALLOWED_TYPES = new Set(['image/png', 'image/jpeg']);

type UploadTone = 'neutral' | 'warning' | 'error';
const UPLOAD_TONE_COLOR: Record<UploadTone, string> = {
  neutral: 'var(--text-3)',
  warning: 'var(--warning)',
  error: 'var(--danger)',
};

// 파일을 128×128 이내로 축소한 data URL로 바꾼다 — 정사각형이 아니어도 막지 않고 경고만 준다
// (등록 자체를 차단하면 로고가 비정사각형인 몰을 아예 등록할 수 없게 되므로).
const processLogoFile = (file: File): Promise<{ dataUrl: string; square: boolean }> =>
  new Promise((resolve, reject) => {
    if (!LOGO_ALLOWED_TYPES.has(file.type)) {
      reject(new Error('PNG 또는 JPG 파일만 올릴 수 있습니다.'));
      return;
    }
    if (file.size > LOGO_MAX_SRC_BYTES) {
      reject(new Error('파일이 너무 큽니다 — 8MB 이내로 올려주세요.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 열 수 없습니다.'));
      img.onload = () => {
        const w = img.naturalWidth || 1;
        const h = img.naturalHeight || 1;
        const scale = Math.min(1, LOGO_MAX_DIM / Math.max(w, h));
        const cw = Math.max(1, Math.round(w * scale));
        const ch = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('이미지를 처리할 수 없습니다.'));
          return;
        }
        ctx.drawImage(img, 0, 0, cw, ch);
        resolve({ dataUrl: canvas.toDataURL(file.type), square: w === h });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

// 여기서 "적용"을 눌러도 서버에는 아무것도 쓰지 않는다 — 목록 행의 로고만 로컬 상태로 바꿔
// 저장하지 않은 변경으로 잡히게 할 뿐, 실제 반영은 그 목록의 저장 버튼을 눌렀을 때 이뤄진다.
// 로고는 파일 업로드(→ data URL) 또는 이미지 URL 둘 중 하나로 설정하며, 서로 배타적이다 —
// 한쪽을 채우면 다른 쪽은 비운다(같은 이유로 mall.logoUrl이 data: 로 시작하면 업로드 값으로 취급).
export const TicketAccrualLogoModal: React.FC<TicketAccrualLogoModalProps> = ({
  mall,
  onApply,
  onClose,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [pendingUpload, setPendingUpload] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ text: string; tone: UploadTone } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mall) {
      const isUpload = mall.logoUrl.startsWith('data:');
      setUrlInput(isUpload ? '' : mall.logoUrl);
      setPendingUpload(isUpload ? mall.logoUrl : '');
      setUploadStatus(isUpload ? { text: '지금 파일이 등록돼 있습니다.', tone: 'neutral' } : null);
      setImgError(false);
      setDragOver(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [mall]);

  if (!mall) return null;

  const previewSrc = pendingUpload || urlInput;
  const initial = (mall.name.trim().charAt(0) || '?').toUpperCase();
  const showImage = !!previewSrc && !imgError;

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    setUploadStatus({ text: '처리 중…', tone: 'neutral' });
    processLogoFile(file)
      .then(({ dataUrl, square }) => {
        setPendingUpload(dataUrl);
        setUrlInput('');
        setImgError(false);
        const kb = Math.round((dataUrl.length * 0.75) / 1024);
        setUploadStatus(
          square
            ? {
                text: `업로드됨(약 ${kb.toLocaleString()}KB) · 적용을 눌러 반영하세요.`,
                tone: 'neutral',
              }
            : {
                text: `정사각형이 아닙니다 — 그대로 적용할 수 있습니다(약 ${kb.toLocaleString()}KB). 적용을 눌러 반영하세요.`,
                tone: 'warning',
              }
        );
      })
      .catch((err: Error) => {
        setUploadStatus({ text: err.message, tone: 'error' });
      });
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    setPendingUpload('');
    setUploadStatus(null);
    setImgError(false);
  };

  const handleClear = () => {
    setUrlInput('');
    setPendingUpload('');
    setUploadStatus(null);
    setImgError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApply = () => {
    onApply(mall.id, previewSrc.trim());
    onClose();
  };

  return (
    <Modal
      open={!!mall}
      onClose={onClose}
      title="로고 등록"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
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
              src={previewSrc}
              alt=""
              onError={() => setImgError(true)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                objectFit: 'contain',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                display: 'block',
                flexShrink: 0,
              }}
            />
          ) : (
            <span
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                background: 'var(--main-soft)',
                color: 'var(--main-hover, var(--main))',
                fontSize: '24px',
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
          <label className="form-label" htmlFor="ta-logo-file">
            로고 파일 업로드
          </label>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              border: `1.5px dashed ${dragOver || hover ? 'var(--main)' : 'var(--border)'}`,
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--text-2)',
              cursor: 'pointer',
              background: dragOver || hover ? 'var(--main-soft)' : 'transparent',
              transition: 'border-color .15s, background-color .15s',
            }}
          >
            <input
              ref={fileInputRef}
              id="ta-logo-file"
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span>파일 선택 또는 여기에 끌어다 놓기</span>
          </div>
          <div className="form-hint">128×128 정사각형 · PNG 또는 JPG</div>
          {uploadStatus && (
            <div className="form-hint" style={{ color: UPLOAD_TONE_COLOR[uploadStatus.tone] }}>
              {uploadStatus.text}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ta-logo-url">
            또는 이미지 주소 (URL)
          </label>
          <input
            id="ta-logo-url"
            className="form-input"
            type="text"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>

        <div className="info-box">
          로고 파일을 올리거나 이미지 주소를 입력하세요. 비워두면 몰 이름 첫 글자 배지로 대신
          표시됩니다. <strong>적용</strong>을 눌러도 이 카드 자체는 저장되지 않으며, 목록의 저장
          버튼을 눌러야 실제로 반영됩니다.
        </div>
      </div>
    </Modal>
  );
};
