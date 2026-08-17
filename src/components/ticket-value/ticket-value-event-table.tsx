import React from 'react';
import { TicketChipOnlyName } from 'src/components/common/ticket-chip';
import { TicketValueDiffBadge } from 'src/components/ticket-value/ticket-value-diff-badge';
import type { TicketValueChange } from 'src/sections/ticket-value/hooks/use-ticket-value';
import { isValidTicketValue } from 'src/utils/ticket-value';

interface TicketValueEventTableProps {
  value: number;
  savedValue: number;
  changes: TicketValueChange[];
  onChange: (value: number) => void;
  isSaving: boolean;
  onSave: () => void;
}

export const TicketValueEventTable: React.FC<TicketValueEventTableProps> = ({
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
          <div className="card-title">이벤트 티켓 가치</div>
          <div className="card-sub">
            이벤트 티켓은 경품 응모 전용이라 등급 체계와 별개로 관리합니다 · 등급 값을 바꿔도 이벤트
            티켓 가치는 움직이지 않습니다
          </div>
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
            <span key={c.grade}>
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
              <TicketChipOnlyName grade="EVENT" />
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
