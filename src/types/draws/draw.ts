export type IDrawMode = 'RANDOM' | 'MANUAL';

export type IDrawStatus = 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'COMPLETED';

export type IDrawPrize = {
  rank: string;
  name: string;
  winner_count: number;
};

export type IDraw = {
  id: string;
  round_name: string;
  prizes: IDrawPrize[];
  start_date: string;
  end_date: string;
  ticket_count: number;
  winners: IDrawPrize[] | null;
  draw_mode: IDrawMode | null;
  announce_at: string | null;
  notify_winners: boolean;
  drawn_at: string | null;
  created_at: string;
};
