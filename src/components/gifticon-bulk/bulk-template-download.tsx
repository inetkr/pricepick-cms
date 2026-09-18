import React from 'react';

interface BulkTemplateDownloadProps {
  onDownload?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const BulkTemplateDownload: React.FC<BulkTemplateDownloadProps> = ({
  onDownload,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={style}>
      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>템플릿 다운로드</div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onDownload}>
        샘플 CSV 다운로드
      </button>
    </div>
  );
};
