import React from 'react';
import type {
  IAffiliateMall,
  IAffiliateMallApprovalStatus,
} from 'src/types/config/ticket_accrual_config';
import { LP_CONVERT_LABEL, MAX_ACCRUAL_RATE, MAX_FEE_RATE } from 'src/utils/ticket-accrual';

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

// max를 넘기지 않으면 기본 상한(20%)을 쓴다 — 링크프라이스 카탈로그는 그 몰의 커미션을
// 상한으로 넘겨, 커미션보다 많이 돌려주는 역마진 설정을 입력 단계에서 막는다.
export const AccrualRateCell: React.FC<RateCellProps & { max?: number }> = ({
  mall,
  onChange,
  max = MAX_ACCRUAL_RATE,
}) => <RateInputCell value={mall.accrualRate} max={max} onChange={(v) => onChange(mall.id, v)} />;

// 링크프라이스가 내려주는 커미션(모바일) — 우리가 정하는 값이 아니라 읽기 전용이다. 이 값이
// 수익 계산(커미션 − 적립률)과 적립률 상한의 기준이 된다.
export const CommissionCell: React.FC<{ mall: IAffiliateMall }> = ({ mall }) => (
  <span style={{ fontWeight: 600 }}>{mall.feeRate}%</span>
);

// 링크프라이스가 아직 값을 내려주지 않은 칸 — 승인된 몰은 "링크프라이스 업데이트"를 누르면
// 채워지므로 갱신이 필요하다고 알리고, 미승인 몰은 애초에 조회 대상이 아니라 "—"로 둔다.
const NoValueCell: React.FC<{ status: IAffiliateMallApprovalStatus }> = ({ status }) =>
  status === 'APPROVED' ? <span className="ta-needsync">갱신 필요</span> : <span>—</span>;

// 앱(AOS·iOS) 실적 인정 여부 — 받은 값을 그대로 적는다. 엑셀의 APP 커미션 칸과 어긋나는 몰이
// 있어 우리가 지원 여부를 판정하지 않는다.
export const AppSupportCell: React.FC<{ mall: IAffiliateMall }> = ({ mall }) => {
  if (!mall.appAndroid && !mall.appIos) return <NoValueCell status={mall.approvalStatus} />;
  const one = (label: string, value: 'Y' | 'N' | null) => (
    <span className={`ta-appcell ${value === 'Y' ? 'yes' : 'no'}`}>
      {label} {value ?? '—'}
    </span>
  );
  return (
    <>
      {one('AOS', mall.appAndroid)}
      &nbsp;·&nbsp;
      {one('iOS', mall.appIos)}
    </>
  );
};

// 랜덤티켓 지급 시점 = 구매 실적이 들어오는 시점(원문 when_trans). 여러 줄인 몰(11번가·옥션)은
// 목록에 첫 줄만 적고 전문은 title로 넘긴다 — 원문을 자르거나 다듬지 않는다.
export const WhenTransCell: React.FC<{ mall: IAffiliateMall }> = ({ mall }) => {
  const full = mall.whenTrans.trim();
  if (!full) return <NoValueCell status={mall.approvalStatus} />;
  const first = full.split(/[\r\n]+/)[0].trim();
  return (
    <>
      <span className="ta-when" title={full}>
        {first}
      </span>
      {first !== full && (
        <span className="ta-when-more" title={full}>
          …
        </span>
      )}
    </>
  );
};

// 링크프라이스 제휴몰의 등급 전환 시점 — 몰마다 다르지 않고 우리가 정하는 값도 아니라 고정 문구다.
export const LpConvertLabelCell: React.FC = () => (
  <span
    className="ta-days-fixed"
    title="링크프라이스 제휴몰은 실적 월의 익익월 6일 이후 확정 건을 대조해 등급 티켓으로 전환합니다. 몰마다 다르지 않습니다."
  >
    {LP_CONVERT_LABEL}
  </span>
);

const APPROVAL_BADGE: Record<IAffiliateMallApprovalStatus, { label: string; className: string }> = {
  APPROVED: { label: '승인', className: 'badge-green' },
  PENDING: { label: '승인대기', className: 'badge-amber' },
  REJECTED: { label: '거부', className: 'badge-red' },
  NOT_APPLIED: { label: '미신청', className: 'badge-gray' },
};

// 링크프라이스 승인 상태는 링크프라이스가 정해 내려주는 값이라 우리가 고치지 않는다 —
// 편집 가능한 select가 아니라 읽기 전용 배지로만 보여준다.
export const ApprovalBadgeCell: React.FC<{ mall: IAffiliateMall }> = ({ mall }) => {
  const badge = APPROVAL_BADGE[mall.approvalStatus];
  return <span className={`badge ${badge.className}`}>{badge.label}</span>;
};

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

// 로고 그림을 그대로 누르면 등록·변경 모달이 열린다. 로고가 없는 몰은 빈칸으로 두지 않고 몰 이름
// 첫 글자 동그라미를 같은 크기로 그려 그것이 누르는 자리가 된다 — 별도의 "등록" 글자를 두지 않는다.
// logoUrl이 바뀌면(등록·삭제·다른 몰로 재사용되는 셀 등) 이전 에러 상태가 남아있지 않도록 다시
// 시도한다. changed는 저장 스냅샷과 달라졌는지 여부 — 박스섀도로 강조한다.
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
    <button
      type="button"
      className="ta-logo-cell"
      onClick={() => onEdit(mall)}
      title={mall.logoUrl ? '로고 변경' : '로고 등록'}
      aria-label={`${mall.name} ${mall.logoUrl ? '로고 변경' : '로고 등록'}`}
    >
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
    </button>
  );
};
