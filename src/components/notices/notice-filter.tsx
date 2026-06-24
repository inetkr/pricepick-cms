import React from 'react';

interface NoticeFilterProps {
  onSearch?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const NoticeFilter: React.FC<NoticeFilterProps> = ({
  onSearch,
  onCategoryChange,
  onStatusChange,
  searchPlaceholder = '제목 또는 내용 검색...',
}) => {
  return (
    <div className="toolbar" style={{ flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        style={{ flex: 1, minWidth: '200px' }}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select className="filter-sel" onChange={(e) => onCategoryChange?.(e.target.value)}>
        <option value="">전체 분류</option>
        <option value="general">일반</option>
        <option value="maintenance">서비스 점검</option>
        <option value="update">업데이트</option>
        <option value="policy">정책 변경</option>
        <option value="event">이벤트</option>
      </select>
      <select className="filter-sel" onChange={(e) => onStatusChange?.(e.target.value)}>
        <option value="">전체 상태</option>
        <option value="published">노출</option>
        <option value="draft">숨김</option>
      </select>
    </div>
  );
};
