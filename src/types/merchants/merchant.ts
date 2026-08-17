export type IMerchantSource = 'LINKPRICE' | 'MANUAL';

// 서버 필터·정렬 파라미터용 승인 상태 — 목록 응답의 lp_status 필드도 이제 이 값 그대로
// 내려온다(과거에는 한글 라벨이었으나 서버가 영문 enum으로 변경됨).
export type IMerchantLpStatusFilter = 'APPROVED' | 'PENDING' | 'REJECTED' | 'NOT_APPLIED';

// GET get_list_cms / GET :id 응답 한 건 — commission_rate·accrual_rate는 소수 정밀도 보존을 위해
// 서버가 문자열로 내려준다("44.10"). 화면에서 쓰는 숫자형 뷰 모델(IAffiliateMall)로 변환해 쓴다.
// MANUAL 소스(쿠팡 등 직계약 제휴몰)는 링크프라이스 카탈로그를 거치지 않아 category·lp_status가
// null로 내려온다.
export type IMerchant = {
  id: string;
  merchant_code: string;
  merchant_name: string;
  category: string | null;
  merchant_source: IMerchantSource;
  lp_status: IMerchantLpStatusFilter | null;
  commission_rate: string;
  accrual_rate: string;
  is_applied: boolean;
  img_url: string | null;
};

export type IMerchantListResult = {
  count: number;
  rows: IMerchant[];
};

export type IMerchantCreatePayload = {
  merchant_code: string;
  merchant_name: string;
  category: string;
  merchant_source: IMerchantSource;
  commission_rate: number;
  accrual_rate: number;
  is_applied: boolean;
};

export type IMerchantUpdatePayload = Partial<{
  merchant_name: string;
  category: string;
  commission_rate: number;
  accrual_rate: number;
  is_applied: boolean;
  lp_status: IMerchantLpStatusFilter;
  img_url: string;
}>;

export type IMerchantUpdateMultiPayload = {
  ids: string[];
  accrual_rate?: number;
  is_applied?: boolean;
};

// GET /merchant/admin/categories 응답 — 링크프라이스 카탈로그가 실제로 쓰는 카테고리 전체 목록.
// 카테고리 필터 select는 이 값을 그대로 옵션으로 쓴다(하드코딩 금지).
export type IMerchantCategoriesResult = {
  categories: string[];
};
