import React from 'react';

interface Activity {
  mall: string;
  nickname: string;
  amount: string;
  tickets: string;
  datetime: string;
}

interface RecentActivityTableProps {
  data: Activity[];
  onViewLogs?: () => void;
}

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
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.mall}</td>
              <td>{item.nickname}</td>
              <td>{item.amount}</td>
              <td style={{ color: 'var(--success)' }}>{item.tickets}</td>
              <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{item.datetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
