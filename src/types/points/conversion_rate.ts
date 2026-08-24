export type ITicketType = 'BRONZE' | 'SILVER' | 'GOLD';

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
