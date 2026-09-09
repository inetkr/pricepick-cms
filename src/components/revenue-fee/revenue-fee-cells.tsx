import React from 'react';
import { rfN, rfRateLabel, rfWon } from 'src/utils/revenue-fee';
import type { IAffiliateRevenueOrderProduct } from 'src/types/revenue/revenue_fee';

interface RfAmountProps {
  value: number;
  /* 서버가 준 비율(수수료율·적립률·수익 %p)을 금액 앞에 작고 흐리게 붙인다.
     null 이면 아무것도 안 붙는다 — 0%로 적으면 「0이다」와 「알 수 없다」가 같아 보인다.
     화면에서 금액÷거래액을 다시 나누지 않는다. 서버 반올림과 갈려 표마다 값이 달라진다. */
  rate?: number | null;
  unit?: string; // 수익 칸은 %p, 나머지는 %
  prefix?: string; // 유저 적립 칸은 「나간 돈」이라 앞에 − 를 단다
}

// 금액 한 칸 — 건별·기간별·제휴몰별·쿠팡 표가 전부 같은 모양을 쓴다
export const RfAmount: React.FC<RfAmountProps> = ({ value, rate, unit = '%', prefix }) => {
  const label = rate === undefined ? '' : rfRateLabel(rate);
  return (
    <>
      {label && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 400,
            color: 'var(--text-3)',
            marginRight: '4px',
          }}
        >
          {label}
          {unit}
        </span>
      )}
      {prefix}
      {rfN(value)}원
    </>
  );
};

// 제휴몰 이름 옆 꼬리말 — 쿠팡만 꿔 있으면 나머지는 무엇인지 되묻게 된다
export const RfMallKind: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rf-mall-kind">{children}</span>
);

// 카드 제목 옆의 옅은 꼬리말(쿠팡 = 직접 제휴 / 나머지 = 링크프라이스)
export const RfTitleNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontWeight: 400, fontSize: '12px', color: 'var(--text-3)' }}>{children}</span>
);

/* 줄 오른쪽 끝의 펼침 표시 — 실제로는 줄 전체가 눌린다.
   포스트백 로그의 펼침 줄과 같은 모양·같은 CSS(.pb-row/.pb-detail)를 쓴다:
   같은 동작을 두 화면이 다르게 보이면 눌러도 되는지부터 헷갈린다. */
export const RfCaret: React.FC = () => (
  <td className="pb-caret">
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </td>
);

/* 펼치면 나오는 주문 상품 표 — 한 주문에 상품이 여럿이면 그 수만큼 줄이 선다.
   취소된 상품은 지우지 않고 금액에 줄을 그어 남긴다: 합계에서 빠진 것이지 없던 일이 아니라,
   지워 버리면 왜 거래액이 원래 금액보다 적은지 이 화면에서 알 길이 없다.
   수량·금액·수수료는 서버가 준 값을 그대로 적는다(수량 × 금액을 다시 곱하지 않는다). */
export const RfOrderProducts: React.FC<{
  products: IAffiliateRevenueOrderProduct[];
  colSpan: number;
}> = ({ products, colSpan }) => (
  <tr className="pb-detail">
    <td colSpan={colSpan}>
      <table>
        <thead>
          <tr>
            <th>상품번호</th>
            <th>상품명</th>
            <th>수량</th>
            <th>금액</th>
            <th>수수료</th>
          </tr>
        </thead>
        <tbody>
          {products.map((it, i) => {
            const dim = it.is_cancelled ? { color: 'var(--text-3)' } : undefined;
            return (
              <tr key={[it.product_code, i].join('-')}>
                <td className="pb-pid" style={dim}>
                  {it.product_code}
                </td>
                <td className="pb-pname" title={it.product_name} style={dim}>
                  {it.product_name}
                  {it.is_cancelled && <span className="pb-cx"> 취소</span>}
                </td>
                <td style={dim}>{rfN(it.quantity)}</td>
                <td>
                  {it.is_cancelled ? (
                    <span className="pb-strike">{rfWon(it.price)}</span>
                  ) : (
                    rfWon(it.price)
                  )}
                </td>
                <td>
                  {it.is_cancelled ? (
                    <span className="pb-strike">{rfWon(it.commission_amount)}</span>
                  ) : (
                    rfWon(it.commission_amount)
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </td>
  </tr>
);
