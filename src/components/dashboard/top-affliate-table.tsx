import React from 'react';
import type { IDashboardTopMerchant } from 'src/types/dashboard/dashboard';
import { merchantLabels } from './constants';

interface TopAffiliatesTableProps {
  data: IDashboardTopMerchant[];
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
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-2)' }}>
                제휴몰 데이터가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.rank}>
                <td style={{ textAlign: 'center' }}>{item.rank}</td>
                <td style={{ fontWeight: 600 }}>
                  {merchantLabels[item.merchant_name] ?? item.merchant_name}
                </td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center', color: 'var(--success)' }}>
                  {(item.order_count ?? 0).toLocaleString('ko-KR')}건
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
