'use client';

import React from 'react';
import type { IAffiliateRevenueRange, IRevenueFeePeriodMode } from 'src/types/revenue/revenue_fee';
import { rfN, rfRangeLabel } from 'src/utils/revenue-fee';

interface RevenueFeeToolbarProps {
  mode: IRevenueFeePeriodMode;
  onModeChange: (mode: IRevenueFeePeriodMode) => void;
  day: string;
  onDayChange: (v: string) => void;
  month: string;
  onMonthChange: (v: string) => void;
  from: string;
  onFromChange: (v: string) => void;
  to: string;
  onToChange: (v: string) => void;
  onReload: () => void;
  // 서버가 되돌려 준 실제 조회 구간 — 화면이 요청한 값이 아니라 조회된 값을 적는다
  range?: IAffiliateRevenueRange | null;
  lpOrderCount: number | null;
  isLoading?: boolean;
}

/* 조회 기간은 탭 위에 놓여 아래쪽에 함께 걸린다 — 탭마다 따로 고르면 숫자가 어긋난다.
   칸·고르기·단추 높이는 #sec-revenue-fee 의 --rf-ctl-h 하나로 맞춰져 있다. */
export const RevenueFeeToolbar: React.FC<RevenueFeeToolbarProps> = ({
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
  range,
  lpOrderCount,
  isLoading,
}) => (
  <div className="toolbar">
    <span className="rf-tb-label">조회 기간</span>
    <select
      className="filter-sel"
      value={mode}
      onChange={(e) => onModeChange(e.target.value as IRevenueFeePeriodMode)}
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
    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
      {isLoading
        ? '불러오는 중…'
        : `${rfRangeLabel(range)} · 링크프라이스 주문 ${rfN(lpOrderCount)}`}
    </span>
  </div>
);
