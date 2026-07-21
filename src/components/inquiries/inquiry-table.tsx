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
          <th style={{ textAlign: 'center' }}>유형</th>
          <th style={{ textAlign: 'center' }}>작성일</th>
          <th style={{ textAlign: 'center' }}>상태</th>
          <th style={{ textAlign: 'center' }}>관리</th>
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
            const { date } = formatDateTime(item.created_at);
            const isAnswered = item.state === 'COMPLETED';
            return (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>{item.title || '제목없음'}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.user?.nickname ?? '-'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    {item.user?.kakao_info?.nickname ?? '게스트(비연동)'}
                  </div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}
                  >
                    {item.user?.identified_id ?? '-'}
                  </div>
                </td>
                <td style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '12px' }}>
                  {QNA_TYPE_LABELS[item.type] ?? item.type}
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{date}</td>
                <td style={{ textAlign: 'center' }}>
                  <InquiryStateBadge state={item.state} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onOpen(item)}
                    >
                      {isAnswered ? '답변 수정' : '답변하기'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
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
