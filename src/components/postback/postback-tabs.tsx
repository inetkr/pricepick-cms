'use client';

import React from 'react';
import type { IPostbackTab } from 'src/types/postback/postback';

interface PostbackTabsProps {
  active: IPostbackTab;
  onChange: (tab: IPostbackTab) => void;
}

/* 두 제휴사는 포스트백 API 규격이 아예 달라 한 화면에 섞지 않고 탭으로 가른다.
   각 탭이 자기 검색·거르개를 갖고 서로 건드리지 않는다 — 한쪽에 걸러도 다른 쪽은 그대로다. */
const TABS: { id: IPostbackTab; label: string }[] = [
  { id: 'coupang', label: '쿠팡' },
  { id: 'linkprice', label: '링크프라이스' },
];

export const PostbackTabs: React.FC<PostbackTabsProps> = ({ active, onChange }) => (
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
