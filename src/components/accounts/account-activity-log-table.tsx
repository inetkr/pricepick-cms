import React from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { Pagination } from 'src/components/common/pagination';
import type { IActivityLog } from 'src/types/activity_log';

interface AccountActivityLogTableProps {
  logs: IActivityLog[];
  isLoading?: boolean;
  pagination?: PaginationProps;
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

export const AccountActivityLogTable: React.FC<AccountActivityLogTableProps> = ({
  logs,
  isLoading,
  pagination,
}) => (
  <div className="card">
    <div className="card-header">
      <div>
        <div className="card-title">최근 접근 로그</div>
        <div className="card-sub">
          IP 마스킹 저장 · 보존 90일 · 정책/계정/API키 변경은 별도 강조 로깅
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>시간</th>
          <th>이름</th>
          <th>액션</th>
          <th>IP</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td
              colSpan={4}
              style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
            >
              불러오는 중...
            </td>
          </tr>
        ) : logs.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
            >
              접근 로그가 없습니다.
            </td>
          </tr>
        ) : (
          logs.map((log) => {
            const { date, time } = formatDateTime(log.created_at);
            return (
              <tr key={log.id}>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 700, color: '#333' }}>{date}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: '11px' }}>{time}</div>
                </td>
                <td>{log.fullname || log.username || '-'}</td>
                <td>{log.description}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-3)' }}>
                  {log.ip || '-'}
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
