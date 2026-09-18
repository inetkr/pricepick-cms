import React from 'react';
import type { TicketGrade } from 'src/types/common';
import { formatGifticonTicketPartText } from 'src/utils/gifticon-products';

// ----------------------------------------------------------------------

export interface IUsedTicketPart {
  grade: TicketGrade;
  quantity: number;
}

interface UsedTicketCellProps {
  parts: IUsedTicketPart[];
  // 환산 원화를 함께 아는 칸(사용한 티켓/환불 티켓)에서만 넘긴다 — 보유 티켓처럼 원화
  // 짝이 없는 칸은 생략하면 등급 줄만 보여준다.
  wonAmount?: number;
  // 취소내역의 「환불 티켓」처럼 "되돌아간" 조합을 보여줄 때 — 앞에 "−"를 붙이고
  // 빨간 글씨(ph-minus)로 보여준다. 원화 병기 줄은 negative여도 계속 회색 그대로다
  // (포인츠허브 ticketLines() 그대로).
  negative?: boolean;
}

// 사용한 티켓 칸 — 포인츠허브 ticketLines()/usedTicketCell() 그대로: 등급마다 칩이 아니라
// 한 줄씩(골드 79 / 실버 1), 그 아래 원화 합계를 회색으로 병기한다. 구매내역/미사용취소/
// 취소내역이 모두 같은 형식을 쓴다.
export const UsedTicketCell: React.FC<UsedTicketCellProps> = ({
  parts,
  wonAmount,
  negative = false,
}) => {
  if (!parts.length) {
    return <span style={{ color: 'var(--text-3)' }}>—</span>;
  }
  const sign = negative ? '−' : '';
  return (
    <>
      <div className={`tkc ${negative ? 'ph-minus' : 'gip-price-main'}`}>
        {parts.map((p) => (
          <div key={p.grade}>
            {sign}
            {formatGifticonTicketPartText(p)}
          </div>
        ))}
      </div>
      {wonAmount != null && (
        <div className="gip-price-won">
          ({sign}
          {wonAmount.toLocaleString('ko-KR')}원)
        </div>
      )}
    </>
  );
};
