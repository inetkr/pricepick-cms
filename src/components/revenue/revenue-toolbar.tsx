import React from 'react';

interface RevenueToolbarProps {
  searchPlaceholder?: string;
  mallOptions?: { value: string; label: string }[];
  periodOptions?: { value: string; label: string }[];
  onSearch?: (value: string) => void;
  onMallChange?: (value: string) => void;
  onPeriodChange?: (value: string) => void;
}

export const RevenueToolbar: React.FC<RevenueToolbarProps> = ({
  searchPlaceholder = '회원, 주문번호 검색...',
  mallOptions = [
    { value: '', label: '전체 제휴몰' },
    { value: 'coupang', label: '쿠팡' },
    { value: '11st', label: '11번가' },
    { value: 'gmarket', label: 'G마켓' },
    { value: 'aliexpress', label: '알리익스프레스' },
    { value: 'iherb', label: '아이허브' },
  ],
  periodOptions = [
    { value: 'today', label: '오늘' },
    { value: 'week', label: '이번주' },
    { value: 'month', label: '이번달' },
  ],
  onSearch,
  onMallChange,
  onPeriodChange,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onMallChange?.(e.target.value)}>
        {mallOptions.map((opt) => (
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
    </div>
  );
};
