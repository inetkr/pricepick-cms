// src/components/revenue/RevenueTable.tsx
import React from 'react';

export interface FeeRevenueItem {
  datetime: string;
  mall: string;
  nickname: string;
  uid: string;
  orderNumber: string;
  amount: string;
  commissionRate: string;
  commission: string;
  ticketCost: string;
  status: '정상' | '오류';
}

export interface GifticonRevenueItem {
  datetime: string;
  product: string;
  nickname: string;
  uid: string;
  exchangePrice: string;
  wholesaleCost: string;
  margin: string;
  status: '완료' | '대기';
}

interface RevenueTableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string; render?: (item: T) => React.ReactNode }[];
  totalLabel?: string;
  totalValue?: string;
}

export function RevenueTable<T extends Record<string, any>>({
  data,
  columns,
  totalLabel,
  totalValue,
}: RevenueTableProps<T>) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">제휴 수수료 매출 내역</div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
          오늘 {data.length}건 · 합 {totalValue || ''}
        </div>
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
          {data.map((item, idx) => (
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
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button type="button" className="page-btn active">
          1
        </button>
        <button type="button" className="page-btn">
          2
        </button>
        <button type="button" className="page-btn">
          ···
        </button>
        <button type="button" className="page-btn">
          ›
        </button>
      </div>
    </div>
  );
}
