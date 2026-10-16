import React from 'react';
import { TicketChipOnlyName } from 'src/components/common/ticket-chip';
import { TicketValueDiffBadge } from 'src/components/ticket-value/ticket-value-diff-badge';
import type { TicketValueChange } from 'src/sections/ticket-value/hooks/use-ticket-value';
import type { TicketGrade } from 'src/types/common';
import { isValidTicketValue } from 'src/utils/ticket-value';

interface TicketValueTableCardProps {
  title: string;
  subtitle: string;
  grade: TicketGrade;
  value: number;
  savedValue: number;
  changes: TicketValueChange[];
  onChange: (value: number) => void;
  isSaving: boolean;
  onSave: () => void;
}

// 티켓 가치·이벤트 티켓 가치 카드 — 종류 한 줄짜리 표에 현재값/변경할 값/변동을 적고 카드마다 따로 저장한다
export const TicketValueTableCard: React.FC<TicketValueTableCardProps> = ({
  title,
  subtitle,
  grade,
  value,
  savedValue,
  changes,
  onChange,
  isSaving,
  onSave,
}) => {
  const invalid = !isValidTicketValue(value);
  const changed = !invalid && value !== savedValue;
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{subtitle}</div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
      {changes.length > 0 && (
        <div
          style={{
            background: 'var(--warning-soft)',
            border: '1px solid var(--warning)',
            borderRadius: 'var(--r-md)',
            margin: '14px 20px',
            padding: '10px 16px',
            fontSize: '13px',
            color: 'var(--warning)',
            fontWeight: 700,
          }}
        >
          저장하지 않은 변경 {changes.length}건 —{' '}
          {changes.map((c) => (
            <span key={c.kind}>
              {c.label}: {c.from.toLocaleString()}원 → {c.to.toLocaleString()}원
            </span>
          ))}
          <br />
          <span>저장 버튼을 눌러야 적용됩니다.</span>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th style={{ width: '26%' }}>종류</th>
            <th style={{ width: '22%' }}>현재 적용값</th>
            <th style={{ width: '30%' }}>변경할 값</th>
            <th style={{ width: '22%' }}>변동</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TicketChipOnlyName grade={grade} />
            </td>
            <td>{savedValue.toLocaleString()}원</td>
            <td>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <input
                  className={`form-input ${invalid ? 'has-error' : ''}`}
                  type="number"
                  min={0}
                  step={1}
                  value={value}
                  style={{
                    height: '36px',
                    padding: '6px 10px',
                    width: '140px',
                    textAlign: 'right',
                    ...(changed
                      ? { borderColor: 'var(--warning)', background: 'var(--warning-soft)' }
                      : {}),
                  }}
                  onChange={(e) => onChange(Number(e.target.value))}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>원</span>
              </div>
            </td>
            <td>
              <TicketValueDiffBadge from={savedValue} to={value} isInvalid={invalid} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
