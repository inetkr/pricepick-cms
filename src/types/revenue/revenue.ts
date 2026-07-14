import type { IBase } from '../base';

export type IFeeRevenueStatus = 'NORMAL' | 'ERROR';

export type IFeeRevenue = IBase & {
  id: string;
  mall_name: string;
  nickname: string;
  user_id: string;
  order_number: string;
  purchase_amount: number;
  commission_rate: number;
  commission_amount: number;
  ticket_cost: number;
  status: IFeeRevenueStatus;
};

export type IGifticonRevenueStatus = 'COMPLETED' | 'PENDING';

export type IGifticonRevenue = IBase & {
  id: string;
  product_name: string;
  nickname: string;
  user_id: string;
  exchange_price: number;
  wholesale_cost: number;
  margin: number;
  status: IGifticonRevenueStatus;
};
