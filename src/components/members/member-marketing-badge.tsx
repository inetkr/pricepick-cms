import React from 'react';

type MarketingType = 'all' | 'none';

interface MemberMarketingBadgeProps {
  type: MarketingType;
}

export const MemberMarketingBadge: React.FC<MemberMarketingBadgeProps> = ({ type }) => {
  const typeMap = {
    all: { className: 'mkt-badge all', label: '동의' },
    none: { className: 'mkt-badge none', label: '거부' },
  };

  const info = typeMap[type];
  return <span className={info.className}>{info.label}</span>;
};
