export type IPointTransactionType =
  | 'ATTENDANCE'
  | 'FRIEND_INVITE'
  | 'ONBOARDING'
  | 'LUCKY_SPIN'
  | 'LUCKY_SPIN_JACKPOT'
  | 'CONVERT_FROM_TICKET'
  | 'ADMIN_ADD'
  | 'CONVERT_TO_TICKET'
  | 'EXPIRED'
  | 'ADMIN_SUB'
  | 'COUPANG_FIRST_VIEW';

// /point/admin/transaction_categories — 「전체 유형」 거르개 목록 (적립 / 사용·차감 묶음)
export type IPointTransactionCategory = {
  code: string;
  label: string;
};

export type IPointTransactionCategoryGroup = {
  code: string;
  label: string;
  categories: IPointTransactionCategory[];
};

export type IPoint = {
  id: string;
  user_id: string;
  identified_id: string;
  nickname: string;
  kakao_id: string | null;
  // 카카오톡 ID는 모든 화면에서 이메일(kakao_info.email)로 통일한다 (QA9)
  kakao_info?: { nickname?: string; email?: string; linked_at?: string } | null;
  transaction_type: IPointTransactionType;
  // 서버가 붙여 주는 유형 이름 — 「전체 유형」 거르개(transaction_categories)와 같은 이름이다
  transaction_type_label?: string | null;
  group?: 'EARN' | 'USE' | null;
  group_label?: string | null;
  description: string;
  amount: number;
  balance_after: number;
  created_at: string;
};
