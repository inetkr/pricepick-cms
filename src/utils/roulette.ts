import type {
  ILuckySpinConfigSlot,
  ILuckySpinPrizeType,
  IRouletteRewardType,
  IRouletteSlot,
} from 'src/types/tickets/roulette';

type IRewardTypeMeta = { label: string; unit: string; unitValue?: number };

// unitValue는 label·unit과 달리 MISS·POINT에만 있다 — POINT의 unitValue는 포인트 정책 환율
// (1P = 1원)을 아직 못 읽었을 때 쓰는 기본값이다. 티켓 종류(티켓/이벤트 티켓)는 티켓 가치 설정
// 화면에서 실시간으로 바뀌는 값이라 여기에 하드코딩하지 않는다. 반드시 valueOverrides
// (getTicketValueConfig로 불러온 실제 값)로만 계산한다 — getSlotValue 참고.
export const REWARD_TYPE_META: Record<IRouletteRewardType, IRewardTypeMeta> = {
  MISS: { label: '꽝', unit: '', unitValue: 0 },
  POINT: { label: '포인트', unit: 'P', unitValue: 1 },
  TICKET: { label: '티켓', unit: '장' },
  EVENT_TICKET: { label: '이벤트 티켓', unit: '장' },
};

// 모르는 보상 유형이 와도 화면이 깨지지 않게 받은 값을 그대로 이름으로 쓴다
export const getRewardTypeMeta = (type: string): IRewardTypeMeta =>
  REWARD_TYPE_META[type as IRouletteRewardType] ?? { label: type, unit: '' };

// 서버 기본값(lucky_spin_config.default_slots)을 못 받았을 때만 쓰는 대체값 — 서버 기본값과 같게 둔다
export const DEFAULT_DAILY_ROULETTE_SLOTS: IRouletteSlot[] = [
  { type: 'TICKET', qty: 100, prob: 0.2 },
  { type: 'EVENT_TICKET', qty: 1, prob: 5 },
  { type: 'TICKET', qty: 10, prob: 2 },
  { type: 'POINT', qty: 10, prob: 35 },
  { type: 'POINT', qty: 1, prob: 40 },
  { type: 'MISS', qty: 0, prob: 17.8 },
];

// 기본값의 티켓 수량은 단일화 전 등급 티켓 가치(브론즈 10원·실버 100원·골드 200원)를
// 티켓 1장 10원으로 환산한 것이다 — 보상칸의 원화 가치가 종전과 같다.

export const DEFAULT_JACKPOT_ROULETTE_SLOTS: IRouletteSlot[] = [
  { type: 'TICKET', qty: 20, prob: 0.4 },
  { type: 'TICKET', qty: 10, prob: 1 },
  { type: 'POINT', qty: 1000, prob: 5 },
  { type: 'TICKET', qty: 1, prob: 12 },
  { type: 'POINT', qty: 100, prob: 50 },
  { type: 'MISS', qty: 0, prob: 31.6 },
];

// 티켓 종류(티켓/이벤트 티켓) 슬롯의 1개당 가치(원) — 티켓 가치 설정 화면에서 실시간으로
// 관리하는 값이라 여기서 하드코딩하지 않고, getTicketValueConfig로 불러온 이 값만 계산에 쓴다.
export type RouletteValueOverrides = Partial<Record<IRouletteRewardType, number>>;

export const getSlotValue = (slot: IRouletteSlot, valueOverrides?: RouletteValueOverrides) => {
  if (slot.type === 'MISS') return 0;
  // 포인트 1P의 원화 가치는 포인트 정책 환율(valueOverrides.POINT)을 따르고, 아직 못 읽었을 때만
  // 기본값(1P = 1원)으로 계산한다. 티켓 종류는 실제 값이 아직 로딩 전이면(캐시 없는 상태) 옛 값을
  // 추측해 보여주지 않고 0으로 둔다 — valueOverrides가 도착하는 즉시 재계산된다.
  const unitValue =
    slot.type === 'POINT'
      ? (valueOverrides?.POINT ?? REWARD_TYPE_META.POINT.unitValue ?? 0)
      : (valueOverrides?.[slot.type] ?? 0);
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

// 단일화 전 등급 값(BRONZE·SILVER·GOLD)이 와도 티켓으로 읽는다
const API_TO_UI_PRIZE_TYPE: Record<ILuckySpinPrizeType, IRouletteRewardType> = {
  NO_WIN: 'MISS',
  POINT: 'POINT',
  TICKET: 'TICKET',
  EVENT_TICKET: 'EVENT_TICKET',
  BRONZE: 'TICKET',
  SILVER: 'TICKET',
  GOLD: 'TICKET',
};

const UI_TO_API_PRIZE_TYPE: Record<IRouletteRewardType, ILuckySpinPrizeType> = {
  MISS: 'NO_WIN',
  POINT: 'POINT',
  TICKET: 'TICKET',
  EVENT_TICKET: 'EVENT_TICKET',
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
  getRewardTypeMeta(API_TO_UI_PRIZE_TYPE[prizeType] ?? prizeType);

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
