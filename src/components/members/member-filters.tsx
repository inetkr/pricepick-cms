import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface MemberFiltersProps {
  onSearch?: (value: string) => void;
  onJoinTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onMarketingChange?: (value: string) => void;
  joinTypeOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  marketingOptions?: FilterOption[];
}

const defaultJoinTypes = [
  { value: '', label: '전체 유형' },
  { value: 'kakao', label: '카카오' },
  { value: 'apple', label: 'Apple+카카오' },
  { value: 'google', label: 'Google+카카오' },
];

const defaultStatuses = [
  { value: '', label: '전체 상태' },
  { value: '정상', label: '정상' },
  { value: '정지', label: '정지' },
  { value: '탈퇴', label: '탈퇴' },
];

const defaultMarketing = [
  { value: '', label: '전체 마케팅' },
  { value: 'all', label: '전체 동의' },
  { value: 'sel', label: '선택 동의' },
  { value: 'none', label: '전체 거부' },
];

export const MemberFilters: React.FC<MemberFiltersProps> = ({
  onSearch,
  onJoinTypeChange,
  onStatusChange,
  onMarketingChange,
  joinTypeOptions = defaultJoinTypes,
  statusOptions = defaultStatuses,
  marketingOptions = defaultMarketing,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder="닉네임 검색..."
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onJoinTypeChange?.(e.target.value)}>
        {joinTypeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onStatusChange?.(e.target.value)}>
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onMarketingChange?.(e.target.value)}>
        {marketingOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
