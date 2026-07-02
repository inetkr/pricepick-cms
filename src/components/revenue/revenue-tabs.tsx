import React, { useState } from 'react';

type TabId = 'fee' | 'gifticon';

interface RevenueTabsProps {
  defaultTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  children: React.ReactNode;
}

export const RevenueTabs: React.FC<RevenueTabsProps> = ({
  defaultTab = 'fee',
  onTabChange,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <>
      <div className="terms-nav">
        <div
          className={`terms-tab ${activeTab === 'fee' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleTabClick('fee')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleTabClick('fee');
          }}
        >
          제휴 수수료 매출
        </div>
        <div
          className={`terms-tab ${activeTab === 'gifticon' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleTabClick('gifticon')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleTabClick('gifticon');
          }}
        >
          기프티콘 판매 매출
        </div>
      </div>
      <div style={{ display: 'block' }}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const tabId = index === 0 ? 'fee' : 'gifticon';
          return <div style={{ display: tabId === activeTab ? 'block' : 'none' }}>{child}</div>;
        })}
      </div>
    </>
  );
};
