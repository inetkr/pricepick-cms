import React from 'react';

interface PolicyItem {
  label: string;
  value: string | React.ReactNode;
  description?: string;
}

interface AttendanceSettingCardProps {
  title: string;
  policies: PolicyItem[];
  onEdit?: () => void;
}

export const AttendanceSettingCard: React.FC<AttendanceSettingCardProps> = ({
  title,
  policies,
  onEdit,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        {onEdit && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
            수정
          </button>
        )}
      </div>
      <div>
        {policies.map((policy, idx) => (
          <div key={idx} className="policy-item">
            <div className="policy-label">{policy.label}</div>
            <div className="policy-value">{policy.value}</div>
            {policy.description && <div className="policy-desc">{policy.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
