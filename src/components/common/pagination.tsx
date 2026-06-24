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

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Tạo danh sách các trang hiển thị
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Điều chỉnh nếu gần đầu hoặc cuối
    if (currentPage - start < half) {
      end = Math.min(totalPages, end + (half - (currentPage - start)));
    }
    if (end - currentPage < half) {
      start = Math.max(1, start - (half - (end - currentPage)));
    }

    // Luôn hiển thị trang đầu và cuối nếu có nhiều trang
    const showStartEllipsis = start > 2;
    const showEndEllipsis = end < totalPages - 1;

    if (showStartEllipsis) {
      pages.push(1);
      pages.push('ellipsis');
      // Thêm các trang từ start đến end
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= end; i++) {
        pages.push(i);
      }
    }

    if (showEndEllipsis) {
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

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
          className="page-btn"
          disabled={currentPage === 1}
          onClick={handlePrev}
          aria-label="Previous page"
        >
          이전
        </button>

        {/* {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <button key={`ellipsis-${index}`} className="page-btn" disabled>
                ···
              </button>
            );
          }
          return (
            <button
              key={page}
              className={`page-btn ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageClick(page as number)}
            >
              {page}
            </button>
          );
        })} */}

        {showTotal && totalItems !== undefined && (
          <span style={{ fontSize: '12px', padding: '0 8px' }}>
            {startIndex}–{endIndex} / {totalItems.toLocaleString()}
          </span>
        )}

        <button
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
