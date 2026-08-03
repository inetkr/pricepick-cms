export type IRouletteRewardType =
  | 'MISS'
  | 'POINT'
  | 'EVENT_TICKET'
  | 'BRONZE_TICKET'
  | 'SILVER_TICKET'
  | 'GOLD_TICKET';

export type IRouletteSlot = {
  type: IRouletteRewardType;
  qty: number;
  prob: number;
};

// 매일 행운 룰렛(Lucky Spin) 백엔드 API 계약. 슬롯 보상 유형은 IRouletteRewardType과 이름 체계가
// 다르다(NO_WIN vs MISS, BRONZE vs BRONZE_TICKET 등) — src/utils/roulette.ts의 매핑 함수로 변환한다.
export type ILuckySpinPrizeType = 'NO_WIN' | 'POINT' | 'EVENT_TICKET' | 'BRONZE' | 'SILVER' | 'GOLD';

export type ILuckySpinConfigSlot = {
  prize_type: ILuckySpinPrizeType;
  amount: number;
  position?: number; // GET 응답에만 존재, 슬롯 순서
  rate?: number; // 확률(%)
};

export type ILuckySpinConfig = {
  configured: boolean;
  slots: ILuckySpinConfigSlot[];
  updated_at?: string;
  // 기본값 복원 버튼이 사용할 서버 기본 슬롯 구성 — slots와 동일한 형태.
  default_slots?: ILuckySpinConfigSlot[];
};

export type ILuckySpinStats = {
  total_spins_this_month: number;
  total_won_value_this_month: number;
  expected_value_per_spin: number;
};

export type ILuckySpinJackpotPolicy = {
  daily_limit: number;
  event_ticket_daily_cap: number;
  event_ticket_monthly_cap: number;
  updated_at: string | null;
};

export type ILuckySpinType = 'LUCKY_SPIN' | 'LUCKY_SPIN_JACKPOT';

export type ILuckySpinLogStatus = 'GRANTED' | 'NOT_APPLICABLE';

export type ILuckySpinLog = {
  id: string;
  created_at: string;
  user_id: string;
  nickname: string | null;
  kakao_id: string | null;
  kakao_info: Record<string, any> | null;
  spin_type: ILuckySpinType;
  prize_type: ILuckySpinPrizeType;
  amount: number;
  granted_amount: number;
  status: ILuckySpinLogStatus;
};
