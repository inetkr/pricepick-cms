'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { InfoBox } from 'src/components/common/info-box';
import { BulkTemplateDownload } from 'src/components/gifticon-bulk/bulk-template-download';
import { BulkUploadArea } from 'src/components/gifticon-bulk/bulk-upload-area';
import { BulkWarningBox } from 'src/components/gifticon-bulk/bulk-warning-box';

export const GifticonBulkSection: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    toast.success(`"${file.name}" 파일이 업로드되었습니다.`);
    // TODO: Process file upload
    console.log('File uploaded:', file);
  };

  const handleTemplateDownload = () => {
    // TODO: Generate and download sample CSV
    toast.info('템플릿 다운로드 준비 중입니다.');
    console.log('Download template');
  };

  return (
    <div className="section active">
      <InfoBox>
        CSV 또는 엑셀 파일로 상품 설명을 일괄 등록·수정합니다. 상품코드가 일치하는 항목은
        덮어쓰기됩니다.
      </InfoBox>

      <div className="card">
        <div className="card-header">
          <div className="card-title">상품설명 일괄등록</div>
        </div>
        <div style={{ padding: '24px' }}>
          <BulkUploadArea onFileUpload={handleFileUpload} />

          <BulkWarningBox />

          <div style={{ marginTop: '16px' }}>
            <BulkTemplateDownload onDownload={handleTemplateDownload} />
          </div>

          {uploadedFile && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'var(--surface-2)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                📄 {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)}KB)
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.success('일괄 등록이 완료되었습니다.');
                  setUploadedFile(null);
                }}
              >
                등록하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
