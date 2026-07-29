import React from 'react';
import type { IDrawPrizeTier } from 'src/types/weekly-draws/weekly-draw';

interface WeeklyDrawPrizeRowsProps {
  value: IDrawPrizeTier[];
  onChange: (rows: IDrawPrizeTier[]) => void;
  hideAddButton?: boolean;
  hideLabelColumn?: boolean;
}

const GRID_COLUMNS = '56px 110px 1fr 90px 36px';
const GRID_COLUMNS_NO_LABEL = '56px 1fr 90px 36px';

// 등수는 목록 내 순서로 자동 결정된다(직접 입력 불가) — 행 추가/삭제 시 항상 1..N으로 재번호.
const renumber = (rows: IDrawPrizeTier[]) => rows.map((row, i) => ({ ...row, tier: i + 1 }));

export const getNextTier = (rows: IDrawPrizeTier[]) => rows.length + 1;

export const WeeklyDrawPrizeRows: React.FC<WeeklyDrawPrizeRowsProps> = ({
  value,
  onChange,
  hideAddButton = false,
  hideLabelColumn = false,
}) => {
  const gridColumns = hideLabelColumn ? GRID_COLUMNS_NO_LABEL : GRID_COLUMNS;

  const handleAdd = () => {
    onChange([...value, { tier: value.length + 1, label: '', prize_name: '', winner_count: 1 }]);
  };

  const handleRemove = (index: number) => {
    onChange(renumber(value.filter((_, i) => i !== index)));
  };

  const handleField = (
    index: number,
    field: Exclude<keyof IDrawPrizeTier, 'tier'>,
    fieldValue: string
  ) => {
    onChange(
      value.map((row, i) => {
        if (i !== index) return row;
        if (field === 'label') return { ...row, label: fieldValue };
        if (field === 'prize_name') return { ...row, prize_name: fieldValue };
        return { ...row, winner_count: Math.max(1, Number(fieldValue) || 1) };
      })
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: '8px',
          marginBottom: '6px',
          padding: '0 2px',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>등수</span>
        {!hideLabelColumn && (
          <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>등수명</span>
        )}
        <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>경품명</span>
        <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>당첨자 수</span>
        <span />
      </div>
      {value.map((row, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <div className="form-input" style={{ fontSize: '13px', textAlign: 'center' }}>
            {row.tier}등
          </div>
          {!hideLabelColumn && (
            <input
              className="form-input"
              style={{ fontSize: '13px' }}
              placeholder="예: 1등"
              value={row.label}
              onChange={(e) => handleField(index, 'label', e.target.value)}
            />
          )}
          <input
            className="form-input"
            style={{ fontSize: '13px' }}
            placeholder="경품명"
            value={row.prize_name}
            onChange={(e) => handleField(index, 'prize_name', e.target.value)}
          />
          <input
            className="form-input"
            style={{ fontSize: '13px', textAlign: 'center' }}
            type="number"
            min={1}
            value={row.winner_count}
            onChange={(e) => handleField(index, 'winner_count', e.target.value)}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: 0, width: '36px', color: 'var(--danger)' }}
            onClick={() => handleRemove(index)}
          >
            ✕
          </button>
        </div>
      ))}
      {!hideAddButton && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleAdd}>
          + 등수 추가
        </button>
      )}
    </div>
  );
};
