import React from 'react';
import type { IDashboardRecentPurchase } from 'src/types/dashboard/dashboard';
import { merchantLabels } from './constants';

interface RecentActivityTableProps {
  data: IDashboardRecentPurchase[];
  onViewLogs?: () => void;
}

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
      <div>{`${year}/${month}/${day}`}</div>
      <div>{`${hours}:${minutes}:${seconds}`}</div>
    </>
  );
};

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ data, onViewLogs }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">최근 픽구매 현황 TOP 3</div>
        {onViewLogs && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onViewLogs}>
            포스트백 로그로
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>쇼핑몰</th>
            <th>회원</th>
            <th>구매금액</th>
            <th>적립 티켓</th>
            <th>구매일시</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-2)' }}>
                최근 구매 내역이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{merchantLabels[item.merchant_name] ?? item.merchant_name}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.user?.nickname ?? '-'}</div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}
                  >
                    {item.user?.identified_id ?? '-'}
                  </div>
                </td>
                <td>{`${(item.purchase_amount ?? 0).toLocaleString('ko-KR')}원`}</td>
                <td style={{ color: 'var(--success)' }}>{`+${item.ticket_amount ?? 0}장`}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>
                  {renderDateTime(item.purchased_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
