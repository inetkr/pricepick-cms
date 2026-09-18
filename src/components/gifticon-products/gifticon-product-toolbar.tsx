'use client';

import React, { useState } from 'react';

// ----------------------------------------------------------------------

interface GifticonProductToolbarProps {
  onSearch: (keyword: string) => void;
  searchPlaceholder?: string;
}

// 포인츠허브 상품 목록에는 카테고리/상태 거르개가 없다 — 상품명 검색 한 칸뿐이며,
// 입력이 가로 전체를 채우고 검색 단추는 그 아래 오른쪽에 붙는다.
export const GifticonProductToolbar: React.FC<GifticonProductToolbarProps> = ({
  onSearch,
  searchPlaceholder = '상품명을 입력하세요.',
}) => {
  const [keyword, setKeyword] = useState('');

  const submit = () => onSearch(keyword.trim());

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '14px 16px',
        marginBottom: '16px',
      }}
    >
      <input
        className="search-box"
        style={{ width: '100%' }}
        placeholder={searchPlaceholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={submit}>
          검색
        </button>
      </div>
    </div>
  );
};
