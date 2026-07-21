import type { IPrizeType } from '../common';

export type ILuckySpinSegmentType = 'MISS' | 'EVENT_TICKET' | 'POINT';

export type ILuckySpinConfig = {
  configured: boolean;
  slots: ILuckySpinConfigSlot[];
}

export type ILuckySpinConfigSlot = {
  amount: number;
  position: number;
  prize_type: IPrizeType;
}
