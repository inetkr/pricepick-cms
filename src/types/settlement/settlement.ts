import type { IBase } from '../base';

export type IAffiliateSettlementStatus = 'MATCHED' | 'VERIFYING' | 'ERROR';

export type IAffiliateSettlement = IBase & {
  id: string;
  mall_name: string;
  our_record_amount: number;
  confirmed_amount: number;
  diff_amount: number;
  settlement_cycle: string;
  status: IAffiliateSettlementStatus;
};

export type IMonthlySettlementStatus = 'AGGREGATING' | 'CONFIRMED' | 'PROCESSED';

export type IMonthlySettlement = IBase & {
  id: string;
  month: string;
  estimated_revenue: number;
  confirmed_amount: number | null;
  diff_amount: number | null;
  status: IMonthlySettlementStatus;
};

export type ISettlementDiffReason = {
  label: string;
  description: string;
};
