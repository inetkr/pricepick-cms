import React from 'react';

export interface DataSourceTag {
  label: string;
  type: 'ours' | 'coupang' | 'calc' | 'policy';
}

interface DataSourceBarProps {
  tags: DataSourceTag[];
}

const typeClassMap = {
  ours: 'ours',
  coupang: 'coupang',
  calc: 'calc',
  policy: 'policy',
};

export const DataSourceBar: React.FC<DataSourceBarProps> = ({ tags }) => {
  return (
    <div className="data-source-bar">
      <span className="ds-label">데이터 출처</span>
      {tags.map((tag, idx) => (
        <span key={idx} className={`ds-tag ${typeClassMap[tag.type]}`}>
          {tag.label}
        </span>
      ))}
    </div>
  );
};
