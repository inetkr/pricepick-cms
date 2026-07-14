import React from 'react';
import type { IDrawStatus } from 'src/types/draws/draw';

const STATUS_META: Record<IDrawStatus, { label: string; badgeClass: string }> = {
  SCHEDULED: { label: '예정', badgeClass: 'badge-blue' },
  ACTIVE: { label: '진행 중', badgeClass: 'badge-amber' },
  CLOSED: { label: '마감', badgeClass: 'badge-red' },
  COMPLETED: { label: '완료', badgeClass: 'badge-green' },
};

interface DrawStatusBadgeProps {
  status: IDrawStatus;
}

export const DrawStatusBadge: React.FC<DrawStatusBadgeProps> = ({ status }) => {
  const meta = STATUS_META[status];
  return <span className={`badge ${meta.badgeClass}`}>{meta.label}</span>;
};

export const DRAW_STATUS_LABEL: Record<IDrawStatus, string> = Object.fromEntries(
  Object.entries(STATUS_META).map(([key, value]) => [key, value.label])
) as Record<IDrawStatus, string>;
