'use client';

import React from 'react';
import { MemberIdentityCell } from 'src/components/common/member-identity-cell';
import { GsTicketCell, GsTwoLine } from 'src/components/revenue-gifti/revenue-gifti-cells';
import type { IGiftiRevenueOrder } from 'src/types/revenue/revenue_gifti';
import { gsDt, gsStatusBadgeClass, gsTm, gsWon } from 'src/utils/revenue-gifti';

interface RevenueGiftiDetailRowsProps {
  orders: IGiftiRevenueOrder[];
  isLoading: boolean;
}

/* The level reached by drilling into a day — each order sold that day, one row at a
   time. Cancelled rows are kept, not removed: this is the only place to see how a
   cancellation renders. The brand name isn't prepended when it's already in the
   product name — otherwise it duplicates like "GS25 GS25 3,000원 금액권". */
const productName = (order: IGiftiRevenueOrder) => {
  const brand = (order.brand_name ?? '').trim();
  const name = (order.product_name ?? '').trim();
  if (!brand) return name;
  if (!name) return brand;
  return name.includes(brand) ? name : `${brand} ${name}`;
};

export const RevenueGiftiDetailRows: React.FC<RevenueGiftiDetailRowsProps> = ({
  orders,
  isLoading,
}) => (
  <table id="gs-dt-table">
    <colgroup>
      <col style={{ width: '11%' }} />
      <col style={{ width: '17%' }} />
      <col style={{ width: '20%' }} />
      <col style={{ width: '17%' }} />
      <col style={{ width: '13%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '10%' }} />
    </colgroup>
    <thead>
      <tr>
        <th>구매일</th>
        <th>주문번호</th>
        <th>닉네임 / 카카오톡 ID / 식별 아이디</th>
        <th>상품명</th>
        <th>사용한 티켓</th>
        <th>원화 환산액</th>
        <th>상태</th>
      </tr>
    </thead>
    <tbody>
      {!orders.length ? (
        <tr>
          <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
            {isLoading ? '불러오는 중…' : '해당 날짜에 판매가 없습니다.'}
          </td>
        </tr>
      ) : (
        orders.map((order) => {
          const cancelled = order.status === 'CANCELLED';
          // A cancelled row is dimmed — same color as a live row would make it
          // impossible to tell apart at a glance
          const dimmed = cancelled ? { color: 'var(--text-3)' } : undefined;
          return (
            <tr key={order.id}>
              <td style={dimmed}>
                <GsTwoLine top={gsDt(order.created_at)} sub={gsTm(order.created_at)} />
              </td>
              {/* Order numbers (GO…) are long, so they wrap to two lines instead of truncating */}
              <td className="ordno">
                {order.order_no || <span style={{ color: 'var(--text-3)' }}>—</span>}
              </td>
              <td>
                <MemberIdentityCell
                  member={{
                    nickname: order.user.nickname,
                    // The server doesn't send a separate linked flag — a kakao ID present is treated as linked
                    linkedKakao: Boolean(order.user.kakao_id),
                    kakaoLoginId: order.user.kakao_id,
                  }}
                  userId={order.user.identified_id}
                />
              </td>
              <td style={dimmed}>{productName(order)}</td>
              <td style={dimmed}>
                <GsTicketCell counts={order.tickets_used} won={order.won} />
              </td>
              <td style={{ fontWeight: 600, ...(dimmed ?? {}) }}>{gsWon(order.won)}</td>
              <td>
                <span className={`badge ${gsStatusBadgeClass(order.status)}`}>
                  {order.status_label}
                </span>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
);
