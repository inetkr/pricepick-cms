import React from 'react';
import type { IRouletteRewardType, IRouletteSlot } from 'src/types/tickets/roulette';
import type { RouletteValueOverrides } from 'src/utils/roulette';
import { REWARD_TYPE_META, getSlotExpectedValue, getSlotValue } from 'src/utils/roulette';

interface RouletteSlotEditorProps {
  tableId: string;
  slots: IRouletteSlot[];
  onChange: (index: number, patch: Partial<IRouletteSlot>) => void;
  probabilitySum: number;
  isProbabilityValid: boolean;
  totalExpectedValue: number;
  showJackpotBadge?: boolean;
  // 티켓 가치 설정 화면에서 실시간으로 불러온 환산가치 — 있으면 가치·기댓값 계산에 우선 적용한다.
  valueOverrides?: RouletteValueOverrides;
}

export const RouletteSlotEditor: React.FC<RouletteSlotEditorProps> = ({
  tableId,
  slots,
  onChange,
  probabilitySum,
  isProbabilityValid,
  totalExpectedValue,
  showJackpotBadge,
  valueOverrides,
}) => {
  const handleTypeChange = (index: number, type: IRouletteRewardType) => {
    if (type === 'MISS') {
      onChange(index, { type, qty: 0 });
      return;
    }
    const current = slots[index];
    onChange(index, { type, qty: current.type === 'MISS' || current.qty <= 0 ? 1 : current.qty });
  };

  const probDiff = Math.abs(probabilitySum - 100);

  const jackpotIndex = showJackpotBadge
    ? slots.reduce<number>(
        (best, slot, i) =>
          best === -1 || getSlotValue(slot, valueOverrides) > getSlotValue(slots[best], valueOverrides)
            ? i
            : best,
        -1
      )
    : -1;

  return (
    <table id={tableId}>
      <thead>
        <tr>
          <th style={{ width: '64px' }}>슬롯</th>
          <th style={{ width: '150px' }}>보상 유형</th>
          <th style={{ width: '150px' }}>수량</th>
          <th style={{ width: '110px' }}>가치(원)</th>
          <th style={{ width: '150px' }}>확률(%)</th>
          <th style={{ width: '120px' }}>기댓값 기여</th>
        </tr>
      </thead>
      <tbody>
        {slots.map((slot, index) => {
          const isMiss = slot.type === 'MISS';
          return (
            <tr key={index}>
              <td style={{ fontWeight: 700, color: 'var(--text-2)' }}>{index + 1}번</td>
              <td>
                <select
                  className="form-select"
                  value={slot.type}
                  onChange={(e) => handleTypeChange(index, e.target.value as IRouletteRewardType)}
                >
                  {Object.entries(REWARD_TYPE_META).map(([value, m]) => (
                    <option key={value} value={value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <div className="rlt-numcell">
                  {isMiss ? (
                    <span className="rlt-none">보상 없음</span>
                  ) : (
                    <>
                      <input
                        className="form-input rlt-num"
                        type="number"
                        min={1}
                        step={1}
                        value={slot.qty}
                        onChange={(e) =>
                          onChange(index, { qty: Math.max(0, Number(e.target.value) || 0) })
                        }
                      />
                      <span className="rlt-unit">{REWARD_TYPE_META[slot.type].unit}</span>
                    </>
                  )}
                </div>
              </td>
              <td style={{ color: 'var(--text-2)' }}>
                {isMiss ? '—' : `${getSlotValue(slot, valueOverrides).toLocaleString()}원`}
                {showJackpotBadge && (
                  <span
                    className="rlt-jackpot-badge"
                    style={{ display: index === jackpotIndex ? 'inline-block' : 'none' }}
                  >
                    JACKPOT
                  </span>
                )}
              </td>
              <td>
                <div className="rlt-numcell">
                  <input
                    className="form-input rlt-num"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={slot.prob}
                    onChange={(e) =>
                      onChange(index, { prob: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })
                    }
                  />
                  <span className="rlt-unit">%</span>
                </div>
              </td>
              <td style={{ fontWeight: 600 }}>
                {getSlotExpectedValue(slot, valueOverrides).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}원
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4} style={{ fontWeight: 700 }}>
            합계
          </td>
          <td style={{ fontWeight: 800 }}>
            <span style={{ color: isProbabilityValid ? 'var(--success)' : 'var(--danger)' }}>
              {probabilitySum}%
            </span>
            {!isProbabilityValid && (
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--danger)', marginTop: '2px' }}>
                100% {probabilitySum > 100 ? '초과' : '미달'} {probDiff.toFixed(1)}%p
              </div>
            )}
          </td>
          <td style={{ fontWeight: 800 }}>
            {totalExpectedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}원
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
