import React from 'react';
import type { ILuckySpinLog, ILuckySpinLogStatus } from 'src/types/tickets/roulette';
import { getLuckySpinPrizeMeta } from 'src/utils/roulette';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface RouletteLogTableProps {
  tableId: string;
  rouletteTypeLabel: string;
  logs: ILuckySpinLog[];
  isLoading?: boolean;
  pagination?: PaginationProps;
}

const STATUS_BADGE: Record<ILuckySpinLogStatus, { className: string; label: string }> = {
  GRANTED: { className: 'badge badge-green', label: '지급완료' },
  NOT_APPLICABLE: { className: 'badge badge-gray', label: '해당없음' },
};

const renderDateTime = (iso: string) => {
  const d = new Date(iso);
  const date = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return (
    <>
      <div style={{ fontWeight: 700, color: '#333333' }}>{date}</div>
      <div style={{ color: 'var(--text-3)' }}>{time}</div>
    </>
  );
};

export const RouletteLogTable: React.FC<RouletteLogTableProps> = ({
  tableId,
  rouletteTypeLabel,
  logs,
  isLoading,
  pagination,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">룰렛 실행 로그</div>
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {(pagination?.totalItems ?? logs.length).toLocaleString()}건
      </span>
    </div>
    <table id={tableId}>
      <thead>
        <tr>
          <th style={{ width: '150px' }}>일시</th>
          <th>닉네임 / 카카오톡 ID</th>
          <th style={{ width: '150px' }}>룰렛 종류</th>
          <th style={{ width: '170px' }}>결과</th>
          <th style={{ width: '110px' }}>지급 상태</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
              불러오는 중...
            </td>
          </tr>
        ) : logs.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
              실행 로그가 없습니다.
            </td>
          </tr>
        ) : (
          logs.map((log) => {
            const isMiss = log.prize_type === 'NO_WIN';
            const meta = getLuckySpinPrizeMeta(log.prize_type);
            return (
              <tr key={log.id}>
                <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {renderDateTime(log.created_at)}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{log.nickname ?? '알 수 없음'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    {log.kakao_id ?? '카카오 미연동'}
                  </div>
                </td>
                <td style={{ color: 'var(--text-2)' }}>{rouletteTypeLabel}</td>
                <td>
                  {isMiss ? (
                    <span style={{ color: 'var(--text-3)' }}>꽝</span>
                  ) : (
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                      {meta.label} {log.granted_amount}
                      {meta.unit}
                    </span>
                  )}
                </td>
                <td>
                  <span className={STATUS_BADGE[log.status].className}>
                    {STATUS_BADGE[log.status].label}
                  </span>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
    {pagination && pagination.totalItems > 0 && (
      <div style={{ padding: '0 18px 14px' }}>
        <Pagination {...pagination} />
      </div>
    )}
  </div>
);
