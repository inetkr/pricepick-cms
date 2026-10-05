import type { IBase } from '../base';
import type { IUsageStatus, TicketGrade } from '../common';

export type ITicket = IBase & {
  id: string;
  user_id: string;
  nickname: string;
  identified_id: string;
  kakao_info: ITicketKaokaoInfo;
  ticket_type: TicketGrade;
  amount: number;
  description: string;
  usage_status: IUsageStatus;
  // 거래유형 코드 — /ticket/admin/history_categories 의 code
  category?: string;
  merchant_name: string;
};

export type ITicketKaokaoInfo = {
  email: string;
  nickname: string;
  linked_at: string;
}

export type ITicketBreakdown = {
  bronze: number;
  silver: number;
  gold: number;
  event: number;
  random: number;
}

export type ITicketHistoryCategory = {
  code: string;
  label: string;
};
