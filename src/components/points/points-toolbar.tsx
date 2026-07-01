import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface PointsToolbarProps {
  onSearch?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onPeriodChange?: (value: string) => void;
  searchPlaceholder?: string;
  typeOptions?: Option[];
  periodOptions?: Option[];
}

const typeOptions: Option[] = [
  { value: '', label: '전체 유형' },
  { value: 'ATTENDANCE', label: '출석 적립' },
  { value: 'EXCHANGE', label: '티켓 교환' },
  { value: 'ADMIN_GRANT', label: '관리자 지급' },
  { value: 'USED', label: '사용 차감' },
  { value: 'EXPIRED', label: '만료 소멸' },
];

const periodOptions: Option[] = [
  { value: '', label: '전체 기간' },
  { value: '7', label: '최근 7일' },
  { value: '30', label: '최근 30일' },
  { value: '90', label: '최근 90일' },
];

export const PointsToolbar: React.FC<PointsToolbarProps> = ({
  onSearch,
  onTypeChange,
  onPeriodChange,
  searchPlaceholder = '닉네임, 카카오 ID 검색',
  typeOptions: typeOptionsProp = typeOptions,
  periodOptions: periodOptionsProp = periodOptions,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onTypeChange?.(e.target.value)}>
        {typeOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onPeriodChange?.(e.target.value)}>
        {periodOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
