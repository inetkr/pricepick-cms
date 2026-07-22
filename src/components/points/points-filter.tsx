import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

export interface PointsFilterValues {
  search: string;
  category: string;
  days: string;
}

interface PointsFilterProps {
  onApplyFilters: (filters: PointsFilterValues) => void;
  searchPlaceholder?: string;
  categoryGroups?: OptionGroup[];
  periodOptions?: Option[];
}

const categoryGroups: OptionGroup[] = [
  {
    label: '적립',
    options: [
      { value: 'ATTENDANCE', label: '출석(쿠팡 구경하기)' },
      { value: 'FRIEND_INVITE', label: '친구초대 보상' },
      { value: 'ONBOARDING', label: '온보딩 보상' },
      { value: 'LUCKY_SPIN', label: '행운룰렛 당첨' },
      { value: 'CONVERT_FROM_TICKET', label: '티켓→포인트 전환' },
      { value: 'ADMIN_ADD', label: '관리자 지급' },
    ],
  },
  {
    label: '사용·차감',
    options: [
      { value: 'CONVERT_TO_TICKET', label: '포인트→티켓 전환' },
      { value: 'EXPIRED', label: '만료 소멸' },
      { value: 'ADMIN_SUB', label: '관리자 회수' },
    ],
  },
];

const periodOptions: Option[] = [
  { value: '', label: '전체 기간' },
  { value: '7', label: '최근 7일' },
  { value: '30', label: '최근 30일' },
  { value: '90', label: '최근 90일' },
];

export const PointsFilter: React.FC<PointsFilterProps> = ({
  onApplyFilters,
  searchPlaceholder = '닉네임, 카카오 ID 검색',
  categoryGroups: categoryGroupsProp = categoryGroups,
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
        {categoryGroupsProp.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
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
