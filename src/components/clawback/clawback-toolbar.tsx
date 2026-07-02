import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface ClawbackToolbarProps {
  onSearch?: (value: string) => void;
  onGradeChange?: (value: string) => void;
  onReasonChange?: (value: string) => void;
  onPeriodChange?: (value: string) => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  gradeOptions?: Option[];
  reasonOptions?: Option[];
  periodOptions?: Option[];
  showPeriodFilter?: boolean;
}

export const ClawbackToolbar: React.FC<ClawbackToolbarProps> = ({
  onSearch,
  onGradeChange,
  onReasonChange,
  onPeriodChange,
  onExport,
  searchPlaceholder = '닉네임 또는 주문 ID 검색...',
  gradeOptions = [
    { value: '', label: '전체 등급' },
    { value: 'bronze', label: '브론즈' },
    { value: 'silver', label: '실버' },
    { value: 'gold', label: '골드' },
  ],
  reasonOptions = [
    { value: '', label: '전체 사유' },
    { value: 'cancel', label: '취소' },
    { value: 'return', label: '반품' },
    { value: 'expire', label: '만료' },
  ],
  periodOptions = [
    { value: '30', label: '최근 30일' },
    { value: '7', label: '최근 7일' },
    { value: '90', label: '최근 90일' },
    { value: 'custom', label: '기간 직접 입력' },
  ],
  showPeriodFilter = true,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onGradeChange?.(e.target.value)}>
        {gradeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onReasonChange?.(e.target.value)}>
        {reasonOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showPeriodFilter && (
        <select className="filter-sel" onChange={(e) => onPeriodChange?.(e.target.value)}>
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      <div style={{ marginLeft: 'auto' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onExport}>
          내보내기
        </button>
      </div>
    </div>
  );
};
