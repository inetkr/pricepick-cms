import React from 'react';

interface StatCardProps {
  label: string;
  // 값에 색을 입히거나(적자 표시) 단위를 곁들이는 화면이 있어 노드까지 받는다 — 문자열·숫자는 그대로 쓴다
  value: React.ReactNode;
  change?: {
    type: 'up' | 'down' | 'neutral';
    text: React.ReactNode;
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
