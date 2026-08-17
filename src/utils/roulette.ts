import type {
  ILuckySpinConfigSlot,
  ILuckySpinPrizeType,
  IRouletteRewardType,
  IRouletteSlot,
} from 'src/types/tickets/roulette';

// unitValue는 label·unit과 달리 MISS·POINT에만 있다 — 이 둘은 "10P = 1원" 같은 정책상
// 고정 환율이라 하드코딩해도 되지만, 티켓 종류(브론즈/실버/골드/이벤트)는 티켓 가치 설정
// 화면에서 실시간으로 바뀌는 값이라 여기에 하드코딩하지 않는다. 반드시 valueOverrides
// (getTicketValueConfig로 불러온 실제 값)로만 계산한다 — getSlotValue 참고.
export const REWARD_TYPE_META: Record<
  IRouletteRewardType,
  { label: string; unit: string; unitValue?: number }
> = {
  MISS: { label: '꽝', unit: '', unitValue: 0 },
  POINT: { label: '포인트', unit: 'P', unitValue: 0.1 },
  EVENT_TICKET: { label: '이벤트 티켓', unit: '장' },
  BRONZE_TICKET: { label: '브론즈 티켓', unit: '장' },
  SILVER_TICKET: { label: '실버 티켓', unit: '장' },
  GOLD_TICKET: { label: '골드 티켓', unit: '장' },
};

export const DEFAULT_DAILY_ROULETTE_SLOTS: IRouletteSlot[] = [
  { type: 'SILVER_TICKET', qty: 1, prob: 0.2 },
  { type: 'EVENT_TICKET', qty: 1, prob: 5 },
  { type: 'BRONZE_TICKET', qty: 1, prob: 2 },
  { type: 'POINT', qty: 100, prob: 35 },
  { type: 'POINT', qty: 10, prob: 40 },
  { type: 'MISS', qty: 0, prob: 17.8 },
];

export const DEFAULT_JACKPOT_ROULETTE_SLOTS: IRouletteSlot[] = [
  { type: 'GOLD_TICKET', qty: 1, prob: 0.4 },
  { type: 'SILVER_TICKET', qty: 1, prob: 1 },
  { type: 'POINT', qty: 1000, prob: 5 },
  { type: 'BRONZE_TICKET', qty: 1, prob: 12 },
  { type: 'POINT', qty: 100, prob: 50 },
  { type: 'MISS', qty: 0, prob: 31.6 },
];

// 티켓 종류(브론즈/실버/골드/이벤트) 슬롯의 1개당 가치(원) — 티켓 가치 설정 화면에서 실시간으로
// 관리하는 값이라 여기서 하드코딩하지 않고, getTicketValueConfig로 불러온 이 값만 계산에 쓴다.
export type RouletteValueOverrides = Partial<Record<IRouletteRewardType, number>>;

export const getSlotValue = (slot: IRouletteSlot, valueOverrides?: RouletteValueOverrides) => {
  if (slot.type === 'MISS') return 0;
  // 포인트는 "10P = 1원" 고정 환율(정책 상수)이라 하드코딩된 값을 그대로 쓴다. 티켓 종류는
  // 실제 값이 아직 로딩 전이면(캐시 없는 상태) 옛 값을 추측해 보여주지 않고 0으로 둔다 —
  // valueOverrides가 도착하는 즉시 재계산된다.
  const unitValue =
    slot.type === 'POINT' ? (REWARD_TYPE_META.POINT.unitValue ?? 0) : (valueOverrides?.[slot.type] ?? 0);
  return unitValue * slot.qty;
};

export const getSlotExpectedValue = (
  slot: IRouletteSlot,
  valueOverrides?: RouletteValueOverrides
) => (getSlotValue(slot, valueOverrides) * slot.prob) / 100;

export const getProbabilitySum = (slots: IRouletteSlot[]) =>
  Math.round(slots.reduce((sum, s) => sum + s.prob, 0) * 10) / 10;

export const getTotalExpectedValue = (
  slots: IRouletteSlot[],
  valueOverrides?: RouletteValueOverrides
) => slots.reduce((sum, s) => sum + getSlotExpectedValue(s, valueOverrides), 0);

const API_TO_UI_PRIZE_TYPE: Record<ILuckySpinPrizeType, IRouletteRewardType> = {
  NO_WIN: 'MISS',
  POINT: 'POINT',
  EVENT_TICKET: 'EVENT_TICKET',
  BRONZE: 'BRONZE_TICKET',
  SILVER: 'SILVER_TICKET',
  GOLD: 'GOLD_TICKET',
};

const UI_TO_API_PRIZE_TYPE: Record<IRouletteRewardType, ILuckySpinPrizeType> = {
  MISS: 'NO_WIN',
  POINT: 'POINT',
  EVENT_TICKET: 'EVENT_TICKET',
  BRONZE_TICKET: 'BRONZE',
  SILVER_TICKET: 'SILVER',
  GOLD_TICKET: 'GOLD',
};

export const mapApiSlotsToRouletteSlots = (apiSlots: ILuckySpinConfigSlot[]): IRouletteSlot[] =>
  [...apiSlots]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((slot) => ({
      type: API_TO_UI_PRIZE_TYPE[slot.prize_type],
      qty: slot.amount,
      prob: slot.rate ?? 0,
    }));

export const mapRouletteSlotsToApiSlots = (slots: IRouletteSlot[]): ILuckySpinConfigSlot[] =>
  slots.map((slot) => ({
    prize_type: UI_TO_API_PRIZE_TYPE[slot.type],
    amount: slot.qty,
    rate: slot.prob,
  }));

export const getLuckySpinPrizeMeta = (prizeType: ILuckySpinPrizeType) =>
  REWARD_TYPE_META[API_TO_UI_PRIZE_TYPE[prizeType]];

// 슬롯 편집기의 입력 정밀도(수량 step=1, 확률 step=0.1)로 반올림한 뒤 비교한다 —
// 그대로 JSON.stringify로 비교하면 부동소수점 오차 때문에 값을 되돌려도 "미저장"이 안 없어질 수 있다.
export const getSlotsSignature = (slots: IRouletteSlot[]) =>
  JSON.stringify(
    slots.map((s) => ({
      type: s.type,
      qty: Math.round(s.qty),
      prob: Math.round(s.prob * 10) / 10,
    }))
  );
