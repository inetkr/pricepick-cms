export type IPointTransactionType =
  | 'ATTENDANCE'
  | 'FRIEND_INVITE'
  | 'ONBOARDING'
  | 'LUCKY_SPIN'
  | 'CONVERT_FROM_TICKET'
  | 'ADMIN_ADD'
  | 'CONVERT_TO_TICKET'
  | 'EXPIRED'
  | 'ADMIN_SUB';

export type IPoint = {
  id: string;
  user_id: string;
  identified_id: string;
  nickname: string;
  kakao_id: string | null;
  transaction_type: IPointTransactionType;
  description: string;
  amount: number;
  balance_after: number;
  created_at: string;
};
