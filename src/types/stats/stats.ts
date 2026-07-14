export type IMallCommission = {
  mall_name: string;
  gmv: number;
  commission_rate: number;
  commission_revenue: number;
};

export type IGifticonProfitSummary = {
  gifticon_exchange_value: number;
  wholesale_cost: number;
  gifticon_profit: number;
};

export type ITicketGrade = 'BRONZE' | 'SILVER' | 'GOLD';

export type ITicketCostByGrade = {
  grade: ITicketGrade;
  quantity: number;
  unit_value: number;
  total_cost: number;
};

export type INetProfitSummary = {
  fee_revenue: number;
  gifticon_revenue: number;
  ticket_cost: number;
  net_profit: number;
  net_profit_margin: number;
};

export type IStatsSummary = {
  mall_commissions: IMallCommission[];
  gifticon_profit: IGifticonProfitSummary;
  ticket_cost_by_grade: ITicketCostByGrade[];
  net_profit: INetProfitSummary;
};
