'use client';

import React from 'react';
import type { IDrawPrize } from 'src/types/draws/draw';

const RANK_OPTIONS = ['1등', '2등', '3등', '4등', '5등'];

interface DrawPrizeRowsEditorProps {
  prizes: IDrawPrize[];
  onChange: (prizes: IDrawPrize[]) => void;
}

export const DrawPrizeRowsEditor: React.FC<DrawPrizeRowsEditorProps> = ({ prizes, onChange }) => {
  const updateRow = (index: number, patch: Partial<IDrawPrize>) => {
    onChange(prizes.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addRow = () => {
    const nextRank = RANK_OPTIONS[prizes.length] || `${prizes.length + 1}등`;
    onChange([...prizes, { rank: nextRank, name: '', winner_count: 1 }]);
  };

  const removeRow = (index: number) => {
    if (prizes.length <= 1) return;
    onChange(prizes.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div className="form-label" style={{ margin: 0 }}>
          등수별 경품 구성
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={addRow}>
          + 등수 추가
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 100px 36px',
          gap: '8px',
          marginBottom: '6px',
          padding: '0 4px',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>등수</span>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>경품명</span>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>당첨자 수</span>
        <span />
      </div>
      {prizes.map((prize, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 100px 36px',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <select
            className="form-select"
            style={{ fontSize: '13px' }}
            value={prize.rank}
            onChange={(e) => updateRow(index, { rank: e.target.value })}
          >
            {RANK_OPTIONS.map((rank) => (
              <option key={rank}>{rank}</option>
            ))}
          </select>
          <input
            className="form-input"
            style={{ fontSize: '13px' }}
            placeholder="예: 에어팟 프로 2세대"
            value={prize.name}
            onChange={(e) => updateRow(index, { name: e.target.value })}
          />
          <input
            className="form-input"
            style={{ fontSize: '13px', textAlign: 'center' }}
            type="number"
            min={1}
            value={prize.winner_count}
            onChange={(e) => updateRow(index, { winner_count: parseInt(e.target.value, 10) || 1 })}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: 0, width: '36px', color: 'var(--danger)' }}
            onClick={() => removeRow(index)}
            disabled={prizes.length <= 1}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
