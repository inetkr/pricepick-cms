'use client';

import React from 'react';

export type IRevenueFeeTab = 'order' | 'period' | 'mall';

interface RevenueFeeTabsProps {
  active: IRevenueFeeTab;
  onChange: (tab: IRevenueFeeTab) => void;
}

/* 탭 하나가 질문 하나다 — 건별 내역(그 건이 여기 제대로 들어왔나) · 기간별 매출(얼마 벌었나) ·
   제휴몰별(어디가 돈이 되나). 기본은 건별 내역이다. */
const TABS: { id: IRevenueFeeTab; label: string }[] = [
  { id: 'order', label: '건별 내역' },
  { id: 'period', label: '기간별 매출' },
  { id: 'mall', label: '제휴몰별' },
];

export const RevenueFeeTabs: React.FC<RevenueFeeTabsProps> = ({ active, onChange }) => (
  <div className="terms-nav">
    {TABS.map((t) => (
      <div
        key={t.id}
        className={`terms-tab ${active === t.id ? 'active' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => onChange(t.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onChange(t.id);
        }}
      >
        {t.label}
      </div>
    ))}
  </div>
);
