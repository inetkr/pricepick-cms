import React from 'react';
import type { IPoint, IPointTransactionType } from 'src/types/points/point';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface PointsTableProps {
  points: IPoint[];
  pagination?: PaginationProps;
}

const transactionTypeConfig: Record<IPointTransactionType, { color: string; label: string }> = {
  ATTENDANCE: { color: '#c084fc', label: '출석(쿠팡 구경하기)' },
  FRIEND_INVITE: { color: '#c084fc', label: '친구초대 보상' },
  ONBOARDING: { color: '#c084fc', label: '온보딩 보상' },
  LUCKY_SPIN: { color: '#c084fc', label: '행운룰렛 당첨' },
  CONVERT_FROM_TICKET: { color: 'var(--success)', label: '티켓→포인트 전환' },
  EXPIRED: { color: 'var(--text-2)', label: '만료 소멸' },
  ADMIN_ADD: { color: 'var(--success)', label: '관리자 지급' },
  ADMIN_SUB: { color: 'var(--danger)', label: '관리자 회수' },
  CONVERT_TO_TICKET: { color: 'var(--danger)', label: '포인트→티켓 전환' },
};

const renderTransactionTypeBadge = (type: IPointTransactionType) => {
  const config = transactionTypeConfig[type] || { color: 'var(--text-2)', label: type };
  return <span style={{ color: config.color }}>{config.label}</span>;
};

const renderPoints = (amount: number) => {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  const color = isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-2)';
  const sign = isPositive ? '+' : '';
  return (
    <span style={{ color, fontWeight: 700 }}>
      {sign}
      {amount.toLocaleString()}P
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
            <th>닉네임 / 카카오톡 ID / 식별 아이디</th>
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
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    {point.kakao_id ?? '게스트(비연동)'}
                  </div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}
                  >
                    {point.identified_id}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {renderTransactionTypeBadge(point.transaction_type)}
                </td>
                <td style={{ textAlign: 'center' }}>{renderPoints(point.amount)}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {point.balance_after.toLocaleString()}P
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
