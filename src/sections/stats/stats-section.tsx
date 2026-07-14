'use client';

import React from 'react';
import { DataSourceBar } from 'src/components/common/data-source-bar';
import { InfoBox } from 'src/components/common/info-box';
import { NetProfitSummary } from 'src/components/stats/net-profit-summary';
import { StatsTable } from 'src/components/stats/stats-table';
import { useStats } from 'src/sections/stats/hooks/use-stats';
import type { ITicketGrade } from 'src/types/stats/stats';
import { sumBy } from 'src/utils/helper';

const won = (amount: number) => `${(amount || 0).toLocaleString()}원`;

const ticketGradeLabels: Record<ITicketGrade, string> = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
};

const ticketGradeClass: Record<ITicketGrade, string> = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
};

export const StatsSection: React.FC = () => {
  const { summary, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="section active">
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  const mallGmvTotal = sumBy(summary.mall_commissions, (row) => row.gmv);
  const mallRevenueTotal = sumBy(summary.mall_commissions, (row) => row.commission_revenue);
  const ticketQuantityTotal = sumBy(summary.ticket_cost_by_grade, (row) => row.quantity);
  const ticketCostTotal = sumBy(summary.ticket_cost_by_grade, (row) => row.total_cost);

  const { gifticon_profit: gifticonProfit, net_profit: netProfit } = summary;

  return (
    <div className="section active">
      <DataSourceBar
        tags={[
          { label: '우리 DB 집계 · clicks, orders, tickets, gifticons 테이블', type: 'calc' },
          { label: '제휴몰 정산 API · 수수료 (D+30 확정)', type: 'coupang' },
        ]}
      />

      <InfoBox type="info">
        <strong>수익 구조</strong> — 수익원은 둘입니다. ① <strong>제휴 수수료</strong>(회원이
        제휴몰에서 구매할 때 발생) ② <strong>기프티콘 판매 수익</strong>(회원이 티켓을 기프티콘으로
        교환할 때 발생하는 마진). 두 수익에서 회원에게 적립해준 티켓의 환산가치(적립 비용)를 차감한
        것이 <strong>순수익</strong>입니다. 정산은 제휴몰별 D+30 확정.
      </InfoBox>

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
          data={summary.mall_commissions.map((row) => ({
            mall: row.mall_name,
            gmv: won(row.gmv),
            rate: `${row.commission_rate}%`,
            revenue: won(row.commission_revenue),
          }))}
          totalRow={{
            mall: '합계',
            gmv: won(mallGmvTotal),
            rate: '—',
            revenue: won(mallRevenueTotal),
          }}
        />

        <div className="card">
          <div className="card-header">
            <div className="card-title">기프티콘 판매 수익</div>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>티켓 교환 시 발생 마진</span>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  교환 기프티콘 환산가치
                  <span style={{ fontSize: '11px', color: 'var(--text-3)' }}> (유저 티켓 소진)</span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {won(gifticonProfit.gifticon_exchange_value)}
                </td>
              </tr>
              <tr>
                <td>
                  기프티콘 매입원가<span style={{ fontSize: '11px', color: 'var(--text-3)' }}> (도매)</span>
                </td>
                <td style={{ textAlign: 'right', color: 'var(--amber)', fontWeight: 600 }}>
                  − {won(gifticonProfit.wholesale_cost)}
                </td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--border)' }}>
                <td style={{ fontWeight: 700 }}>기프티콘 판매 수익 (마진)</td>
                <td style={{ fontWeight: 700, color: 'var(--success)', textAlign: 'right' }}>
                  + {won(gifticonProfit.gifticon_profit)}
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
          data={summary.ticket_cost_by_grade.map((row) => ({
            grade: (
              <span className={`tk-chip ${ticketGradeClass[row.grade]} bare`}>
                {ticketGradeLabels[row.grade] || row.grade}
              </span>
            ),
            quantity: `${row.quantity.toLocaleString()}장`,
            unit: won(row.unit_value),
            cost: won(row.total_cost),
          }))}
          totalRow={{
            grade: '합계',
            quantity: `${ticketQuantityTotal.toLocaleString()}장`,
            unit: '—',
            cost: won(ticketCostTotal),
          }}
        />

        <NetProfitSummary
          items={[
            { label: '제휴 수수료 매출', amount: `+ ${won(netProfit.fee_revenue)}`, color: 'success' },
            {
              label: '기프티콘 판매 수익',
              amount: `+ ${won(netProfit.gifticon_revenue)}`,
              color: 'success',
            },
            { label: '티켓 적립 비용', amount: `− ${won(netProfit.ticket_cost)}`, color: 'amber' },
          ]}
          total={{ label: '순수익', amount: won(netProfit.net_profit) }}
          margin={`${netProfit.net_profit_margin}%`}
        />
      </div>
    </div>
  );
};
