import type {
  ITicketValueConfigApiValues,
  ITicketValueConfigValue,
  ITicketValueGrade,
} from 'src/types/config/ticket_value_config';

export const DEFAULT_TICKET_VALUE: ITicketValueConfigValue = {
  bronze: 100,
  silver: 1000,
  gold: 2000,
  event: 40,
};

export const TICKET_VALUE_GRADES: ITicketValueGrade[] = ['bronze', 'silver', 'gold'];

// 등급 간 비율은 정책상 고정값이다 — 이 화면은 "1장이 몇 원인지"만 바꿀 뿐, 브론즈:실버:골드가
// 1:10:20이라는 관계 자체는 바꾸지 않는다. 한 등급을 수정하면 나머지 두 등급이 이 비율로 자동 조정된다.
export const TICKET_GRADE_RATIO: Record<ITicketValueGrade, number> = {
  bronze: 1,
  silver: 10,
  gold: 20,
};

// 포인트 정책의 "10P = 1원" 고정 환율과 티켓 적립 정책의 "환산가치 × 50 = 적립 단위 금액"
// (브론즈 100원 → 5,000원당 1장)은 이 화면이 소유한 값이 아니라 각자 화면에서 별도 관리되는
// 값이다. 영향 범위 카드는 이 상수로 미리보기만 계산할 뿐 실제 정책에 반영하지 않는다.
export const POINTS_PER_WON = 10;
export const TICKET_ACCRUAL_MULTIPLIER = 50;

// 티켓 환산가치(원)를 "10P = 1원" 고정 환율로 환산한 포인트 값으로 바꾼다.
export const convertTicketToPoint = (wonValue: number): number => wonValue * POINTS_PER_WON;

export type RoundedNotes = Partial<Record<ITicketValueGrade, number>>;

export type GradeSyncResult = {
  values: Record<ITicketValueGrade, number>;
  roundedFrom: RoundedNotes;
};

/**
 * anchor 등급의 새 입력값을 기준으로 나머지 두 등급 값을 1:10:20 비율에 맞춰 재계산한다.
 * 정수로 딱 떨어지지 않으면 반올림하고, 반올림 전 값을 roundedFrom에 남긴다.
 */
export const syncGradeValues = (
  current: Record<ITicketValueGrade, number>,
  anchor: ITicketValueGrade,
  rawValue: number
): GradeSyncResult => {
  const next = { ...current, [anchor]: rawValue };
  const roundedFrom: RoundedNotes = {};

  if (!Number.isFinite(rawValue) || rawValue < 0) {
    return { values: next, roundedFrom };
  }

  const unit = rawValue / TICKET_GRADE_RATIO[anchor];
  TICKET_VALUE_GRADES.forEach((grade) => {
    if (grade === anchor) return;
    const exact = unit * TICKET_GRADE_RATIO[grade];
    const rounded = Math.round(exact);
    next[grade] = rounded;
    if (Math.abs(exact - rounded) > 1e-9) {
      roundedFrom[grade] = exact;
    }
  });

  return { values: next, roundedFrom };
};

export type ExchangeRatioResult = {
  ratio: number | null;
  isIntegerMultiple: boolean;
};

// "브론즈 N장 = 실버 1장" 형태의 교환 비율을 현재(저장 전 포함) 입력값 기준으로 계산한다.
export const getExchangeRatio = (fromValue: number, toValue: number): ExchangeRatioResult => {
  if (!Number.isFinite(fromValue) || !Number.isFinite(toValue) || fromValue <= 0) {
    return { ratio: null, isIntegerMultiple: false };
  }
  const ratio = toValue / fromValue;
  return { ratio, isIntegerMultiple: Number.isFinite(ratio) && Math.abs(ratio - Math.round(ratio)) < 1e-9 && ratio > 0 };
};

export const isValidTicketValue = (value: number): boolean =>
  Number.isFinite(value) && Number.isInteger(value) && value >= 0;

// 소수점 둘째 자리까지 반올림하되, 정수면 소수점을 붙이지 않는다 (예: 2, 2.5).
export const formatRatio = (x: number): string => {
  if (!Number.isFinite(x)) return '—';
  const rounded = Math.round(x * 100) / 100;
  return String(rounded);
};

// 저장값 대비 새 값으로 같은 기댓값(비용)을 유지하려면 슬롯 수량을 몇 배로 조정해야 하는지 —
// 룰렛 영향 미리보기 전용 계산이며 실제 룰렛 설정에는 반영되지 않는다.
export const getScaleFactor = (savedValue: number, newValue: number): number | null => {
  if (!Number.isFinite(savedValue) || !Number.isFinite(newValue) || newValue <= 0 || savedValue <= 0) {
    return null;
  }
  return savedValue / newValue;
};

// 서버는 등급 키를 대문자(BRONZE/SILVER/GOLD/EVENT)로 주고받는다 — 화면 상태는 소문자로 다룬다.
export const fromApiTicketValue = (values: ITicketValueConfigApiValues): ITicketValueConfigValue => ({
  bronze: values.BRONZE,
  silver: values.SILVER,
  gold: values.GOLD,
  event: values.EVENT,
});

export const toApiTicketValue = (values: ITicketValueConfigValue): ITicketValueConfigApiValues => ({
  BRONZE: values.bronze,
  SILVER: values.silver,
  GOLD: values.gold,
  EVENT: values.event,
});
