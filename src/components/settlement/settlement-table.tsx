import React from 'react';

export interface SettlementColumn<T = any> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface SettlementTableProps<T> {
  data: T[];
  columns: SettlementColumn<T>[];
  title?: string;
  totalLabel?: string;
  onExport?: () => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

export function SettlementTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  totalLabel,
  onExport,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
}: SettlementTableProps<T>) {
  return (
    <div className="card">
      <div className="card-header">
        {title && <div className="card-title">{title}</div>}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {totalLabel && (
            <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{totalLabel}</span>
          )}
          {onExport && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onExport}>
              내보내기
            </button>
          )}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  textAlign: col.align || 'center',
                  ...(col.align === 'left' ? { textAlign: 'left', paddingLeft: '18px' } : {}),
                }}
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
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => {
                  const value = item[col.key];
                  return (
                    <td
                      key={String(col.key)}
                      style={{
                        textAlign: col.align || 'center',
                        ...(col.align === 'left' ? { textAlign: 'left', paddingLeft: '18px' } : {}),
                      }}
                    >
                      {col.render ? col.render(item) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                type="button"
                key={page}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <button type="button" className="page-btn">
                ···
              </button>
              <button type="button" className="page-btn" onClick={() => onPageChange?.(totalPages)}>
                {totalPages}
              </button>
            </>
          )}
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
