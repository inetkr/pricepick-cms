import React from 'react';
import type { IPoint, IPointTransactionType } from 'src/types/points/point';
import { maskKakaoEmail } from 'src/utils/helper';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface PointsTableProps {
  points: IPoint[];
  pagination?: PaginationProps;
}

// 유형 이름은 서버가 준 transaction_type_label 을 그대로 쓴다 — 화면은 색만 정한다
const transactionTypeColor: Partial<Record<IPointTransactionType, string>> = {
  CONVERT_FROM_TICKET: 'var(--success)',
  ADMIN_ADD: 'var(--success)',
  EXPIRED: 'var(--text-2)',
  ADMIN_SUB: 'var(--danger)',
  CONVERT_TO_TICKET: 'var(--danger)',
};

// 위 표에 없는 유형은 묶음으로 색을 정한다 — 적립은 보라, 사용·차감은 빨강
const transactionColor = (point: IPoint) =>
  transactionTypeColor[point.transaction_type] ??
  (point.group === 'USE' ? 'var(--danger)' : '#c084fc');

const transactionLabel = (point: IPoint) => point.transaction_type_label || point.transaction_type;

const MANUAL_TRANSACTION_TYPES: IPointTransactionType[] = ['ADMIN_ADD', 'ADMIN_SUB'];

const transactionReason = (point: IPoint) => point.description || '—';

// 처리자 — 서버가 처리한 관리자(employee)를 주면 그 이름(없으면 아이디), 없으면
// 수동 지급·회수는 「관리자」, 그 밖의 유형은 「자동」
const transactionHandler = (point: IPoint) => {
  if (point.employee) return point.employee.fullname || point.employee.username;
  return MANUAL_TRANSACTION_TYPES.includes(point.transaction_type) ? '관리자' : '자동';
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
            <th>사유</th>
            <th>포인트</th>
            <th>교환 후 잔액</th>
            <th>처리자</th>
            <th>일시</th>
          </tr>
        </thead>
        <tbody>
          {points.length === 0 ? (
            <tr>
              <td
                colSpan={7}
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
                    {point.kakao_info?.email ? maskKakaoEmail(point.kakao_info.email) : '-'}
                  </div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}
                  >
                    {point.identified_id ?? '-'}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: transactionColor(point) }}>{transactionLabel(point)}</span>
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    maxWidth: '240px',
                    wordBreak: 'break-word',
                    color: 'var(--text-2)',
                  }}
                >
                  {transactionReason(point)}
                </td>
                <td style={{ textAlign: 'center' }}>{renderPoints(point.amount)}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {point.balance_after.toLocaleString()}P
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {transactionHandler(point)}
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
