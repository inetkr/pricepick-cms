import React from 'react';

interface MemberFiltersProps {
  onSearch?: (value: string) => void;
  onKakaoStatusChange: (value: string) => void;
  onAccountStatusChange: (value: string) => void;
  onMarketingChange: (value: string) => void;
}

const kakaoStatusOptions = [
  { value: '', label: '전체 연동상태' },
  { value: 'NOT_LINKED', label: '게스트(미연동)' },
  { value: 'LINKED', label: '카카오 연동' },
];

const accountStatusOptions = [
  { value: '', label: '전체 상태' },
  { value: 'NORMAL', label: '정상' },
  { value: 'BLOCK', label: '정지' },
  { value: 'DELETE', label: '탈퇴' },
];

const marketingOptions = [
  { value: '', label: '전체 마케팅' },
  { value: 'ALL', label: '전체 동의' },
  { value: 'SELECTIVE', label: '선택 동의' },
  { value: 'NONE', label: '전체 거부' },
];

export const MemberFilters: React.FC<MemberFiltersProps> = ({
  onSearch,
  onKakaoStatusChange,
  onAccountStatusChange,
  onMarketingChange,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder="닉네임 검색..."
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onKakaoStatusChange?.(e.target.value)}>
        {kakaoStatusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onAccountStatusChange?.(e.target.value)}>
        {accountStatusOptions.map((opt) => (
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
