export type IPointTransactionType =
  | 'ATTENDANCE'
  | 'CONVERT_TO_TICKET'
  | 'CONVERT_FROM_TICKET'
  | 'ADMIN_ADD'
  | 'ADMIN_SUB'
  | 'USED'
  | 'EXPIRED';

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
