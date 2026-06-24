// src/components/gifticon/GifticonCancelToolbar.tsx
import React from 'react';

interface GifticonCancelToolbarProps {
  onSearchName?: (value: string) => void;
  onSearchNickname?: (value: string) => void;
  onSearchOrder?: (value: string) => void;
  onSearchProduct?: (value: string) => void;
  onReasonChange?: (value: string) => void;
  onExport?: () => void;
}

export const GifticonCancelToolbar: React.FC<GifticonCancelToolbarProps> = ({
  onSearchName,
  onSearchNickname,
  onSearchOrder,
  onSearchProduct,
  onReasonChange,
  onExport,
}) => {
  return (
    <div className="toolbar" style={{ flexWrap: 'wrap', gap: '8px' }}>
      <input
        className="search-box"
        placeholder="이름 검색"
        onChange={(e) => onSearchName?.(e.target.value)}
        style={{ width: '110px' }}
      />
      <input
        className="search-box"
        placeholder="닉네임 검색"
        onChange={(e) => onSearchNickname?.(e.target.value)}
        style={{ width: '120px' }}
      />
      <input
        className="search-box"
        placeholder="주문번호 검색"
        onChange={(e) => onSearchOrder?.(e.target.value)}
        style={{ width: '160px' }}
      />
      <input
        className="search-box"
        placeholder="상품명 검색"
        onChange={(e) => onSearchProduct?.(e.target.value)}
        style={{ width: '140px' }}
      />
      <select className="filter-sel" onChange={(e) => onReasonChange?.(e.target.value)}>
        <option value="">전체 취소사유</option>
        <option value="admin">관리자 취소</option>
        <option value="customer">고객 요청</option>
        <option value="expire">유효기간 만료</option>
      </select>
      <button className="btn btn-primary btn-sm" onClick={() => console.log('Search')}>
        검색
      </button>
      <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={onExport}>
        CSV 내보내기
      </button>
    </div>
  );
};
