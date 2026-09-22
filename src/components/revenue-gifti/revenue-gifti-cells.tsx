import React from 'react';
import type { IGiftiTicketCounts } from 'src/types/revenue/revenue_gifti';
import { GS_GRADE_KO, gsN, gsTicketParts, gsWon } from 'src/utils/revenue-gifti';

/* ── Tickets-used cell ──
   One line per grade. Cramming them onto one line truncates like "Gold 1206 · Silver
   133 · Bronze". Zero-count grades are dropped entirely, largest grade first — the
   accrual rule fills the largest grade first, so that order is the natural reading
   order. When `won` is given, it's appended as a last line so the cell reads as a
   self-contained breakdown (grade counts + their won total) without having to look
   across to the table's separate "원화 환산액" column — only the value the server
   sent is shown, never recomputed here. */
interface GsTicketCellProps {
  counts: IGiftiTicketCounts | null | undefined;
  won?: number | null;
}

export const GsTicketCell: React.FC<GsTicketCellProps> = ({ counts, won }) => {
  const parts = gsTicketParts(counts);
  if (!parts.length) return <span style={{ color: 'var(--text-3)' }}>—</span>;

  return (
    <div className="tkc" style={{ fontWeight: 700, color: 'var(--text)' }}>
      {parts.map((p) => (
        <div key={p.grade}>
          {GS_GRADE_KO[p.grade]} {gsN(p.count)}
        </div>
      ))}
      {won != null && <div style={{ color: 'var(--text-3)', fontWeight: 400 }}>({gsWon(won)})</div>}
    </div>
  );
};

/* ── Two-line cell ── a main value on top with a supporting one below, like a time under a date */
interface GsTwoLineProps {
  top: React.ReactNode;
  sub?: React.ReactNode;
}

export const GsTwoLine: React.FC<GsTwoLineProps> = ({ top, sub }) => (
  <>
    <div style={{ fontWeight: 700 }}>{top}</div>
    {sub ? <div className="cell-sub">{sub}</div> : null}
  </>
);
