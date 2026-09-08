import React from 'react';
import { StatCard } from 'src/components/common/stat-card';
import type { IAffiliateRevenueSummary } from 'src/types/revenue/revenue_fee';
import { rfN, rfRateFixed, rfWon } from 'src/utils/revenue-fee';

interface RevenueFeeStatsProps {
  summary: IAffiliateRevenueSummary | null;
}

/* 왼쪽에서 오른쪽으로 돈이 흐른다 — 몇 건 팔렸나 · 얼마어치 팔렸나 · 우리가 얼마 받았나 ·
   유저에게 얼마 나갔나 · 얼마 남았나. 쿠팡과 링크프라이스를 합친 값이고, 꼬리말에 둘을 갈라
   적어 카드에서 바로 짚을 수 있게 한다.
   숫자도 비율도 서버가 준 값 그대로다 — 화면에서 다시 나누면 서버 숫자와 어긋난다.
   「수수료」는 뒤의 뺄셈을 화면에서 확인할 길이라 뺄 수 없다: 없애면 「수익 = 수수료 −
   유저 적립」에서 수수료가 사라져 유저 적립·수익이 어디서 나온 값인지 볼 수 없다. */
export const RevenueFeeStats: React.FC<RevenueFeeStatsProps> = ({ summary }) => {
  const dash = '—';
  const orderCount = summary?.order_count;
  const gmv = summary?.transaction_amount;
  const comm = summary?.commission;
  const earn = summary?.user_accrual;
  const profit = summary?.profit;

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
      <StatCard
        color="blue"
        label="주문 건수"
        value={orderCount ? rfN(orderCount.total) : dash}
        change={{
          type: 'neutral',
          text: orderCount
            ? `쿠팡 ${rfN(orderCount.coupang)} + 링크프라이스 ${rfN(orderCount.linkprice)} · 취소 제외`
            : dash,
        }}
      />
      <StatCard
        color="blue"
        label="거래액"
        value={gmv ? rfWon(gmv.total) : dash}
        change={{
          type: 'neutral',
          text: gmv ? `쿠팡 ${rfWon(gmv.coupang)} + 링크프라이스 ${rfWon(gmv.linkprice)}` : dash,
        }}
      />
      <StatCard
        color="purple"
        label="수수료"
        value={comm ? rfWon(comm.total) : dash}
        change={{
          type: 'neutral',
          text: comm ? `쿠팡 포함 · 평균 수수료율 ${rfRateFixed(comm.average_rate)}%` : dash,
        }}
      />
      <StatCard
        color="amber"
        label="유저 적립"
        value={earn ? `− ${rfWon(earn.total)}` : dash}
        change={{
          type: 'neutral',
          text: earn
            ? `수수료의 ${rfRateFixed(earn.of_commission_rate)}% · 평균 적립률 ${rfRateFixed(earn.average_rate)}%`
            : dash,
        }}
      />
      {/* 적립이 수수료를 넘으면 수익이 음수로 내려온다 — 색까지 바꿔 눈에 걸리게 한다 */}
      <StatCard
        color="green"
        label="수익"
        value={
          profit ? (
            <span style={profit.total < 0 ? { color: 'var(--danger)' } : undefined}>
              {rfWon(profit.total)}
            </span>
          ) : (
            dash
          )
        }
        change={{
          type: profit && profit.total < 0 ? 'down' : 'neutral',
          text: profit ? `수수료 − 유저 적립 · 거래액 대비 ${rfRateFixed(profit.rate_p)}%p` : dash,
        }}
      />
    </div>
  );
};
