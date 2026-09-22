'use client';

import React from 'react';
import type { IGiftiRevenuePeriodMode } from 'src/types/revenue/revenue_gifti';

interface RevenueGiftiToolbarProps {
  mode: IGiftiRevenuePeriodMode;
  onModeChange: (mode: IGiftiRevenuePeriodMode) => void;
  day: string;
  onDayChange: (v: string) => void;
  month: string;
  onMonthChange: (v: string) => void;
  from: string;
  onFromChange: (v: string) => void;
  to: string;
  onToChange: (v: string) => void;
  onReload: () => void;
  // A hint computed directly from what's picked right now — "기간을 고르세요" (pick a
  // range) / "2026-09" / "전체" (all)
  periodLabel: string;
}

/* The query range sits at the very top of the screen and governs everything below it —
   if cards and tables each picked their own range, the numbers above and below would
   drift apart. Fields start empty: with from/to left blank in custom-range (range)
   mode, it reads as "전체" (all) and shows the full sales history right from the start.
   Field/select/button height is unified through #sec-revenue-gifti's single --gs-ctl-h variable. */
export const RevenueGiftiToolbar: React.FC<RevenueGiftiToolbarProps> = ({
  mode,
  onModeChange,
  day,
  onDayChange,
  month,
  onMonthChange,
  from,
  onFromChange,
  to,
  onToChange,
  onReload,
  periodLabel,
}) => (
  <div className="toolbar">
    <span className="rf-tb-label">조회 기간</span>
    <select
      className="filter-sel"
      value={mode}
      onChange={(e) => onModeChange(e.target.value as IGiftiRevenuePeriodMode)}
    >
      <option value="day">하루</option>
      <option value="month">한 달</option>
      <option value="range">기간 지정</option>
    </select>

    {mode === 'day' && (
      <input
        className="form-input"
        type="date"
        style={{ width: '150px' }}
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
      />
    )}

    {mode === 'month' && (
      <input
        className="form-input"
        type="month"
        style={{ width: '150px' }}
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      />
    )}

    {mode === 'range' && (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <input
          className="form-input"
          type="date"
          style={{ width: '150px' }}
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
        />
        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>~</span>
        <input
          className="form-input"
          type="date"
          style={{ width: '150px' }}
          value={to}
          onChange={(e) => onToChange(e.target.value)}
        />
      </span>
    )}

    <button type="button" className="btn btn-primary btn-sm" onClick={onReload}>
      조회
    </button>
    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{periodLabel}</span>
  </div>
);
