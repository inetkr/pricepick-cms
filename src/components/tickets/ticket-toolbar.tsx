import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface TicketToolbarProps {
  onSearch?: (value: string) => void;
  onTransactionTypeGroupChange?: (value: string) => void;
  onUsageStatusChange?: (value: string) => void;
  onViewModalOpen?: () => void;
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
  { value: '', label: '전체 사용상태' },
  { value: 'USED', label: '사용 완료' },
  { value: 'PENDING', label: '가지급(대기)' },
  { value: 'HOLDING', label: '보유 중' },
  { value: 'ADMIN_SUB', label: '회수' },
  { value: 'REJECTED', label: '거절' },
];

export const TicketToolbar: React.FC<TicketToolbarProps> = ({
  onSearch,
  onTransactionTypeGroupChange,
  onUsageStatusChange,
  onViewModalOpen,
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
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }} id="ticket-hdr-actions">
        <button className="btn btn-ghost btn-sm" onClick={onViewModalOpen}>
          수동 지급 / 회수
        </button>
      </div>
    </div>
  );
};
