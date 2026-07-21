import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

export interface TicketFilterValues {
  search: string;
  transaction_type: string;
  // usage_status: string;
}

interface TicketFiltersProps {
  onApplyFilters: (filters: TicketFilterValues) => void;
  searchPlaceholder?: string;
  transactionTypeGroupOptions?: Option[];
  // usageStatusOptions?: Option[];
}

const transactionTypeGroupOptions: Option[] = [
  { value: '', label: '전체 거래유형' },
  { value: 'COUPANG_PURCHASE', label: '구매 적립' },
  { value: 'COUPANG_PURCHASE_PENDING', label: '구매 대기(등급 미정)' },
  { value: 'ATTENDANCE', label: '출석 보너스' },
  { value: 'LUCKY_SPIN', label: '룰렛 당첨' },
  { value: 'KAKAO_LINK', label: '카카오 연동 보상' },
  { value: 'USE_GIFTICON', label: '기프티콘 사용' },
  { value: 'USE_PRIZE_DRAW', label: '경품 응모' },
  { value: 'CONVERT_POINT', label: '포인트 전환' },
  { value: 'CONVERT_RANK', label: '등급 전환' },
  { value: 'ADMIN_ADD', label: '관리자 지급' },
  { value: 'ADMIN_SUB', label: '관리자 회수' },
  { value: 'PURCHASE_REFUND', label: '환불(취소·반품)' },
  { value: 'EXPIRED', label: '만료 소멸' },
];

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
  transactionTypeGroupOptions: transactionTypeGroupOptionsProp = transactionTypeGroupOptions,
  // usageStatusOptions: usageStatusOptionsProp = usageStatusOptions,
}) => {
  const [search, setSearch] = useState('');
  const [transactionTypeGroup, setTransactionTypeGroup] = useState('');
  // const [usageStatus, setUsageStatus] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({
      search,
      transaction_type: transactionTypeGroup,
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
        {transactionTypeGroupOptionsProp.map((opt) => (
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
