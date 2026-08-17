import React from 'react';
import { TicketChipOnlyName } from 'src/components/common/ticket-chip';
import { TicketValueDiffBadge } from 'src/components/ticket-value/ticket-value-diff-badge';
import type { TicketValueChange } from 'src/sections/ticket-value/hooks/use-ticket-value';
import type {
  ITicketValueConfigValue,
  ITicketValueGrade,
} from 'src/types/config/ticket_value_config';
import { TICKET_VALUE_GRADES, isValidTicketValue, type RoundedNotes } from 'src/utils/ticket-value';

interface TicketValueGradeTableProps {
  values: ITicketValueConfigValue;
  savedValues: ITicketValueConfigValue;
  roundedFrom: RoundedNotes;
  changes: TicketValueChange[];
  onChange: (grade: ITicketValueGrade, value: number) => void;
  isSaving: boolean;
  onSave: () => void;
}

export const TicketValueGradeTable: React.FC<TicketValueGradeTableProps> = ({
  values,
  savedValues,
  roundedFrom,
  changes,
  onChange,
  isSaving,
  onSave,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">등급별 환산가치</div>
          <div className="card-sub">
            티켓 1장 = 원화 얼마로 볼 것인지 (0 이상 정수) · 하나를 바꾸면 나머지 두 값이
            비율(1:10:20)대로 자동 조정됩니다
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
          {changes.map((c, i) => (
            <span key={c.grade}>
              {i > 0 && ' · '}
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
            <th style={{ width: '26%' }}>등급</th>
            <th style={{ width: '22%' }}>현재 적용값</th>
            <th style={{ width: '30%' }}>변경할 값</th>
            <th style={{ width: '22%' }}>변동</th>
          </tr>
        </thead>
        <tbody>
          {TICKET_VALUE_GRADES.map((grade) => {
            const value = values[grade];
            const saved = savedValues[grade];
            const invalid = !isValidTicketValue(value);
            const changed = !invalid && value !== saved;
            const rounded = roundedFrom[grade];
            return (
              <tr key={grade}>
                <td>
                  <TicketChipOnlyName grade={grade.toUpperCase() as 'BRONZE' | 'SILVER' | 'GOLD'} />
                </td>
                <td>{saved.toLocaleString()}원</td>
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
                      onChange={(e) => onChange(grade, Number(e.target.value))}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>원</span>
                  </div>
                  {rounded !== undefined && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--warning, #B4761A)',
                        marginTop: '4px',
                        fontWeight: 600,
                      }}
                    >
                      정확히는 {rounded.toLocaleString(undefined, { maximumFractionDigits: 2 })}원 →
                      반올림됨
                    </div>
                  )}
                </td>
                <td>
                  <TicketValueDiffBadge from={saved} to={value} isInvalid={invalid} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
