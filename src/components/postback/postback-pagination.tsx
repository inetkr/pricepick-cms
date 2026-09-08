import React from 'react';

interface PostbackPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// 표 아래에 붙는 「N / M 페이지 · 이전 · 다음」 줄. 한 장뿐이면 아예 안 그린다.
export const PostbackPagination: React.FC<PostbackPaginationProps> = ({
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
