// ----------------------------------------------------------------------
// GET /gift/admin/orders 응답 한 행 그대로 — 화면 전용으로 필드를 새로 짓지 않고
// 이 모델 하나를 구매내역/미사용취소/취소내역 어디서나 그대로 쓴다.
// ----------------------------------------------------------------------

// 주문 시점의 티켓 1장 원화 가치 — 티켓 단일화 후 TICKET/EVENT_TICKET 두 가지만 온다
export interface IGifticonOrderTicketValueSnapshot {
  TICKET?: number;
  EVENT_TICKET?: number;
}

export interface IGifticonOrderUser {
  id: string;
  fullname: string | null;
  nickname: string | null;
  username: string | null;
  identified_id: string;
  kakao_id: string | null;
  kakao_email: string | null;
}

export interface IGifticonOrder {
  id: string;
  order_no: string;
  product_id: string;
  product_code: string;
  product_name: string;
  brand_name: string;
  image_url: string | null;
  price_won: number;
  // 티켓 단일화 — 등급별 수량이 아니라 티켓 장수 하나로 온다
  tickets_used: number;
  status: string;
  status_label: string;
  valid_days: number | null;
  voucher_expires_at: string | null;
  issued_at: string;
  used_at: string | null;
  created_at: string;
  voucher_code: string | null;
  voucher_pin: string | null;
  voucher_url: string | null;
  is_simulated: boolean;
  // 탈퇴 등으로 회원 정보가 없으면 null 로 온다
  user: IGifticonOrderUser | null;
  provider: string;
  provider_order_id: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  cancel_reason_label: string | null;
  cancel_note: string | null;
  cancelled_by: string | null;
  refunded_tickets: number;
  // 지금 이 시점 기준으로 회원이 들고 있는 티켓 장수 — 취소내역의 「보유 티켓」 칸에 쓴다.
  tickets_after: number;
  tickets_after_won: number;
  ticket_value_snapshot: IGifticonOrderTicketValueSnapshot;
}

// ----------------------------------------------------------------------
// GET /gift/admin/orders 조회 조건
// ----------------------------------------------------------------------

export type IGifticonOrderStatusFilter = '' | 'ISSUED' | 'USED' | 'EXPIRED' | 'CANCELLED';

// from/to가 어느 날짜 기준인지 — 구매일(PURCHASE) 또는 취소일(CANCEL).
export type IGifticonOrderDateType = 'PURCHASE' | 'CANCEL';

export interface IGifticonOrderFilters {
  status: IGifticonOrderStatusFilter;
  keyword: string;
  productName: string;
  voucherCode: string;
  dateType: IGifticonOrderDateType;
  from: string;
  to: string;
}

export const GIFTICON_ORDER_DEFAULT_FILTERS: IGifticonOrderFilters = {
  status: '',
  keyword: '',
  productName: '',
  voucherCode: '',
  dateType: 'PURCHASE',
  from: '',
  to: '',
};

// ----------------------------------------------------------------------
// GET /gift/admin/orders/unused 조회 조건 — 이 목록은 이미 미사용(ISSUED) 건만 보여주므로
// 상태 거르개가 없다.
// ----------------------------------------------------------------------

export type IGifticonUnusedOrderFilters = Omit<IGifticonOrderFilters, 'status'>;

export const GIFTICON_UNUSED_ORDER_DEFAULT_FILTERS: IGifticonUnusedOrderFilters = {
  keyword: '',
  productName: '',
  voucherCode: '',
  dateType: 'PURCHASE',
  from: '',
  to: '',
};
