import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface PointsToolbarProps {
  onSearch?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onPeriodChange?: (value: string) => void;
  onExport?: () => void;
  onManual?: () => void;
  searchPlaceholder?: string;
  typeOptions?: Option[];
  periodOptions?: Option[];
}

export const PointsToolbar: React.FC<PointsToolbarProps> = ({
  onSearch,
  onTypeChange,
  onPeriodChange,
  onExport,
  onManual,
  searchPlaceholder = '회원명, 카카오 ID 검색',
  typeOptions = [
    { value: '', label: '전체 유형' },
    { value: 'attendance', label: '출석 적립' },
    { value: 'exchange', label: '티켓 교환' },
    { value: 'admin', label: '관리자 지급' },
    { value: 'used', label: '사용 차감' },
    { value: 'expire', label: '만료 소멸' },
  ],
  periodOptions = [
    { value: '30', label: '최근 30일' },
    { value: '7', label: '최근 7일' },
    { value: '90', label: '최근 90일' },
    { value: 'custom', label: '기간 직접 입력' },
  ],
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onTypeChange?.(e.target.value)}>
        {typeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onPeriodChange?.(e.target.value)}>
        {periodOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <button className="btn btn-ghost btn-sm" onClick={onExport}>
          내보내기
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onManual}>
          수동 지급 / 회수
        </button>
      </div>
    </div>
  );
};
