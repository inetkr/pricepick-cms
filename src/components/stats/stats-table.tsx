import React from 'react';

export interface StatsTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface StatsTableProps {
  title: string;
  subtitle?: string;
  columns: StatsTableColumn[];
  data: any[];
  totalRow?: any; // nếu có hàng tổng
  className?: string;
}

export const StatsTable: React.FC<StatsTableProps> = ({
  title,
  subtitle,
  columns,
  data,
  totalRow,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">{title}</div>
        {subtitle && <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{subtitle}</span>}
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align || 'left' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(value, row) : value}
                  </td>
                );
              })}
            </tr>
          ))}
          {totalRow && (
            <tr style={{ borderTop: '2px solid var(--border)' }}>
              {columns.map((col) => {
                const value = totalRow[col.key];
                return (
                  <td key={col.key} style={{ textAlign: col.align || 'left', fontWeight: 700 }}>
                    {col.render ? col.render(value, totalRow) : value}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
