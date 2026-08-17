import React from 'react';
import { TicketChipOnlyName } from 'src/components/common/ticket-chip';
import type { ITicketValueConfigValue } from 'src/types/config/ticket_value_config';
import { getExchangeRatio } from 'src/utils/ticket-value';

interface TicketValueRatioCardProps {
  values: ITicketValueConfigValue;
}

const PAIRS: {
  from: 'bronze' | 'silver';
  to: 'silver' | 'gold';
  fromLabel: string;
  toLabel: string;
}[] = [
  { from: 'bronze', to: 'silver', fromLabel: '브론즈', toLabel: '실버' },
  { from: 'silver', to: 'gold', fromLabel: '실버', toLabel: '골드' },
];

// 저장 여부와 무관하게 "지금 입력창에 있는 값" 기준으로 계산되는 조회 전용 카드 —
// 저장 전 미리보기로 나누어떨어지지 않는 조합을 바로 알 수 있게 한다.
export const TicketValueRatioCard: React.FC<TicketValueRatioCardProps> = ({ values }) => {
  const rows = PAIRS.map((pair) => ({
    ...pair,
    result: getExchangeRatio(values[pair.from], values[pair.to]),
  }));
  const hasWarning = rows.some((row) => row.result.ratio !== null && !row.result.isIntegerMultiple);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">등급 간 교환 비율</div>
            <div className="card-sub">위 입력값으로 자동 계산됩니다 (입력 즉시 갱신)</div>
          </div>
          <span className="badge badge-purple">자동 계산</span>
        </div>
        <div>
          {rows.map((row) => (
            <div
              key={row.from}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                padding: '14px 18px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <TicketChipOnlyName grade={row.from.toUpperCase() as 'BRONZE' | 'SILVER'} />
              <span style={{ fontSize: '14px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {row.fromLabel}{' '}
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: row.result.isIntegerMultiple ? 'var(--main-hover, var(--main))' : 'var(--warning, #B4761A)',
                  }}
                >
                  {row.result.ratio === null ? '—' : Math.round(row.result.ratio * 100) / 100}
                </span>
                장 = {row.toLabel} 1장
              </span>
              {row.result.ratio === null ? (
                <span className="badge badge-amber">계산 불가</span>
              ) : row.result.isIntegerMultiple ? (
                <span className="badge badge-green">정수 배수</span>
              ) : (
                <span className="badge badge-amber">나누어떨어지지 않음</span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--text-2)', marginLeft: 'auto' }}>
                {row.toLabel} {values[row.to].toLocaleString()}원 ÷ {row.fromLabel}{' '}
                {values[row.from].toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {hasWarning && (
        <div className="warn-box">
          <strong>교환 비율이 나누어떨어지지 않습니다.</strong>
          <div style={{ marginTop: '4px' }}>
            {rows
              .filter((row) => row.result.ratio !== null && !row.result.isIntegerMultiple)
              .map((row) => (
                <div key={row.from}>
                  {row.fromLabel} {row.result.ratio && Math.round(row.result.ratio * 100) / 100}장 ={' '}
                  {row.toLabel} 1장 — 교환이 애매해집니다.
                </div>
              ))}
          </div>
          <div style={{ marginTop: '4px' }}>
            소수점 교환은 실제 처리가 애매해집니다. 등급 간의 배수 관계로 맞추는 것을 권장합니다.
          </div>
        </div>
      )}
    </>
  );
};
