import React from 'react';

interface GifticonToolbarProps {
  onSearch?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onDateChange?: (value: string) => void;
  onExport?: () => void;
  searchPlaceholder?: string;
}

export const GifticonToolbar: React.FC<GifticonToolbarProps> = ({
  onSearch,
  onStatusChange,
  onDateChange,
  onExport,
  searchPlaceholder = '닉네임 검색',
}) => {
  return (
    <div className="toolbar" style={{ flexWrap: 'wrap', gap: '8px' }}>
      <select className="filter-sel" onChange={(e) => onStatusChange?.(e.target.value)}>
        <option value="">전체 상태</option>
        <option value="used">사용</option>
        <option value="unused">미사용</option>
        <option value="expired">만료</option>
      </select>
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        style={{ width: '120px' }}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <input
        className="search-box"
        placeholder="주문번호 검색"
        style={{ width: '150px' }}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onDateChange?.(e.target.value)}>
        <option value="">날짜 기준: 전체</option>
        <option value="purchase">구매일</option>
        <option value="status">상태변경일</option>
      </select>
      <input className="form-input" type="date" style={{ width: '130px', fontSize: '12px' }} />
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>~</span>
      <input className="form-input" type="date" style={{ width: '130px', fontSize: '12px' }} />
      <button type="button" className="btn btn-primary btn-sm" onClick={() => console.log('Search')}>
        검색
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ marginLeft: 'auto' }}
        onClick={onExport}
      >
        CSV 내보내기
      </button>
    </div>
  );
};
