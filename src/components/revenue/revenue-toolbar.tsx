import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

export interface RevenueFilterValues {
  search: string;
  mall: string;
}

interface RevenueToolbarProps {
  searchPlaceholder?: string;
  showMallFilter?: boolean;
  mallOptions?: Option[];
  onApplyFilters: (filters: RevenueFilterValues) => void;
}

const defaultMallOptions: Option[] = [
  { value: '', label: '전체 제휴몰' },
  { value: '쿠팡', label: '쿠팡' },
  { value: '11번가', label: '11번가' },
  { value: 'G마켓', label: 'G마켓' },
  { value: '알리익스프레스', label: '알리익스프레스' },
  { value: '아이허브', label: '아이허브' },
];

export const RevenueToolbar: React.FC<RevenueToolbarProps> = ({
  searchPlaceholder = '회원, 주문번호 검색...',
  showMallFilter = true,
  mallOptions = defaultMallOptions,
  onApplyFilters,
}) => {
  const [search, setSearch] = useState('');
  const [mall, setMall] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({ search, mall });
  };

  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
      />
      {showMallFilter && (
        <select className="filter-sel" value={mall} onChange={(e) => setMall(e.target.value)}>
          {mallOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyFilters}>
        검색
      </button>
    </div>
  );
};
