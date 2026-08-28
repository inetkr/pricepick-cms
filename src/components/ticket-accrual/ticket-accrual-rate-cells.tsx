import React from 'react';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';
import {
  isValidUnlockDays,
  MAX_ACCRUAL_RATE,
  MAX_FEE_RATE,
  MAX_UNLOCK_DAYS,
  MIN_UNLOCK_DAYS,
} from 'src/utils/ticket-accrual';

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

// 링크프라이스 제휴몰(카탈로그)의 전환 대기일 수 입력 — 수수료·적립률 입력(RateInputCell)과
// 같은 모양(form-input + 단위 라벨)으로 맞추되, 단위가 %가 아니라 "일"이고 정수만 받는다.
// 값을 비우면 null로 되돌린다(= API가 아직 값을 안 준 상태와 동일하게 취급, 저장을 막지 않는다).
export const UnlockDaysInputCell: React.FC<{
  mall: IAffiliateMall;
  onChange: (id: string, value: number | null) => void;
}> = ({ mall, onChange }) => {
  const invalid = !isValidUnlockDays(mall.unlockDays);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <input
        className={`form-input ${invalid ? 'has-error' : ''}`}
        type="number"
        min={MIN_UNLOCK_DAYS}
        max={MAX_UNLOCK_DAYS}
        step={1}
        value={mall.unlockDays ?? ''}
        style={{ width: '72px', height: '32px', padding: '4px 8px', textAlign: 'right' }}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(mall.id, raw === '' ? null : Number(raw));
        }}
      />
      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>일</span>
    </div>
  );
};

// 쿠팡(merchant_source=MANUAL) 전용 — 대기일 수가 카카오톡 연동 여부에 따라 갈리는 고정 정책이라
// unlock_days 숫자 하나로는 표현이 안 된다. API 값과 무관하게 항상 이 고정 문구를 보여주며,
// 수정도 여기서 하지 않는다(자세한 설명은 "티켓 적립 설정 Notice" 모달 참고).
export const COUPANG_UNLOCK_DAYS_LABEL = '카카오톡 연동 D+7 / 미연동 D+30';

export const UnlockDaysFixedCell: React.FC = () => (
  <span
    className="ta-days-fixed"
    title="쿠팡은 직계약 제휴몰이라 대기일 수가 고정값입니다. 이 화면에서 수정할 수 없습니다."
  >
    {COUPANG_UNLOCK_DAYS_LABEL}
  </span>
);

export const SimulatorButtonCell: React.FC<{
  mall: IAffiliateMall;
  onOpen: (mall: IAffiliateMall) => void;
}> = ({ mall, onOpen }) => (
  <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen(mall)}>
    시뮬레이터
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
