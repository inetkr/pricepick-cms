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
  // 구매 확정 후 랜덤(가지급) 티켓이 등급 티켓으로 전환되기까지 대기하는 일수. 몰마다 값이
  // 다르며, 아직 설정되지 않은 몰은 null로 내려온다. 조회 전용 필드 — CMS에서 수정하지 않는다.
  unlock_days: number | null;
  // 링크프라이스 앱 실적 인정 여부('Y'/'N') — 광고주 조회 API 원문(app_android_yn·app_ios_yn)을
  // 서버가 lp_ 접두사를 붙여 그대로 내려준다. 아직 한 번도 동기화하지 않은 몰은 값이 없다.
  lp_app_android_yn?: 'Y' | 'N' | null;
  lp_app_ios_yn?: 'Y' | 'N' | null;
  // 랜덤티켓 지급 시점 = 링크프라이스가 구매 실적을 전송하는 시점(원문 when_trans). 몰마다 문구가
  // 다르고 여러 줄인 몰도 있어, 줄이거나 다듬지 않고 원문 그대로 받아 화면에서 첫 줄만 보여준다.
  lp_when_trans?: string | null;
};

export type IMerchantListResult = {
  count: number;
  rows: IMerchant[];
};

// GET /merchant/admin/:id 의 raw_detail — 링크프라이스 광고주 조회 오픈 API 응답 원문을 그대로
// 담아 둔 것이다. 필드명·값(줄바꿈, "^"로 이어 붙인 목록, "0.7%" 같은 문자열)을 가공하지 않고
// 받으므로, 화면에서도 원문을 자르거나 다듬지 않고 그대로 보여준다.
export type IMerchantRawDetail = Partial<{
  merchant_id: string;
  merchant_name: string;
  merchant_desc: string;
  merchant_url: string;
  merchant_logo: string;
  click_url: string;
  category_id: string;
  category_name: string;
  // 승인 상태 원문 — APR(승인) · REQ(승인대기) · DEN(거부)
  subscript: string;
  // 실적 인정 범위 — 각 'Y'/'N'
  pc_yn: string;
  mobile_yn: string;
  app_android_yn: string;
  app_ios_yn: string;
  // 리워드 가능 여부 — 'Y'/'N'/'A'(둘 다)
  reward_yn: string;
  deeplink_yn: string;
  // 커미션은 "0.7%", "21% 또는 56,000원"처럼 자유 문자열로 온다 — 숫자로 가정하면 안 된다.
  max_commission_mobile: string;
  max_commission_pc: string;
  // 광고 효과 인정 기간(쿠키 유효 일수)
  return_day: number;
  // 실적 전송 시점 — 몰에 따라 여러 줄이다
  when_trans: string;
  // 정산 방식 — 항목이 "^"로 이어져 온다
  trans_reposition: string;
  commission_payment_standard: string;
  // 커미션 미인정 상품 / 활동 불가 방식 / 앱·브라우저 주의사항
  deny_product: string;
  deny_ad: string;
  notice: string;
}>;

// GET /merchant/admin/:id?fields=["$all"] 응답 — 목록(IMerchant)에 링크프라이스 원문(raw_detail)과
// 링크·동기화 시각이 더 붙는다. 목록에는 없는 값이라 상세 모달을 열 때 이 API를 따로 조회한다.
export type IMerchantDetail = IMerchant & {
  lp_synced_at: string | null;
  click_url: string | null;
  site_url: string | null;
  is_representative: boolean;
  raw_detail: IMerchantRawDetail | null;
  created_at: string;
  updated_at: string;
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

// POST /merchant/admin/sync_linkprice 응답 — 링크프라이스 광고주 조회 API를 지금 불러와
// merchant_source=LINKPRICE 레코드를 갱신한 결과. skipped_manual은 MANUAL 소스(쿠팡 등
// 직계약 제휴몰)라 동기화 대상에서 제외된 건수, disappeared_merchant_codes는 이번 응답에
// 더 이상 나타나지 않은(=링크프라이스 쪽에서 내려간) 몰의 merchant_code 목록이다.
export type IMerchantSyncResult = {
  success: boolean;
  affiliate_id: string;
  total_fetched: number;
  inserted: number;
  updated: number;
  skipped_manual: number;
  invalid_row_count: number;
  no_commission_rate: number;
  disappeared_merchant_codes: string[];
  synced_at: string;
};
