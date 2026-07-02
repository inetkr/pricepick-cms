import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface MemberToolbarProps {
  searchPlaceholder?: string;
  typeOptions?: Option[];
  statusOptions?: Option[];
  marketingOptions?: Option[];
  onSearch?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onMarketingChange?: (value: string) => void;
  showTypeFilter?: boolean;
  showStatusFilter?: boolean;
  showMarketingFilter?: boolean;
  showExport?: boolean;
}

export const MemberToolbar: React.FC<MemberToolbarProps> = ({
  searchPlaceholder = '닉네임 검색...',
  typeOptions = [
    { value: '', label: '전체 유형' },
    { value: 'kakao', label: '카카오' },
    { value: 'apple', label: 'Apple+카카오' },
    { value: 'google', label: 'Google+카카오' },
  ],
  statusOptions = [
    { value: '', label: '전체 상태' },
    { value: 'active', label: '정상' },
    { value: 'blocked', label: '정지' },
    { value: 'withdrawn', label: '탈퇴' },
  ],
  marketingOptions = [
    { value: '', label: '전체 마케팅' },
    { value: 'all', label: '전체 동의' },
    { value: 'sel', label: '선택 동의' },
    { value: 'none', label: '전체 거부' },
  ],
  onSearch,
  onTypeChange,
  onStatusChange,
  onMarketingChange,
  showTypeFilter = true,
  showStatusFilter = true,
  showMarketingFilter = true,
  showExport = true,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      {showTypeFilter && (
        <select className="filter-sel" onChange={(e) => onTypeChange?.(e.target.value)}>
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {showStatusFilter && (
        <select className="filter-sel" onChange={(e) => onStatusChange?.(e.target.value)}>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {showMarketingFilter && (
        <select className="filter-sel" onChange={(e) => onMarketingChange?.(e.target.value)}>
          {marketingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {showExport && (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => {}}>
            내보내기
          </button>
        </div>
      )}
    </div>
  );
};
