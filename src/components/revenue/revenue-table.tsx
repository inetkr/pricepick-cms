// src/components/revenue/RevenueTable.tsx
import React from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { Pagination } from 'src/components/common/pagination';

interface RevenueTableProps<T> {
  title: string;
  data: T[];
  columns: { key: keyof T; label: string; render?: (item: T) => React.ReactNode }[];
  totalLabel?: string;
  pagination?: PaginationProps;
  emptyMessage?: string;
}

export function RevenueTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  totalLabel,
  pagination,
  emptyMessage = '데이터가 없습니다.',
}: RevenueTableProps<T>) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        {totalLabel && <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{totalLabel}</div>}
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ textAlign: 'center' }}>
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
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => {
                  const value = item[col.key];
                  return (
                    <td key={String(col.key)} style={{ textAlign: 'center' }}>
                      {col.render ? col.render(item) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
