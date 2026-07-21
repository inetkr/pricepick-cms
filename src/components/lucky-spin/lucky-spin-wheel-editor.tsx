'use client';

import React from 'react';
import type { IPrizeType } from 'src/types/common';
import type { ILuckySpinConfigSlot } from 'src/types/tickets/lucky_spin';

const TYPE_OPTIONS: { value: IPrizeType; label: string }[] = [
  { value: 'NO_WIN', label: '꽝' },
  { value: 'EVENT_TICKET', label: '이벤트티켓' },
  { value: 'POINT', label: '포인트' },
];

const VALUE_PLACEHOLDER: Record<IPrizeType, string> = {
  NO_WIN: '-',
  EVENT_TICKET: '장수',
  POINT: 'P 액수',
};

interface LuckySpinWheelEditorProps {
  slots: ILuckySpinConfigSlot[];
  onChange: (index: number, patch: Partial<ILuckySpinConfigSlot>) => void;
}

export const LuckySpinWheelEditor: React.FC<LuckySpinWheelEditorProps> = ({ slots, onChange }) => (
  <div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 160px',
        gap: '8px',
        fontSize: '12px',
        color: 'var(--text-3)',
        marginBottom: '6px',
        padding: '0 2px',
      }}
    >
      <div>칸</div>
      <div>유형</div>
      <div>값</div>
    </div>
    {slots.map((segment, index) => (
      <div
        key={index}
        style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr 160px',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)' }}>
          {index + 1}칸
        </div>
        <select
          className="form-select"
          value={segment.prize_type}
          onChange={(e) => {
            const type = e.target.value as IPrizeType;
            onChange(index, {
              prize_type: type,
              amount: type === segment.prize_type ? segment.amount : 1,
            });
          }}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          className="form-input"
          type="number"
          min={1}
          value={segment.prize_type === 'NO_WIN' ? '' : segment.amount}
          disabled={segment.prize_type === 'NO_WIN'}
          placeholder={VALUE_PLACEHOLDER[segment.prize_type]}
          onChange={(e) => onChange(index, { amount: parseInt(e.target.value, 10) || 0 })}
          style={
            segment.prize_type === 'NO_WIN'
              ? { background: 'var(--surface-2)', color: 'var(--text-3)' }
              : undefined
          }
        />
      </div>
    ))}
  </div>
);
