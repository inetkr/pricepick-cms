// 티켓 단일화 후에는 TICKET 이 온다 — BRONZE/SILVER/GOLD 는 단일화 전 데이터용으로 남겨 둔다
export type ITicketType = 'TICKET' | 'BRONZE' | 'SILVER' | 'GOLD';

export type IConversionRateItem = {
  ticket_type: ITicketType;
  ticket_amount: number;
  point_amount: number;
};

export type IConversionRates = {
  conversion_direction: string;
  is_ticket_to_point_enabled: boolean;
  rates: IConversionRateItem[];
};
