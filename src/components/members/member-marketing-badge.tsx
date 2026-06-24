import React from 'react';

type MarketingType = 'all' | 'sel' | 'none';

interface MemberMarketingBadgeProps {
  type: MarketingType;
}

export const MemberMarketingBadge: React.FC<MemberMarketingBadgeProps> = ({ type }) => {
  const typeMap = {
    all: { className: 'mkt-badge all', label: '전체 동의' },
    sel: { className: 'mkt-badge sel', label: '선택 동의' },
    none: { className: 'mkt-badge none', label: '전체 거부' },
  };

  const info = typeMap[type];
  return <span className={info.className}>{info.label}</span>;
};
