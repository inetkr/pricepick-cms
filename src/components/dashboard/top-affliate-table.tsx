import React from 'react';

interface Affiliate {
  rank: number;
  name: string;
  clicks: number;
  conversions: number;
}

interface TopAffiliatesTableProps {
  data: Affiliate[];
}

export const TopAffiliatesTable: React.FC<TopAffiliatesTableProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">인기 제휴몰 TOP 5</div>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>이번달 클릭·전환 기준</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>순위</th>
            <th>제휴몰</th>
            <th style={{ textAlign: 'center' }}>클릭 수</th>
            <th style={{ textAlign: 'center' }}>구매 전환</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.rank}>
              <td style={{ textAlign: 'center' }}>{item.rank}</td>
              <td style={{ fontWeight: 600 }}>{item.name}</td>
              <td style={{ textAlign: 'center' }}>{item.clicks.toLocaleString()}</td>
              <td style={{ textAlign: 'center', color: 'var(--success)' }}>
                {item.conversions.toLocaleString()}건
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
