import React, { useState } from 'react';
import type { IPointTransactionCategoryGroup } from 'src/types/points/point';

interface Option {
  value: string;
  label: string;
}

export interface PointsFilterValues {
  search: string;
  category: string;
  days: string;
}

interface PointsFilterProps {
  onApplyFilters: (filters: PointsFilterValues) => void;
  searchPlaceholder?: string;
  // /point/admin/transaction_categories 가 준 묶음 — 화면에서 따로 목록을 두지 않는다
  categoryGroups: IPointTransactionCategoryGroup[];
  periodOptions?: Option[];
}

const periodOptions: Option[] = [
  { value: '', label: '전체 기간' },
  { value: '7', label: '최근 7일' },
  { value: '30', label: '최근 30일' },
  { value: '90', label: '최근 90일' },
];

export const PointsFilter: React.FC<PointsFilterProps> = ({
  onApplyFilters,
  searchPlaceholder = '닉네임, 카카오 ID 검색',
  categoryGroups,
  periodOptions: periodOptionsProp = periodOptions,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [days, setDays] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({ search, category, days });
  };

  return (
    <>
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
      />
      <select className="filter-sel" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">전체 유형</option>
        {categoryGroups.map((group) => (
          <optgroup key={group.code} label={group.label}>
            {group.categories.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <select className="filter-sel" value={days} onChange={(e) => setDays(e.target.value)}>
        {periodOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyFilters}>
        검색
      </button>
    </>
  );
};
