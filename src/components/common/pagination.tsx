'use client';

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (size: number) => void;
  showSizeChanger?: boolean;
  showTotal?: boolean;
  maxVisiblePages?: number;
  className?: string;
  sizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  onItemsPerPageChange,
  showSizeChanger = false,
  showTotal = false,
  maxVisiblePages = 5,
  className = '',
  sizeOptions = [10, 25, 50, 100],
}) => {
  // 결과가 0건이면(검색 결과 없음 포함) 페이지 줄을 통째로 숨긴다 — 「0–0 / 0」과 막힌 이전·다음은
  // 보여 줄 게 없다. 화면마다 totalPages를 0 또는 1로 다르게 계산해도 똑같이 숨도록 totalItems로 판단한다.
  if (totalPages <= 0 || !totalItems) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const handlePrev = () => {
    if (!isPrevDisabled) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isNextDisabled) onPageChange(currentPage + 1);
  };

  return (
    <div className={`pagination-wrapper ${className}`}>
      <div className="pagination-info">
        {showSizeChanger && onItemsPerPageChange && (
          <div className="pagination-size-changer">
            <span>페이지당</span>
            <select
              className="filter-sel"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              style={{ width: '60px', padding: '4px' }}
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>행</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          type="button"
          className="page-btn"
          disabled={isPrevDisabled}
          onClick={handlePrev}
          aria-label="Previous page"
        >
          이전
        </button>

        {showTotal && totalItems !== undefined && (
          <span style={{ fontSize: '12px', padding: '0 8px' }}>
            {startIndex}–{endIndex} / {totalItems.toLocaleString()}
          </span>
        )}

        <button
          type="button"
          className="page-btn"
          disabled={isNextDisabled}
          onClick={handleNext}
          aria-label="Next page"
        >
          다음
        </button>
      </div>
    </div>
  );
};
