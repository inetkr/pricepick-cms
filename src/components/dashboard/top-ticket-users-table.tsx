import React from 'react';

interface UserTicket {
  rank: number;
  nickname: string;
  id: string;
  monthly: number;
  total: number;
}

interface TopTicketUsersTableProps {
  data: UserTicket[];
}

export const TopTicketUsersTable: React.FC<TopTicketUsersTableProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">티켓 적립 TOP 회원</div>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>이번달 픽구매 적립 기준</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>순위</th>
            <th>닉네임(카카오톡 ID)</th>
            <th style={{ textAlign: 'center' }}>이번달 적립</th>
            <th style={{ textAlign: 'center' }}>누적 적립</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.rank}>
              <td style={{ textAlign: 'center' }}>{item.rank}</td>
              <td>
                <div style={{ fontWeight: 500 }}>{item.nickname}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
                  ({item.id})
                </div>
              </td>
              <td style={{ textAlign: 'center', color: 'var(--success)' }}>{item.monthly}장</td>
              <td style={{ textAlign: 'center' }}>{item.total}장</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
