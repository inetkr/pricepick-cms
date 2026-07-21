import React from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { Pagination } from 'src/components/common/pagination';
import { QNA_TYPE_LABELS } from 'src/constants/qna';
import type { IQna } from 'src/types/qna';
import { InquiryStateBadge } from './inquiry-state-badge';

interface InquiryTableProps {
  inquiries: IQna[];
  isLoading?: boolean;
  pagination?: PaginationProps;
  onOpen: (inquiry: IQna) => void;
  onDelete: (inquiry: IQna) => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return { date: '-', time: '' };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: '-', time: '' };
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

export const InquiryTable: React.FC<InquiryTableProps> = ({
  inquiries,
  isLoading,
  pagination,
  onOpen,
  onDelete,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">문의 목록</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>제목</th>
          <th>작성자</th>
          <th>유형</th>
          <th>작성일</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td
              colSpan={6}
              style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
            >
              불러오는 중...
            </td>
          </tr>
        ) : inquiries.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
            >
              조건에 맞는 문의가 없습니다.
            </td>
          </tr>
        ) : (
          inquiries.map((item) => {
            const { date, time } = formatDateTime(item.created_at);
            return (
              <tr key={item.id}>
                <td>
                  <button
                    type="button"
                    onClick={() => onOpen(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--text-1)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {item.title}
                  </button>
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>
                  {item.user?.nickname ?? '-'}
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>
                  {QNA_TYPE_LABELS[item.type] ?? item.type}
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 700, color: '#333' }}>{date}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: '11px' }}>{time}</div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <InquiryStateBadge state={item.state} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onOpen(item)}
                    >
                      {item.answer ? '답변 수정' : '답변하기'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(item)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
    {pagination && <Pagination {...pagination} />}
  </div>
);
