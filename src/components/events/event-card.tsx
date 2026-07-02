import React from 'react';

export interface EventData {
  id: string;
  title: string;
  period: string;
  target: string;
  description: string;
  status: 'active' | 'inactive' | 'scheduled';
  type?: string;
}

interface EventCardProps {
  event: EventData;
  onEdit?: (event: EventData) => void;
  onDelete?: (event: EventData) => void;
  showActions?: boolean;
}

const statusMap = {
  active: { label: '진행 중', className: 'badge-green' },
  inactive: { label: '비노출', className: 'badge-gray' },
  scheduled: { label: '예정', className: 'badge-amber' },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const status = statusMap[event.status] || statusMap.inactive;

  return (
    <div className="event-card">
      <div className="event-header">
        <div>
          <div className="event-title">{event.title}</div>
          <div className="event-period">
            {event.period} &nbsp;·&nbsp; {event.target}
          </div>
        </div>
        <span className={`badge ${status.className}`}>{status.label}</span>
      </div>
      <div className="event-desc">{event.description}</div>
      {showActions && (
        <div className="event-actions">
          {onEdit && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(event)}>
              수정
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(event)}
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
};
