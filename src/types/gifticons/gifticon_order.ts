import type { TicketGrade } from 'src/types/common';
import type { IMemberIdentitySummary } from 'src/components/common/member-identity-cell';

// ----------------------------------------------------------------------

export type IGifticonOrderTicketPart = {
  grade: TicketGrade;
  quantity: number;
};

// GET /gift/admin/orders 한 건 — 회원이 티켓을 써서 기프티콘을 교환한 주문(=구매) 기록.
// 상태 문구는 서버의 status_label 대신 getGifticonOrderStatusLabel(status)로 화면에서
// 직접 붙인다 — 검색 조건 드롭다운과 표가 같은 문구를 쓰게 하기 위함이다.
export interface IGifticonOrder {
  id: string;
  orderNo: string;
  productCode: string;
  productName: string;
  imageUrl: string | null;
  priceWon: number;
  ticketsUsed: IGifticonOrderTicketPart[];
  status: string;
  isCancelled: boolean;
  validDays: number | null;
  voucherExpiresAt: string | null;
  voucherCode: string | null;
  issuedAt: string;
  usedAt: string | null;
  createdAt: string;
  userId: string;
  member: IMemberIdentitySummary;
  cancelledAt: string | null;
  cancelReason: string | null;
  cancelNote: string | null;
  refundedTickets: IGifticonOrderTicketPart[];
  refundedTotal: number;
  // 취소 처리 뒤 회원이 들고 있게 된 등급 티켓 — 취소내역의 「보유 티켓」 칸에 쓴다.
  ticketsAfter: IGifticonOrderTicketPart[];
  // ticketsAfter의 원화 환산 합계 — 서버가 계산해 내려준 값을 그대로 쓴다.
  ticketsAfterWon: number | null;
}

// ----------------------------------------------------------------------
// GET /gift/admin/orders 원본 응답
// ----------------------------------------------------------------------

export interface IGifticonOrderApiTicketCounts {
  GOLD?: number;
  SILVER?: number;
  BRONZE?: number;
}

export interface IGifticonOrderApiUser {
  id: string;
  fullname: string | null;
  nickname: string | null;
  username: string | null;
  identified_id: string;
  kakao_id: string | null;
  kakao_email: string | null;
}

export interface IGifticonOrderApiRow {
  id: string;
  order_no: string;
  product_id: string;
  product_code: string;
  product_name: string;
  brand_name: string;
  image_url: string | null;
  price_won: number;
  tickets_used: IGifticonOrderApiTicketCounts;
  tickets_used_total: number;
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
  user: IGifticonOrderApiUser;
  provider: string;
  provider_order_id: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  cancel_reason_label: string | null;
  cancel_note: string | null;
  cancelled_by: string | null;
  refunded_tickets: IGifticonOrderApiTicketCounts;
  refunded_total: number;
  // 취소내역(orders/cancelled) 응답에만 있다 — 구매내역/미사용취소 응답에는 없다.
  tickets_after?: IGifticonOrderApiTicketCounts;
  tickets_after_won?: number;
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
