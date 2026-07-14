import React from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { Pagination } from 'src/components/common/pagination';
import { DrawStatusBadge } from 'src/components/draws/draw-status-badge';
import { formatDrawPeriod, getDaysRemaining, getDrawStatus } from 'src/sections/draws/utils';
import type { IDraw } from 'src/types/draws/draw';

interface DrawTableProps {
  data: IDraw[];
  pagination?: PaginationProps;
  onProcess: (draw: IDraw) => void;
  onViewResult: (draw: IDraw) => void;
}

const renderPrizeList = (prizes: IDraw['prizes']) => (
  <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
    {prizes.map((prize) => (
      <div key={prize.rank}>
        {prize.rank} {prize.name || '미정'} ×{prize.winner_count}
      </div>
    ))}
  </div>
);

const renderWinners = (draw: IDraw) => {
  const rows = draw.winners ?? draw.prizes;
  return (
    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
      {rows.map((row) => (
        <div key={row.rank}>
          {row.rank} {row.winner_count}명
          {!draw.winners && <span style={{ color: 'var(--text-3)' }}> (예정)</span>}
        </div>
      ))}
    </div>
  );
};

const renderDeadline = (draw: IDraw) => {
  const status = getDrawStatus(draw);
  const daysLeft = getDaysRemaining(draw.end_date);
  const isUrgent = status === 'ACTIVE' && daysLeft <= 1;
  return (
    <strong style={{ color: isUrgent ? 'var(--danger)' : 'var(--text)' }}>
      {draw.end_date}
      {isUrgent && ` (${daysLeft <= 0 ? 'D-DAY' : `D-${daysLeft}`})`}
    </strong>
  );
};

const renderActions = (
  draw: IDraw,
  onProcess: (draw: IDraw) => void,
  onViewResult: (draw: IDraw) => void
) => {
  const status = getDrawStatus(draw);
  if (status === 'CLOSED') {
    return (
      <button type="button" className="btn btn-primary btn-sm" onClick={() => onProcess(draw)}>
        당첨 처리
      </button>
    );
  }
  if (status === 'COMPLETED') {
    return (
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onViewResult(draw)}>
        결과 보기
      </button>
    );
  }
  return <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>—</span>;
};

export const DrawTable: React.FC<DrawTableProps> = ({ data, pagination, onProcess, onViewResult }) => (
  <>
    <table>
      <thead>
        <tr>
          <th>회차</th>
          <th>경품 구성</th>
          <th>추첨 기간</th>
          <th>마감일</th>
          <th>참여 티켓</th>
          <th>당첨자</th>
          <th>상태</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
              등록된 추첨 회차가 없습니다.
            </td>
          </tr>
        ) : (
          data.map((draw) => (
            <tr key={draw.id}>
              <td>
                <strong>{draw.round_name}</strong>
              </td>
              <td>{renderPrizeList(draw.prizes)}</td>
              <td>{formatDrawPeriod(draw)}</td>
              <td>{renderDeadline(draw)}</td>
              <td>{draw.ticket_count.toLocaleString()}장</td>
              <td>{renderWinners(draw)}</td>
              <td>
                <DrawStatusBadge status={getDrawStatus(draw)} />
              </td>
              <td>{renderActions(draw, onProcess, onViewResult)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {pagination && <Pagination {...pagination} />}
  </>
);
