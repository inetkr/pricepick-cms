import React from 'react';

// ----------------------------------------------------------------------

export type IBulkTab = 'new' | 'history';

interface BulkTabsProps {
  active: IBulkTab;
  onChange: (tab: IBulkTab) => void;
}

export const BulkTabs: React.FC<BulkTabsProps> = ({ active, onChange }) => (
  <div className="bt-tabs">
    <button
      type="button"
      className={`bt-tab ${active === 'new' ? 'on' : ''}`}
      onClick={() => onChange('new')}
    >
      새로
    </button>
    <button
      type="button"
      className={`bt-tab ${active === 'history' ? 'on' : ''}`}
      onClick={() => onChange('history')}
    >
      히스토리
    </button>
  </div>
);
