import type {
  ILuckySpinConfigSlot,
  ILuckySpinPrizeType,
  IRouletteRewardType,
  IRouletteSlot,
} from 'src/types/tickets/roulette';

export const REWARD_TYPE_META: Record<
  IRouletteRewardType,
  { label: string; unit: string; unitValue: number }
> = {
  MISS: { label: '꽝', unit: '', unitValue: 0 },
  POINT: { label: '포인트', unit: 'P', unitValue: 0.1 },
  EVENT_TICKET: { label: '이벤트 티켓', unit: '장', unitValue: 40 },
  BRONZE_TICKET: { label: '브론즈 티켓', unit: '장', unitValue: 100 },
  SILVER_TICKET: { label: '실버 티켓', unit: '장', unitValue: 1000 },
  GOLD_TICKET: { label: '골드 티켓', unit: '장', unitValue: 2000 },
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

export const getSlotValue = (slot: IRouletteSlot) =>
  slot.type === 'MISS' ? 0 : REWARD_TYPE_META[slot.type].unitValue * slot.qty;

export const getSlotExpectedValue = (slot: IRouletteSlot) => (getSlotValue(slot) * slot.prob) / 100;

export const getProbabilitySum = (slots: IRouletteSlot[]) =>
  Math.round(slots.reduce((sum, s) => sum + s.prob, 0) * 10) / 10;

export const getTotalExpectedValue = (slots: IRouletteSlot[]) =>
  slots.reduce((sum, s) => sum + getSlotExpectedValue(s), 0);

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
