// ----------------------------------------------------------------------
// GET /gift/admin/products 응답 한 행 그대로 — 화면 전용으로 필드를 새로 짓지 않고
// 이 모델 하나를 목록/상세/토글/저장 어디서나 그대로 쓴다.
// ----------------------------------------------------------------------

export interface IGifticonProductTicketPrice {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export interface IGifticonProduct {
  id: string;
  product_code: string;
  product_name: string;
  brand_name: string;
  image_url: string | null;
  category_id: string;
  category_name: string;
  price_won: number;
  ticket_price: IGifticonProductTicketPrice;
  valid_end: string | null;
  is_active: boolean;
  provider_valid_days: number | null;
}

// ----------------------------------------------------------------------
// GET /gift/admin/products/:id 응답 — 목록 행 필드에 description(기프팅 쿠폰 유의사항)이
// 하나 더 붙는다.
// ----------------------------------------------------------------------

export interface IGifticonProductDetail extends IGifticonProduct {
  description: string | null;
}
