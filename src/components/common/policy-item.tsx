import React from 'react';

interface PolicyItemProps {
  label: string;
  value: React.ReactNode;
  description?: string;
  className?: string;
}

export const PolicyItem: React.FC<PolicyItemProps> = ({
  label,
  value,
  description,
  className = '',
}) => {
  return (
    <div className={`policy-item ${className}`}>
      <div className="policy-label">{label}</div>
      <div className="policy-value">{value}</div>
      {description && <div className="policy-desc">{description}</div>}
    </div>
  );
};
