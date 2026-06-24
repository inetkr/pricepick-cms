import React from 'react';
import { Pagination, PaginationProps } from './pagination';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  className?: string;
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
  showTotalInfo?: boolean;
  itemsPerPage?: number;
  perPageOptions?: number[];
  onPerPageChange?: (value: number) => void;
}

export function TablePaginationRowPerPage<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  className = '',
  headerClassName = '',
  rowClassName = '',
  emptyMessage = '데이터가 없습니다.',
  pagination,
  onRowClick,
  showTotalInfo = true,
  itemsPerPage = 10,
  perPageOptions = [10, 25, 50, 100],
  onPerPageChange,
}: TableProps<T>) {
  const getKey = (item: T, index: number) => {
    if (keyExtractor) return keyExtractor(item, index);
    if (item.id !== undefined) return item.id;
    if (item.uid !== undefined) return item.uid;
    if (item.orderNumber !== undefined) return item.orderNumber;
    return index;
  };

  const getRowClassName = (item: T, index: number) => {
    if (typeof rowClassName === 'function') return rowClassName(item, index);
    return rowClassName;
  };

  return (
    <div className={className}>
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

      {pagination && <Pagination {...pagination} itemsPerPage={itemsPerPage} />}
    </div>
  );
}
