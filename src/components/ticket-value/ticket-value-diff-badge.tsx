import React from 'react';

interface TicketValueDiffBadgeProps {
  from: number;
  to: number;
  isInvalid?: boolean;
}

// "변동" 배지 — 값이 그대로면 회색, 바뀌었으면 증감(+/-)과 원래값 대비 퍼센트를 호박색으로 보여준다.
export const TicketValueDiffBadge: React.FC<TicketValueDiffBadgeProps> = ({
  from,
  to,
  isInvalid = false,
}) => {
  if (isInvalid) {
    return <span className="badge badge-amber">입력 오류</span>;
  }
  if (from === to) {
    return <span className="badge badge-gray">변경 없음</span>;
  }
  const diff = to - from;
  const pct = from > 0 ? Math.round((to / from) * 1000) / 10 : null;
  return (
    <span className="badge badge-amber">
      {diff > 0 ? '+' : ''}
      {diff.toLocaleString()}원{pct !== null ? ` (기존의 ${pct}%)` : ''}
    </span>
  );
};
