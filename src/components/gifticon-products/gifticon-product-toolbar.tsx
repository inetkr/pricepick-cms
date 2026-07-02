import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface GifticonProductToolbarProps {
  categoryOptions?: Option[];
  statusOptions?: Option[];
  onCategoryChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
}

export const GifticonProductToolbar: React.FC<GifticonProductToolbarProps> = ({
  categoryOptions = [
    { value: '', label: '전체 카테고리' },
    { value: 'coffee', label: '커피/음료' },
    { value: 'culture', label: '문화/생활' },
    { value: 'convenience', label: '편의점' },
    { value: 'dining', label: '외식' },
    { value: 'shopping', label: '쇼핑' },
  ],
  statusOptions = [
    { value: '', label: '전체 상태' },
    { value: 'active', label: '판매중' },
    { value: 'soldout', label: '품절' },
    { value: 'inactive', label: '판매중지' },
  ],
  onCategoryChange,
  onStatusChange,
  onSearch,
  searchPlaceholder = '상품명 검색',
}) => {
  return (
    <div className="toolbar" style={{ flexWrap: 'wrap', gap: '8px' }}>
      <select className="filter-sel" onChange={(e) => onCategoryChange?.(e.target.value)}>
        {categoryOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" onChange={(e) => onStatusChange?.(e.target.value)}>
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        className="search-box"
        placeholder={searchPlaceholder}
        style={{ width: '160px' }}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <button type="button" className="btn btn-primary btn-sm" onClick={() => {}}>
        검색
      </button>
    </div>
  );
};
