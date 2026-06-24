'use client';

import React from 'react';
import { DataSourceBar } from 'src/components/common/data-source-bar';
import { InfoBox } from 'src/components/common/info-box';
import { StatsTable } from 'src/components/stats/stats-table';
import { NetProfitSummary } from 'src/components/stats/net-profit-summary';

// Dữ liệu mock
const commissionData = [
  { mall: '쿠팡', gmv: '93,300,000원', rate: '3.0%', revenue: '2,800,000원' },
  { mall: '11번가', gmv: '17,100,000원', rate: '3.5%', revenue: '600,000원' },
  { mall: 'G마켓', gmv: '13,300,000원', rate: '3.0%', revenue: '400,000원' },
  { mall: '알리익스프레스', gmv: '6,000,000원', rate: '5.0%', revenue: '300,000원' },
  { mall: '아이허브', gmv: '2,000,000원', rate: '5.0%', revenue: '100,000원' },
];

const gifticonData = [
  { label: '교환 기프티콘 환산가치', amount: '1,000,000원', sub: '(유저 티켓 소진)' },
  { label: '기프티콘 매입원가', amount: '− 800,000원', sub: '(도매)' },
];

const ticketCostData = [
  { grade: '브론즈', quantity: '8,400장', unit: '100원', cost: '840,000원' },
  { grade: '실버', quantity: '420장', unit: '1,000원', cost: '420,000원' },
  { grade: '골드', quantity: '70장', unit: '2,000원', cost: '140,000원' },
];

const profitItems = [
  { label: '제휴 수수료 매출', amount: '+ 4,200,000원', color: 'success' as const },
  { label: '기프티콘 판매 수익', amount: '+ 200,000원', color: 'success' as const },
  { label: '티켓 적립 비용', amount: '− 1,400,000원', color: 'amber' as const },
];

export const StatsSection: React.FC = () => {
  return (
    <div className="section active">
      {/* Data Source */}
      <DataSourceBar
        tags={[
          { label: '우리 DB 집계 · clicks, orders, tickets, gifticons 테이블', type: 'calc' },
          { label: '제휴몰 정산 API · 수수료 (D+30 확정)', type: 'coupang' },
        ]}
      />

      {/* Info Box */}
      <InfoBox type="info">
        <strong>수익 구조</strong> — 수익원은 둘입니다. ① <strong>제휴 수수료</strong>(회원이
        제휴몰에서 구매할 때 발생) ② <strong>기프티콘 판매 수익</strong>(회원이 티켓을 기프티콘으로
        교환할 때 발생하는 마진). 두 수익에서 회원에게 적립해준 티켓의 환산가치(적립 비용)를 차감한
        것이 <strong>순수익</strong>입니다. 정산은 제휴몰별 D+30 확정.
      </InfoBox>

      {/* Row 1: Commission + Gifticon */}
      <div className="card-grid">
        <StatsTable
          title="매출 구조 — 제휴몰별 수수료"
          subtitle="이번달 · 수수료율은 제휴몰별 상이"
          columns={[
            { key: 'mall', label: '제휴몰', align: 'left' },
            { key: 'gmv', label: '거래액(GMV)', align: 'right' },
            { key: 'rate', label: '수수료율', align: 'center' },
            { key: 'revenue', label: '수수료 매출', align: 'right' },
          ]}
          data={commissionData}
          totalRow={{
            mall: '합계',
            gmv: '131,700,000원',
            rate: '—',
            revenue: '4,200,000원',
          }}
        />

        <div className="card">
          <div className="card-header">
            <div className="card-title">기프티콘 판매 수익</div>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>티켓 교환 시 발생 마진</span>
          </div>
          <table>
            <tbody>
              {gifticonData.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    {item.label}
                    {item.sub && (
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}> {item.sub}</span>
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      color: item.amount.startsWith('−') ? 'var(--amber)' : undefined,
                      fontWeight: 600,
                    }}
                  >
                    {item.amount}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border)' }}>
                <td style={{ fontWeight: 700 }}>기프티콘 판매 수익 (마진)</td>
                <td style={{ fontWeight: 700, color: 'var(--success)', textAlign: 'right' }}>
                  + 200,000원
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              background: 'var(--surface-2)',
              borderRadius: '8px',
              fontSize: '11.5px',
              color: 'var(--text-2)',
              lineHeight: '1.6',
            }}
          >
            기프티콘 교환가는 티켓 환산가치 기준으로 책정되고, 실제 매입은 도매가로 이루어져 그
            차액이 추가 수익이 됩니다.
          </div>
        </div>
      </div>

      {/* Row 2: Ticket Cost + Net Profit */}
      <div className="card-grid">
        <StatsTable
          title="티켓 적립 비용 — 등급별"
          subtitle="적립 수량 × 환산가치"
          columns={[
            { key: 'grade', label: '등급', align: 'left' },
            { key: 'quantity', label: '적립 수량', align: 'center' },
            { key: 'unit', label: '환산가치(장당)', align: 'right' },
            { key: 'cost', label: '적립 비용', align: 'right' },
          ]}
          data={ticketCostData.map((row) => ({
            ...row,
            grade: (
              <span
                className={`tk-chip ${row.grade === '브론즈' ? 'bronze' : row.grade === '실버' ? 'silver' : 'gold'} bare`}
              >
                {row.grade}
              </span>
            ),
          }))}
          totalRow={{
            grade: '합계',
            quantity: '8,890장',
            unit: '—',
            cost: '1,400,000원',
          }}
        />

        <NetProfitSummary
          items={profitItems}
          total={{ label: '순수익', amount: '3,000,000원' }}
          margin="68.2%"
        />
      </div>
    </div>
  );
};
