import React from 'react';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';
import { MAX_ACCRUAL_RATE, MAX_FEE_RATE } from 'src/utils/ticket-accrual';

// 대표 제휴몰·카탈로그 테이블이 공통으로 쓰는 셀 렌더러 — 두 테이블을 별도 컴포넌트로 나눠도
// 수수료·적립률 입력, 마진 계산, 시뮬레이터 버튼은 그대로 재사용한다.

interface RateInputCellProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const RateInputCell: React.FC<RateInputCellProps> = ({ value, max, onChange }) => {
  const invalid = value < 0 || value > max || Number.isNaN(value);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <input
        className={`form-input ${invalid ? 'has-error' : ''}`}
        type="number"
        min={0}
        max={max}
        step={0.1}
        value={value}
        style={{ width: '80px', height: '32px', padding: '4px 8px', textAlign: 'right' }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>%</span>
    </div>
  );
};

interface RateCellProps {
  mall: IAffiliateMall;
  onChange: (id: string, value: number) => void;
}

export const FeeRateCell: React.FC<RateCellProps> = ({ mall, onChange }) => (
  <RateInputCell value={mall.feeRate} max={MAX_FEE_RATE} onChange={(v) => onChange(mall.id, v)} />
);

export const AccrualRateCell: React.FC<RateCellProps> = ({ mall, onChange }) => (
  <RateInputCell
    value={mall.accrualRate}
    max={MAX_ACCRUAL_RATE}
    onChange={(v) => onChange(mall.id, v)}
  />
);

export const MarginCell: React.FC<{ mall: IAffiliateMall }> = ({ mall }) => {
  // 수수료·적립률이 API에서 소수 둘째 자리(예: 44.10, 26.46)로 내려오므로, 마진도 반올림해
  // 자릿수를 줄이지 않고 소수 둘째 자리까지 그대로 보여준다.
  const margin = mall.feeRate - mall.accrualRate;
  return (
    <span style={{ color: margin < 0 ? 'var(--danger)' : 'var(--text)', fontWeight: 600 }}>
      {margin.toFixed(2)}%p
    </span>
  );
};

export const SimulatorButtonCell: React.FC<{
  mall: IAffiliateMall;
  onOpen: (mall: IAffiliateMall) => void;
}> = ({ mall, onOpen }) => (
  <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen(mall)}>
    적립 시뮬레이터
  </button>
);

// 로고 이미지가 없거나 깨진 URL이면 몰 이름 첫 글자 배지로 대신 보여준다. logoUrl이 바뀌면(등록·
// 삭제·다른 몰로 재사용되는 셀 등) 이전 에러 상태가 남아있지 않도록 다시 시도한다. changed는
// 저장 스냅샷과 달라졌는지 여부 — 링크프라이스 상태 select와 같은 방식으로 박스섀도로 강조한다.
export const LogoCell: React.FC<{
  mall: IAffiliateMall;
  onEdit: (mall: IAffiliateMall) => void;
  changed?: boolean;
}> = ({ mall, onEdit, changed = false }) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [mall.logoUrl]);

  const initial = (mall.name.trim().charAt(0) || '?').toUpperCase();
  const showImage = !!mall.logoUrl && !imgError;
  const changedShadow = changed ? '0 0 0 2px var(--warning)' : 'none';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
      {showImage ? (
        <img
          src={mall.logoUrl}
          alt=""
          onError={() => setImgError(true)}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            objectFit: 'cover',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            display: 'block',
            flexShrink: 0,
            boxShadow: changedShadow,
          }}
        />
      ) : (
        <span
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'var(--main-soft)',
            color: 'var(--main-hover, var(--main))',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: changedShadow,
          }}
        >
          {initial}
        </span>
      )}
      <button
        type="button"
        className="ta-logo-edit-btn"
        onClick={() => onEdit(mall)}
        style={{
          fontSize: '11px',
          color: 'var(--main-hover, var(--main))',
          fontWeight: 700,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {mall.logoUrl ? '변경' : '등록'}
      </button>
    </div>
  );
};
