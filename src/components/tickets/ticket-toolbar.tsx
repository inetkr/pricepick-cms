import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface TicketToolbarProps {
  onSearch?: (value: string) => void;
  onTransactionTypeGroupChange?: (value: string) => void;
  onUsageStatusChange?: (value: string) => void;
  searchPlaceholder?: string;
  transactionTypeGroupOptions?: Option[];
  usageStatusOptions?: Option[];
}

const transactionTypeGroupOptions: Option[] = [
  { value: '', label: '전체 발행유형' },
  { value: '', label: '구매 적립' },
  { value: '', label: '출석 체크' },
  { value: '', label: '광고 시청' },
  { value: '', label: '친구 초대' },
  { value: '', label: '주간 미션' },
  { value: '', label: '관리자 지급' },
];

const usageStatusOptions: Option[] = [
  { value: '', label: '전체 사용상태' },
  { value: 'USED', label: '사용됨' },
  { value: 'UNUSED', label: '사용되지 않음' },
];

export const TicketToolbar: React.FC<TicketToolbarProps> = ({
  onSearch,
  onTransactionTypeGroupChange,
  onUsageStatusChange,
  searchPlaceholder = '닉네임, 카카오 ID 검색',
  transactionTypeGroupOptions: transactionTypeGroupOptionsProp = transactionTypeGroupOptions,
  usageStatusOptions: usageStatusOptionsProp = usageStatusOptions,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select
        className="filter-sel"
        onChange={(e) => onTransactionTypeGroupChange?.(e.target.value)}
      >
        {transactionTypeGroupOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onUsageStatusChange?.(e.target.value)}>
        {usageStatusOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
