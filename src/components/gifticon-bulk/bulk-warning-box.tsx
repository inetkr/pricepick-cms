import React from 'react';

interface BulkWarningBoxProps {
  className?: string;
}

export const BulkWarningBox: React.FC<BulkWarningBoxProps> = ({ className = '' }) => {
  return (
    <div className={`warn-box ${className}`}>
      <strong>주의:</strong> 상품코드가 일치하는 기존 데이터는 덮어쓰기됩니다. 등록 전 백업을
      권장합니다.
    </div>
  );
};
