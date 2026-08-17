import type {
  IAffiliateMall,
  IAffiliateMallApprovalStatus,
  IAffiliateMallSource,
} from 'src/types/config/ticket_accrual_config';
import type { IMerchant, IMerchantLpStatusFilter } from 'src/types/merchants/merchant';

// 적립률 기본값 = 수수료 × 60% (나머지 40%가 플랫폼 마진) — 정책상 기본 배율일 뿐 강제값은 아니라
// 운영자가 몰별로 자유롭게 덮어쓸 수 있다.
export const DEFAULT_ACCRUAL_RATIO = 60;

export const MAX_FEE_RATE = 100;
export const MAX_ACCRUAL_RATE = 20;

const APPROVAL_STATUS_VALUES: readonly IMerchantLpStatusFilter[] = [
  'APPROVED',
  'PENDING',
  'REJECTED',
  'NOT_APPLIED',
];

// merchant API의 lp_status 응답은 IAffiliateMallApprovalStatus와 같은 영문 enum 그대로 내려온다
// (과거에는 한글 라벨이었으나 서버가 변경됨). MANUAL 소스(쿠팡 등 직계약 제휴몰)는 링크프라이스
// 심사를 거치지 않아 lp_status가 null로 오며, 서버가 알 수 없는 값을 내려주는 경우도 안전하게
// '미신청'으로 취급한다.
export const mapLpStatus = (status: string | null | undefined): IAffiliateMallApprovalStatus =>
  APPROVAL_STATUS_VALUES.includes(status as IMerchantLpStatusFilter)
    ? (status as IAffiliateMallApprovalStatus)
    : 'NOT_APPLIED';

// merchant API 응답(문자열 소수, MANUAL 소스는 category도 null)을 화면에서 쓰는 뷰 모델로 변환한다.
// get_list_cms 응답 행에는 merchant_source 필드가 내려오지 않으므로, 어느 필터로 가져온
// 목록인지(source)를 호출부가 직접 알려줘야 한다 — 응답 값을 그대로 믿으면 안 된다.
export const toAffiliateMall = (m: IMerchant, source: IAffiliateMallSource): IAffiliateMall => ({
  id: m.id,
  code: m.merchant_code,
  name: m.merchant_name,
  category: m.category ?? '기타',
  source,
  feeRate: Number(m.commission_rate) || 0,
  accrualRate: Number(m.accrual_rate) || 0,
  approvalStatus: mapLpStatus(m.lp_status),
  applied: m.is_applied,
  logoUrl: m.img_url ?? '',
});

export const roundRate = (value: number): number => Math.round(value * 10) / 10;

export const defaultAccrualRate = (
  feeRate: number,
  ratio: number = DEFAULT_ACCRUAL_RATIO
): number => {
  const computed = roundRate((feeRate * ratio) / 100);
  return Math.min(MAX_ACCRUAL_RATE, computed);
};

export const isValidFeeRate = (value: number): boolean =>
  Number.isFinite(value) && value >= 0 && value <= MAX_FEE_RATE;

export const isValidAccrualRate = (value: number): boolean =>
  Number.isFinite(value) && value >= 0 && value <= MAX_ACCRUAL_RATE;

export type TicketDenomination = { grade: 'gold' | 'silver' | 'bronze'; label: string; value: number };

export type GreedyBreakdown = {
  gold: number;
  silver: number;
  bronze: number;
  reward: number;
  remainder: number;
};

// 적립 예산(원)을 큰 단위(골드)부터 차례로 나눠 티켓 수량을 결정한다 — 등급별 적립 기준
// (op-policy-reward-tab.tsx의 calcGreedyTickets)과 같은 Greedy 방식이지만, 여기서는 고정 구간이
// 아니라 "티켓 가치 설정" 화면에서 저장한 실제 환산가치(unitValues)를 단위로 사용한다.
export const calcGreedyBreakdown = (
  rewardWon: number,
  unitValues: { gold: number; silver: number; bronze: number }
): GreedyBreakdown => {
  let remain = Math.max(0, Math.floor(rewardWon));
  const gold = unitValues.gold > 0 ? Math.floor(remain / unitValues.gold) : 0;
  remain -= gold * unitValues.gold;
  const silver = unitValues.silver > 0 ? Math.floor(remain / unitValues.silver) : 0;
  remain -= silver * unitValues.silver;
  const bronze = unitValues.bronze > 0 ? Math.floor(remain / unitValues.bronze) : 0;
  remain -= bronze * unitValues.bronze;
  const reward = gold * unitValues.gold + silver * unitValues.silver + bronze * unitValues.bronze;
  return { gold, silver, bronze, reward, remainder: remain };
};
