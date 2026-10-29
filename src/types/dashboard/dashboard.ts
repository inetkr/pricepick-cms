export type IDashboardTicketType = 'TICKET' | 'EVENT_TICKET';

export type IDashboardSummary = {
  profit_amount: number;
  affiliate_commission_amount: number;
  ticket_accrual_cost_amount: number;
  member_count: number;
  new_member_this_month_count: number;
  issued_ticket_count: number;
  // 티켓·이벤트 티켓별 발행 수 — 발행 티켓 카드에 나눠 보여 준다
  issued_ticket_breakdown?: Partial<Record<IDashboardTicketType, number>>;
  qna_pending_count: number;
};

export type IDashboardUser = {
  nickname: string;
  kakao_email: string | null;
  identified_id: string;
};

export type IDashboardRecentPurchase = {
  id: string;
  merchant_name: string;
  user: IDashboardUser;
  purchase_amount: number;
  ticket_amount: number;
  purchased_at: string;
};

export type IDashboardTopMerchant = {
  rank: number;
  merchant_name: string;
  order_count: number;
};

export type IDashboardTopMember = {
  rank: number;
  user: IDashboardUser;
  month_ticket_amount: number;
  total_ticket_amount: number;
};
