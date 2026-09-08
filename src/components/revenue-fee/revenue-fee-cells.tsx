import React from 'react';
import { rfN, rfRateLabel } from 'src/utils/revenue-fee';

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
