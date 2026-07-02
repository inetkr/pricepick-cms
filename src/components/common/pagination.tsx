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
  // Nếu chỉ có 1 trang hoặc 0 trang, không hiển thị
  if (totalPages <= 0) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems || 0);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
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
          disabled={currentPage === 1}
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
          disabled={currentPage === totalPages}
          onClick={handleNext}
          aria-label="Next page"
        >
          다음
        </button>
      </div>
    </div>
  );
};
