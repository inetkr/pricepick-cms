import React from 'react';

interface SchedulerItemProps {
  name: string;
  description: string;
  lastRun: string;
  nextStatus: string;
  status: 'running' | 'stopped';
  showActions?: boolean;
  onRunNow?: () => void;
  onPause?: () => void;
}

export const SchedulerItem: React.FC<SchedulerItemProps> = ({
  name,
  description,
  lastRun,
  nextStatus,
  status,
  showActions = false,
  onRunNow,
  onPause,
}) => {
  const statusClass = status === 'running' ? 'running' : 'stopped';
  const nextStatusColor =
    status === 'running' ? { color: 'var(--success)' } : { color: 'var(--danger)' };
  return (
    <div className="scheduler-item">
      <div className="scheduler-info">
        <div className={`scheduler-dot ${statusClass}`} />
        <div>
          <div className="scheduler-name">{name}</div>
          <div className="scheduler-desc">{description}</div>
        </div>
      </div>
      <div className="scheduler-stat">
        <div className="scheduler-last">{lastRun}</div>
        <div className="scheduler-next" style={nextStatusColor}>
          {nextStatus}
        </div>
      </div>
      {showActions && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {onPause && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onPause}>
              일시정지
            </button>
          )}
          {onRunNow && (
            <button type="button" className="btn btn-success btn-sm" onClick={onRunNow}>
              즉시 실행
            </button>
          )}
        </div>
      )}
    </div>
  );
};
