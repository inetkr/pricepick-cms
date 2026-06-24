import React from 'react';

interface TicketToolbarProps {
  onSearch?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onAddManual?: () => void;
}

export const TicketToolbar: React.FC<TicketToolbarProps> = ({
  onSearch,
  onTypeChange,
  onStatusChange,
  onAddManual,
}) => {
  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder="회원명, UID 검색"
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onTypeChange?.(e.target.value)}>
        <option value="">전체 발행유형</option>
        <option value="purchase">구매 적립</option>
        <option value="attendance">출석 체크</option>
        <option value="ad">광고 시청</option>
        <option value="invite">친구 초대</option>
        <option value="mission">주간 미션</option>
        <option value="admin">관리자 지급</option>
      </select>
      <select className="filter-sel" onChange={(e) => onStatusChange?.(e.target.value)}>
        <option value="">전체 상태</option>
        <option value="holding">보유 중</option>
        <option value="used">사용 완료</option>
      </select>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <button className="btn btn-ghost btn-sm" onClick={onAddManual}>
          수동 지급 / 회수
        </button>
      </div>
    </div>
  );
};
