import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    type: 'up' | 'down' | 'neutral';
    text: string;
  };
  color?: 'purple' | 'green' | 'amber' | 'red' | 'blue';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  color,
  className = '',
}) => {
  const colorClass = color ? `stat-card ${color}` : 'stat-card';
  return (
    <div className={`${colorClass} ${className}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && (
        <div
          className={`stat-change ${change.type === 'down' ? 'down' : change.type === 'neutral' ? 'neutral' : ''}`}
        >
          {change.text}
        </div>
      )}
    </div>
  );
};
