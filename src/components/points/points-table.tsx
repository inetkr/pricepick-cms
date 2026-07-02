import React from 'react';
import type { IPoint } from 'src/types/points/point';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface PointsTableProps {
  points: IPoint[];
  pagination?: PaginationProps;
}

const typeBadgeMap: Record<string, { color: string; label: string }> = {
  ATTENDANCE: { color: '#c084fc', label: '출석 적립' },
  EXCHANGE: { color: 'var(--main)', label: '티켓 교환' },
  ADMIN_GRANT: { color: 'var(--main)', label: '관리자 지급' },
  USED: { color: 'var(--danger)', label: '사용 차감' },
  EXPIRED: { color: 'var(--text-2)', label: '만료 소멸' },
};

const renderTypeBadge = (type: string) => {
  const config = typeBadgeMap[type] || { color: 'var(--text-2)', label: type };
  return <span style={{ color: config.color }}>{config.label}</span>;
};

const renderPoints = (points: number) => {
  const isPositive = points > 0;
  const isNegative = points < 0;
  const color = isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-2)';
  const sign = isPositive ? '+' : '';
  return (
    <span style={{ color, fontWeight: 700 }}>
      {sign}
      {points.toLocaleString()}P
    </span>
  );
};

const renderDateTime = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return (
    <>
      <div style={{ fontWeight: 700, color: '#333333' }}>{`${year}/${month}/${day}`}</div>
      <div style={{ color: 'var(--text-3)' }}>{`${hours}:${minutes}:${seconds}`}</div>
    </>
  );
};

export const PointsTable: React.FC<PointsTableProps> = ({ points, pagination }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">최근 포인트 이력</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>닉네임(카카오톡 ID)</th>
            <th>유형</th>
            <th>포인트</th>
            <th>교환 후 잔액</th>
            <th>일시</th>
          </tr>
        </thead>
        <tbody>
          {points.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}
              >
                조회된 포인트 이력이 없습니다.
              </td>
            </tr>
          ) : (
            points.map((point) => (
              <tr key={point.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{point.nickname}</div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}
                  >
                    ({point.kakao_id ?? '-'})
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{renderTypeBadge(point.type)}</td>
                <td style={{ textAlign: 'center' }}>{renderPoints(point.points)}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {point.balance.toLocaleString()}P
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {renderDateTime(point.created_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};
