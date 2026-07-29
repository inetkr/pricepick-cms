import React from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { Pagination } from 'src/components/common/pagination';
import type { Column } from 'src/components/common/table';
import { Table } from 'src/components/common/table';
import type { IDrawRound } from 'src/types/weekly-draws/weekly-draw';
import { formatDrawRoundLabel } from 'src/utils/weekly-draw';

interface WeeklyDrawRoundTableProps {
  title: string;
  description?: string;
  rounds: IDrawRound[];
  emptyMessage: string;
  pagination?: PaginationProps;
  showViewEntrants?: boolean;
  showEditPrizes?: boolean;
  onViewEntrants: (round: IDrawRound) => void;
  onEditPrizes: (round: IDrawRound) => void;
}

const formatWinnerSummary = (round: IDrawRound) => {
  if (!round.drawn_at) {
    return <span style={{ color: 'var(--text-3)' }}>미확정</span>;
  }
  if (round.winners.length === 0) {
    return <span style={{ color: 'var(--text-3)' }}>당첨자 없음</span>;
  }
  const byTier = new Map<number, string[]>();
  round.winners.forEach((w) => {
    const list = byTier.get(w.tier) ?? [];
    list.push(w.nickname);
    byTier.set(w.tier, list);
  });
  const tiers = Array.from(byTier.keys()).sort((a, b) => a - b);
  return (
    <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
      {tiers.map((tier) => {
        const names = byTier.get(tier) ?? [];
        const shown = names.slice(0, 3).join(', ');
        const more = names.length > 3 ? ` 외 ${names.length - 3}명` : '';
        return (
          <div key={tier}>
            <span className="badge badge-purple" style={{ marginRight: '6px' }}>
              {tier}등
            </span>
            {shown}
            {more}
          </div>
        );
      })}
    </div>
  );
};

export const WeeklyDrawRoundTable: React.FC<WeeklyDrawRoundTableProps> = ({
  title,
  description,
  rounds,
  emptyMessage,
  pagination,
  showViewEntrants = true,
  showEditPrizes = true,
  onViewEntrants,
  onEditPrizes,
}) => {
  const columns: Column<IDrawRound>[] = [
    { key: 'title', label: '회차', render: (r) => <strong>{formatDrawRoundLabel(r)}</strong> },
    {
      key: 'period',
      label: '기간',
      render: (r) => (
        <span style={{ fontSize: '12px' }}>
          {r.week_start_date} ~ {r.week_end_date}
        </span>
      ),
    },
    {
      key: 'entry_count',
      label: '응모건수',
      render: (r) => <>{r.entry_count.toLocaleString()}건</>,
    },
    { key: 'winners', label: '당첨자', render: (r) => formatWinnerSummary(r) },
    {
      key: 'actions',
      label: '액션',
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {showViewEntrants && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onViewEntrants(r)}
            >
              응모자 보기
            </button>
          )}
          {showEditPrizes && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEditPrizes(r)}>
              경품 수정
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {description && <div className="card-sub">{description}</div>}
        </div>
      </div>
      <Table
        data={rounds}
        columns={columns}
        keyExtractor={(r) => r.id}
        emptyMessage={emptyMessage}
      />
      {pagination && pagination.totalItems > 0 && (
        <div style={{ padding: '0 18px 14px' }}>
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
};
