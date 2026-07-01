import { IBase } from '../base';
import { ITicketStatus, ITransactionTypeGroup, IUsageStatus } from '../common';
import { IKakaoUserInfo } from '../users/user';

export type ITicket = IBase & {
  id: string;
  raw_id: string;
  user_id: string;
  status: ITicketStatus;
  ticket_type: string;
  net_amount: number;
  reference_id: string;
  description: string;
  content: string;
  first_batch_id: string;
  transaction_type: ITransactionTypeGroup;
  nickname: string;
  kakao_info: IKakaoUserInfo;
  usage_status: IUsageStatus;
};
