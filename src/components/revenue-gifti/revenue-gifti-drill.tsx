'use client';

import React from 'react';

interface RevenueGiftiDrillProps {
  // How far in the drill-down currently sits — e.g. "월별 내역 › 2026-08 › 2026-08-14"
  label: string;
  onUp: () => void;
}

/* Shows the current drill-down position with a way back up. Nothing to render at the
   top level (monthly) — the section simply doesn't render this component then. Reuses
   the affiliate-fee revenue screen's .rf-drill styling as-is: if two screens draw the
   same behavior differently, it stops reading as the same feature. */
export const RevenueGiftiDrill: React.FC<RevenueGiftiDrillProps> = ({ label, onUp }) => (
  <div className="rf-drill" id="gs-drill">
    <span className="rf-drill-mark">▸</span>
    <span>{label}</span>
    <button type="button" className="btn btn-ghost btn-sm" onClick={onUp}>
      되돌아가기
    </button>
  </div>
);
