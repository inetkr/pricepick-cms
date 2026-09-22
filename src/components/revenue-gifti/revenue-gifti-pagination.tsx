import React from 'react';

interface RevenueGiftiPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// The "N / M 페이지 · 이전 · 다음" (page N/M · prev · next) bar under the per-order (that
// day's sales) table — the only table the server paginates, so it's the only one that
// needs paging. Renders nothing at all when there's just one page.
export const RevenueGiftiPagination: React.FC<RevenueGiftiPaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        borderTop: '1px solid var(--border)',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {page} / {totalPages} 페이지
      </span>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          이전
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};
