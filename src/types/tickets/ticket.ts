import type { IBase } from '../base';
import type { IPrizeType, IUsageStatus, TicketGrade } from '../common';

export type ITicket = IBase & {
  id: string;
  user_id: string;
  nickname: string;
  identified_id: string;
  kakao_nickname: string;
  description: string;
  ticket_type: TicketGrade;
  amount: number;
  usage_status: IUsageStatus;
};

export type ITicketBreakdown = {
  bronze: number;
  silver: number;
  gold: number;
  event: number;
  random: number;
}
