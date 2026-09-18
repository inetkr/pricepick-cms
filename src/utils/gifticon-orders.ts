import type { IMemberIdentitySummary } from 'src/components/common/member-identity-cell';
import type {
  IGifticonOrder,
  IGifticonOrderTicketCounts,
} from 'src/types/gifticons/gifticon_order';
import { formatBrandedProductName, type IGifticonTicketPart } from 'src/utils/gifticon-products';

// ----------------------------------------------------------------------

const TICKET_GRADE_ORDER: Array<'GOLD' | 'SILVER' | 'BRONZE'> = ['GOLD', 'SILVER', 'BRONZE'];

// tickets_used/refunded_tickets/tickets_after는 키가 아예 없을 수도 있다({}) — 없는 등급은
// 0으로 본다.
export const ticketCountsToParts = (
  counts: IGifticonOrderTicketCounts | null | undefined
): IGifticonTicketPart[] =>
  TICKET_GRADE_ORDER.map((grade) => ({ grade, quantity: counts?.[grade] ?? 0 })).filter(
    (p) => p.quantity > 0
  );

// 상품명 칸 — 브랜드명이 상품명에 이미 들어 있으면 겹쳐 붙이지 않는다.
export const getGifticonOrderProductName = (order: IGifticonOrder): string =>
  formatBrandedProductName(order.brand_name, order.product_name);

// 「닉네임 / 카카오톡 ID / 식별 아이디」 칸 — 식별 아이디는 identified_id다. 카카오톡 ID
// 칸에는 kakao_id(내부 숫자 ID)가 아니라 kakao_email을 보여준다. 연동 여부 자체는 kakao_id
// 유무로 판단한다 — 연동돼 있어도 이메일 수집 동의가 없으면 비어 보일 수 있다.
export const getGifticonOrderMember = (order: IGifticonOrder): IMemberIdentitySummary => ({
  nickname: order.user.nickname,
  linkedKakao: !!order.user.kakao_id,
  kakaoLoginId: order.user.kakao_email,
});

export type IGifticonOrderStatusVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

// 상태 배지 색 — 미사용(발급, 아직 유효)은 info, 사용완료는 success, 만료는 warning,
// 취소는 danger. 서버가 새 상태값을 내려줘도 화면이 깨지지 않게 그 외는 회색으로 둔다.
const STATUS_VARIANT: Record<string, IGifticonOrderStatusVariant> = {
  ISSUED: 'info',
  USED: 'success',
  EXPIRED: 'warning',
  CANCELLED: 'danger',
};

export const getGifticonOrderStatusVariant = (status: string): IGifticonOrderStatusVariant =>
  STATUS_VARIANT[status] ?? 'neutral';

// 상태 라벨 — 검색 조건 드롭다운과 표의 상태 칸이 같은 문구를 쓰도록 여기 한 곳에만 둔다.
// (예전에는 표가 서버 status_label을 그대로 보여줘 드롭다운 문구와 어긋났다.)
export const GIFTICON_ORDER_STATUS_OPTIONS: Array<'ISSUED' | 'USED' | 'EXPIRED' | 'CANCELLED'> = [
  'ISSUED',
  'USED',
  'EXPIRED',
  'CANCELLED',
];

export const GIFTICON_ORDER_STATUS_LABEL: Record<string, string> = {
  ISSUED: '미사용',
  USED: '사용완료',
  EXPIRED: '만료',
  CANCELLED: '취소됨',
};

export const getGifticonOrderStatusLabel = (status: string): string =>
  GIFTICON_ORDER_STATUS_LABEL[status] ?? status;

// 취소사유 — cancel_reason_label(한글)이 있으면 그걸 쓰고, 없으면 원본 코드를 그대로 보여준다.
export const getGifticonOrderCancelReason = (order: IGifticonOrder): string | null =>
  order.cancel_reason_label ?? order.cancel_reason;
