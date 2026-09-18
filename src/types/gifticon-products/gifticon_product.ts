import type { TicketGrade } from 'src/types/common';

// ----------------------------------------------------------------------

export type IGifticonProductCategory = '커피/음료' | '편의점' | '외식' | '문화/생활' | '쇼핑';

export const GIFTICON_PRODUCT_CATEGORIES: IGifticonProductCategory[] = [
  '커피/음료',
  '편의점',
  '외식',
  '문화/생활',
  '쇼핑',
];

export type IGifticonProductStatus = 'ACTIVE' | 'INACTIVE';

// 판매가격(원)을 등급 티켓(브론즈/실버/골드) 조합으로 환산한 한 조각 — 큰 등급부터 채운다.
export type IGifticonTicketPart = {
  grade: TicketGrade;
  quantity: number;
};

export interface IGifticonProduct {
  id: string;
  // 실제 API는 카테고리 목록을 고정값으로 내려주지 않으므로 category_name 문자열을 그대로 쓴다.
  category: string;
  brand: string;
  name: string;
  code: string;
  // 무기한이면 먼 미래 날짜(2999-12-30 등)를 그대로 담는다 — 화면에서 "무기한"으로
  // 바꿔 부르지 않고 받은 날짜를 그대로 보여준다.
  saleEndDate: string | null;
  // 발급 후 유효 일수. 상품마다 다르며 없으면 null. (API가 아직 내려주지 않는 값)
  validityDays: number | null;
  // 판매가격(원). 등급 티켓 수량은 여기서 매번 계산하며 별도로 저장하지 않는다.
  price: number | null;
  // API가 내려준 등급 티켓 환산값(ticket_price). 서버 계산값이 있으면 그대로 쓰고,
  // 없는 목데이터는 undefined로 두어 화면에서 getGifticonTicketBreakdown으로 계산한다.
  ticketParts?: IGifticonTicketPart[];
  imageUrl: string | null;
  notice: string | null;
  status: IGifticonProductStatus;
}

export type IGifticonProductFormValues = Pick<
  IGifticonProduct,
  'category' | 'name' | 'saleEndDate' | 'validityDays' | 'price' | 'brand' | 'imageUrl' | 'notice'
>;

// ----------------------------------------------------------------------
// GET /gift/admin/products 원본 응답 한 행
// ----------------------------------------------------------------------

export interface IGifticonProductApiTicketPrice {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export interface IGifticonProductApiRow {
  id: string;
  product_code: string;
  product_name: string;
  brand_name: string;
  image_url: string | null;
  category_id: string;
  category_name: string;
  price_won: number;
  ticket_price: IGifticonProductApiTicketPrice;
  valid_end: string | null;
  is_active: boolean;
}

// ----------------------------------------------------------------------
// GET /gift/admin/products/:id 원본 응답 — 목록 행 필드에 상세 전용 필드(description,
// provider_valid_days 등)가 더 붙는다. 화면에서는 그중 description(기프팅 쿠폰 유의사항)과
// provider_valid_days(유효기간)만 쓴다.
// ----------------------------------------------------------------------

export interface IGifticonProductApiDetailRow extends IGifticonProductApiRow {
  description: string | null;
  provider_valid_days: number | null;
}
