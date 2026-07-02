'use client';

import React, { useRef, useState } from 'react';

interface BulkUploadAreaProps {
  onFileUpload?: (file: File) => void;
  accept?: string;
  maxSize?: number; // bytes
  className?: string;
}

export const BulkUploadArea: React.FC<BulkUploadAreaProps> = ({
  onFileUpload,
  accept = '.csv,.xlsx',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const {files} = e.dataTransfer;
    if (files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    setError(null);

    // Kiểm tra extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['csv', 'xlsx'].includes(ext)) {
      setError('지원하지 않는 파일 형식입니다. .csv 또는 .xlsx 파일을 업로드해주세요.');
      return;
    }

    // Kiểm tra kích thước
    if (file.size > maxSize) {
      setError(`파일 크기가 너무 큽니다. 최대 ${maxSize / 1024 / 1024}MB까지 업로드 가능합니다.`);
      return;
    }

    onFileUpload?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`bulk-upload-area ${className}`}
      style={{
        border: `2px dashed ${isDragging ? 'var(--main)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '20px',
        background: isDragging ? 'var(--main-soft)' : 'transparent',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--text-3)' }}>↑</div>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
        CSV / Excel 파일을 여기에 끌어다 놓거나
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '16px' }}>
        지원 형식: .csv, .xlsx (최대 10MB)
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        파일 선택
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      {error && (
        <div
          style={{
            marginTop: '12px',
            color: 'var(--danger)',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
