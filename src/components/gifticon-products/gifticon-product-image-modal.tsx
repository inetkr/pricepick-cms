'use client';

import React, { useRef, useState } from 'react';
import { Modal } from 'src/components/common/modal';

// ----------------------------------------------------------------------

interface GifticonProductImageModalProps {
  productLabel: string;
  currentImageUrl: string;
  onClose: () => void;
  // 실제 업로드는 상세 정보 모달의 저장을 눌렀을 때 한 번에 일어난다 — 여기서는 파일을
  // 고르고 로컬 미리보기만 보여준다.
  onSave: (file: File, previewUrl: string) => void;
}

export const GifticonProductImageModal: React.FC<GifticonProductImageModalProps> = ({
  productLabel,
  currentImageUrl,
  onClose,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewError(false);
  };

  const showPreview = !!previewUrl.trim() && !previewError;

  return (
    <Modal
      open
      onClose={onClose}
      title="상품 이미지"
      width="440px"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selectedFile}
            onClick={() => selectedFile && onSave(selectedFile, previewUrl)}
          >
            적용
          </button>
        </>
      }
    >
      <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>상품명</div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{productLabel}</div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>
            미리보기
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openFilePicker();
              }
            }}
            style={{
              width: '160px',
              height: '160px',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--r-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '6px',
              background: 'var(--surface-2)',
              cursor: 'pointer',
            }}
          >
            {showPreview ? (
              <img
                src={previewUrl}
                alt=""
                onError={() => setPreviewError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>눌러서 이미지 선택</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginTop: '10px' }}
            onClick={openFilePicker}
          >
            파일 선택
          </button>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>
            적용 후 상세 정보의 저장을 눌러야 실제로 업로드됩니다.
          </div>
        </div>
      </div>
    </Modal>
  );
};
