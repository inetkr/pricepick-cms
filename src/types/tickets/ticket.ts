import type { IBase } from '../base';
import type { ITicketStatus, ITicketType, ITransactionTypeGroup, IUsageStatus } from '../common';
import type { IKakaoUserInfo } from '../users/user';

export type ITicket = IBase & {
  id: string;
  raw_id: string;
  user_id: string;
  status: ITicketStatus;
  ticket_type: ITicketType;
  net_amount: number;
  reference_id: string;
  description: string;
  ticket_breakdown: ITicketBreakdown;
  content: string;
  first_batch_id: string;
  transaction_type: ITransactionTypeGroup;
  nickname: string;
  username: string;
  kakao_info: IKakaoUserInfo;
  usage_status: IUsageStatus;
};

export type ITicketBreakdown = {
  bronze: number;
  silver: number;
  gold: number;
  event: number;
  random: number;
}
