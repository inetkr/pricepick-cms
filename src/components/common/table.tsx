import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  emptyMessage?: string;
  pagination?: PaginationProps;
  onRowClick?: (item: T, index: number) => void;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  className = '',
  headerClassName = '',
  rowClassName = '',
  emptyMessage = '데이터가 없습니다.',
  pagination,
  onRowClick,
}: TableProps<T>) {
  const getKey = (item: T, index: number) => {
    if (keyExtractor) return keyExtractor(item, index);
    // Fallback: tìm trường 'id' hoặc dùng index
    if (item.id !== undefined) return item.id;
    if (item.uid !== undefined) return item.uid;
    if (item.orderNumber !== undefined) return item.orderNumber;
    return index;
  };

  const getRowClassName = (item: T, index: number) => {
    if (typeof rowClassName === 'function') return rowClassName(item, index);
    return rowClassName;
  };

  const renderPagination = () => {
    if (!pagination) return null;
    const { currentPage, totalPages, onPageChange, maxVisiblePages = 5 } = pagination;

    if (totalPages <= 1) return null;

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage - start < half) {
      end = Math.min(totalPages, end + (half - (currentPage - start)));
    }
    if (end - currentPage < half) {
      start = Math.max(1, start - (half - (end - currentPage)));
    }

    // Luôn hiển thị trang đầu và cuối nếu có nhiều trang
    const showStartEllipsis = start > 2;
    const showEndEllipsis = end < totalPages - 1;

    return (
      <div className="pagination">
        <button
          type="button"
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>

        {showStartEllipsis && (
          <>
            <button type="button" className="page-btn" onClick={() => onPageChange(1)}>
              1
            </button>
            <button type="button" className="page-btn" disabled>
              ···
            </button>
          </>
        )}

        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
          <button
            type="button"
            key={page}
            className={`page-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {showEndEllipsis && (
          <>
            <button type="button" className="page-btn" disabled>
              ···
            </button>
            <button type="button" className="page-btn" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <>
      <table>
        <thead className={headerClassName}>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  textAlign: col.align || 'center',
                  width: col.width,
                  ...(col.align === 'left' ? { textAlign: 'left', paddingLeft: '18px' } : {}),
                  ...(col.align === 'right' ? { textAlign: 'right', paddingRight: '18px' } : {}),
                }}
                className={col.className}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const key = getKey(item, index);
              return (
                <tr
                  key={key}
                  className={getRowClassName(item, index)}
                  onClick={() => onRowClick?.(item, index)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col) => {
                    // Nếu có render function, dùng nó
                    if (col.render) {
                      return (
                        <td
                          key={String(col.key)}
                          style={{
                            textAlign: col.align || 'center',
                            ...(col.align === 'left'
                              ? { textAlign: 'left', paddingLeft: '18px' }
                              : {}),
                            ...(col.align === 'right'
                              ? { textAlign: 'right', paddingRight: '18px' }
                              : {}),
                          }}
                          className={col.className}
                        >
                          {col.render(item, index)}
                        </td>
                      );
                    }
                    // Ngược lại lấy giá trị từ item theo key
                    const value = item[col.key as keyof T];
                    return (
                      <td
                        key={String(col.key)}
                        style={{
                          textAlign: col.align || 'center',
                          ...(col.align === 'left'
                            ? { textAlign: 'left', paddingLeft: '18px' }
                            : {}),
                          ...(col.align === 'right'
                            ? { textAlign: 'right', paddingRight: '18px' }
                            : {}),
                        }}
                        className={col.className}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {pagination && renderPagination()}
    </>
  );
}
