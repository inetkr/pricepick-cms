import React, { useMemo, useState } from 'react';
import type { ITicketHistoryCategory } from 'src/types/tickets/ticket';

interface Option {
  value: string;
  label: string;
}

export interface TicketFilterValues {
  search: string;
  category: string;
  // usage_status: string;
}

interface TicketFiltersProps {
  onApplyFilters: (filters: TicketFilterValues) => void;
  searchPlaceholder?: string;
  categories: ITicketHistoryCategory[];
  // usageStatusOptions?: Option[];
}

// const usageStatusOptions: Option[] = [
//   { value: '', label: '전체 상태' },
//   { value: 'HOLDING', label: '보유 중' },
//   { value: 'USED', label: '사용 완료' },
//   { value: 'PENDING', label: '가지급(대기)' },
//   { value: 'ADMIN_SUB', label: '회수' },
//   { value: 'REJECTED', label: '거절' },
// ];

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  onApplyFilters,
  searchPlaceholder = '회원명, UID 검색',
  categories,
  // usageStatusOptions: usageStatusOptionsProp = usageStatusOptions,
}) => {
  const [search, setSearch] = useState('');
  const [transactionTypeGroup, setTransactionTypeGroup] = useState('');
  // const [usageStatus, setUsageStatus] = useState('');

  const transactionTypeGroupOptions: Option[] = useMemo(
    () => [
      { value: '', label: '전체 거래유형' },
      ...categories.map((category) => ({ value: category.code, label: category.label })),
    ],
    [categories]
  );

  const handleApplyFilters = () => {
    onApplyFilters({
      search,
      category: transactionTypeGroup,
      // usage_status: usageStatus,
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
      <select
        className="filter-sel"
        value={transactionTypeGroup}
        onChange={(e) => setTransactionTypeGroup(e.target.value)}
      >
        {transactionTypeGroupOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* <select
        className="filter-sel"
        value={usageStatus}
        onChange={(e) => setUsageStatus(e.target.value)}
      >
        {usageStatusOptionsProp.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select> */}
      <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyFilters}>
        검색
      </button>
    </>
  );
};
