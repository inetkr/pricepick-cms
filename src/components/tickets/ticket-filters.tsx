import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

export interface TicketFilterValues {
  search: string;
  transaction_type_group: string;
  usage_status: string;
}

interface TicketFiltersProps {
  onApplyFilters: (filters: TicketFilterValues) => void;
  searchPlaceholder?: string;
  transactionTypeGroupOptions?: Option[];
  usageStatusOptions?: Option[];
}

const transactionTypeGroupOptions: Option[] = [
  { value: '', label: '전체 발행유형' },
  { value: 'COUPANG_PURCHASE', label: '구매 적립' },
  { value: 'ATTENDANCE', label: '출석 체크' },
  { value: 'AD_WATCH', label: '광고 시청' },
  { value: 'FRIEND_INVITE', label: '친구 초대' },
  { value: 'WEEKLY_TASK', label: '주간 미션' },
  { value: 'ADMIN_ADD', label: '관리자 지급' },
];

const usageStatusOptions: Option[] = [
  { value: '', label: '전체 상태' },
  // { value: 'PENDING', label: '가지급(대기)' },
  { value: 'HOLDING', label: '보유 중' },
  { value: 'USED', label: '사용 완료' },
  // { value: 'ADMIN_SUB', label: '회수' },
  // { value: 'REJECTED', label: '거절' },
];

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  onApplyFilters,
  searchPlaceholder = '회원명, UID 검색',
  transactionTypeGroupOptions: transactionTypeGroupOptionsProp = transactionTypeGroupOptions,
  usageStatusOptions: usageStatusOptionsProp = usageStatusOptions,
}) => {
  const [search, setSearch] = useState('');
  const [transactionTypeGroup, setTransactionTypeGroup] = useState('');
  const [usageStatus, setUsageStatus] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({
      search,
      transaction_type_group: transactionTypeGroup,
      usage_status: usageStatus,
    });
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
      {/* <select
        className="filter-sel"
        value={transactionTypeGroup}
        onChange={(e) => setTransactionTypeGroup(e.target.value)}
      >
        {transactionTypeGroupOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select> */}
      <select
        className="filter-sel"
        value={usageStatus}
        onChange={(e) => setUsageStatus(e.target.value)}
      >
        {usageStatusOptionsProp.map((opt) => (
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
