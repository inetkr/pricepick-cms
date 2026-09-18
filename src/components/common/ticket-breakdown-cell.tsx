import React from 'react';
import { TicketChip, TicketChipGroup } from 'src/components/common/ticket-chip';
import type { TicketGrade } from 'src/types/common';

// ----------------------------------------------------------------------

export interface ITicketBreakdownPart {
  grade: TicketGrade;
  quantity: number;
}

interface TicketBreakdownCellProps {
  parts: ITicketBreakdownPart[];
  // 원화 환산액 — 넘기면 조합 아래 "(N,NNN원)" 보조줄을 같이 보여준다.
  wonAmount?: number | null;
  emptyText?: string;
  // 취소·환수처럼 "이 조합만큼 되돌아갔다"를 나타낼 때 — 앞에 "−"를 붙이고 빨간색으로 보여준다.
  negative?: boolean;
}

// 등급 티켓 조합(예: 골드 1장 + 실버 2장)을 표에서 보여줄 때 쓰는 공용 셀 —
// 상품 목록의 판매가격, 구매내역의 사용한 티켓 등에서 재사용한다.
export const TicketBreakdownCell: React.FC<TicketBreakdownCellProps> = ({
  parts,
  wonAmount,
  emptyText = '—',
  negative = false,
}) => {
  if (!parts.length) {
    return <span style={{ color: 'var(--text-3)' }}>{emptyText}</span>;
  }
  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
    >
      {negative ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
          {parts.map((p) => (
            <span
              key={p.grade}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                color: 'var(--danger)',
                fontWeight: 700,
              }}
            >
              <span>−</span>
              <TicketChip grade={p.grade} quantity={p.quantity} bare showName showQuantity />
            </span>
          ))}
        </div>
      ) : (
        <TicketChipGroup tickets={parts} bare showName showQuantity />
      )}
      {wonAmount != null && (
        <span style={{ fontSize: '11px', color: negative ? 'var(--danger)' : 'var(--text-3)' }}>
          ({negative ? '−' : ''}
          {wonAmount.toLocaleString('ko-KR')}원)
        </span>
      )}
    </div>
  );
};
