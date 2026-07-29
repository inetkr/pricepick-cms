export type DrawRoundStatus = 'ONGOING' | 'UPCOMING' | 'ENDED';

export type IGiftStatus = 'PENDING' | 'SENT';

export type IDrawPrizeTier = {
  tier: number;
  label: string;
  prize_name: string;
  winner_count: number;
};

export type IDrawRoundWinner = {
  tier: number;
  nickname: string;
};

export type IDrawRound = {
  id: string;
  week_start_date: string;
  week_end_date: string;
  status: DrawRoundStatus;
  week_of_month: number;
  label_month: number;
  label_year: number;
  tiers: IDrawPrizeTier[];
  drawn_at: string | null;
  entry_count: number;
  winners: IDrawRoundWinner[];
};

export type IDrawEntryKakaoInfo = {
  email: string | null;
  nickname: string;
  linked_at: string;
};

export type IDrawEntryUser = {
  nickname: string;
  kakao_id: string | number | null;
  kakao_info: IDrawEntryKakaoInfo | null;
};

export type IDrawEntry = {
  id: string;
  round_id: string;
  user_id: string;
  ticket_transaction_id: string;
  entered_at: string;
  is_winner: boolean;
  won_tier: number | null;
  gift_status: IGiftStatus;
  gift_note: string | null;
  created_at: string;
  updated_at: string;
  user: IDrawEntryUser;
};

export type IPrizeDrawTemplateConfig = {
  key: string;
  configured: boolean;
  value: { tiers: IDrawPrizeTier[] };
  updated_at: string;
};
