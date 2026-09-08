// 제휴 수수료 매출 — /api/affiliate_revenue/admin/* 응답 타입.
// 이 화면의 결론은 「수수료 − 유저 적립 = 수익」 하나이고, 그 뺄셈은 서버가 이미 해서 내려준다.
// 화면은 받은 값을 그대로 보여줄 뿐 다시 계산하지 않는다 — 다시 계산하면 서버 숫자와 어긋난다.

export type IAffiliateRevenueRangeType = 'DAY' | 'MONTH' | 'RANGE';
export type IAffiliateRevenueGroupBy = 'DAY' | 'MONTH' | 'RANGE';

// 조회 기간 파라미터 — 셋 중 하나만 보낸다
export type IAffiliateRevenueRangeParams =
  | { range_type: 'DAY'; date: string }
  | { range_type: 'MONTH'; month: string }
  | { range_type: 'RANGE'; from: string; to: string };

// 서버가 되돌려 주는 실제 조회 구간(요약 카드 옆 기간 표기가 이 값을 쓴다)
export type IAffiliateRevenueRange = {
  range_type: IAffiliateRevenueRangeType;
  from: string;
  to: string;
  date?: string;
  month?: string;
};

/* ── 요약(GET /summary) ──
   다섯 장 카드가 이 응답 하나로 채워진다. 쿠팡·링크프라이스 분리도 서버가 해 준다.
   비율(average_rate·of_commission_rate·rate_p)도 서버 계산값이라 화면에서 다시 나누지 않는다. */
export type IAffiliateRevenueSplitAmount = {
  total: number;
  coupang: number;
  linkprice: number;
};

export type IAffiliateRevenueSummary = {
  range: IAffiliateRevenueRange;
  order_count: IAffiliateRevenueSplitAmount;
  transaction_amount: IAffiliateRevenueSplitAmount;
  commission: IAffiliateRevenueSplitAmount & { average_rate: number | null };
  user_accrual: IAffiliateRevenueSplitAmount & {
    average_rate: number | null;
    of_commission_rate: number | null; // 수수료 대비 적립 비율 — 100%를 넘으면 적자다
  };
  profit: IAffiliateRevenueSplitAmount & { rate_p: number | null };
};

/* ── 건별 내역(GET /orders) ── */
export type IAffiliateOrderSource = 'COUPANG' | 'LINKPRICE';

/* 주문 상태 — 구매가 어디까지 왔는지. 아래 ticket_status(티켓을 줬는지)와는 다른 축이다.
   값 목록은 /filters 의 statuses 가 알려 준다.
     PENDING          접수
     SETTLING         정산 중
     CONFIRMED        확정
     CANCEL_REQUESTED 취소 요청 — 아직 취소되진 않았다
     CANCELLED        취소 */
export type IAffiliateOrderStatus =
  | 'PENDING'
  | 'SETTLING'
  | 'CONFIRMED'
  | 'CANCEL_REQUESTED'
  | 'CANCELLED';

/* 티켓 지급 상태 — 화면의 「상태」 칸이 보여 주는 값이다. 값 목록은 /filters 의 ticket_statuses.
     NOT_GRANTED       미지급 — 줄 대상이 아니었다
     PENDING           지급 대기(대기일 수가 아직 안 지났다)
     GRANTED           지급 완료
     PARTIALLY_GRANTED 일부 지급 — 한도에 걸려 일부만 나갔다
     REJECTED_LIMIT    한도 초과로 미지급 — 하루/한 달 적립 한도에 걸린 건
     REVOKED           취소(환수) — 이미 준 티켓을 도로 뺏었다 */
export type IAffiliateTicketStatus =
  | 'NOT_GRANTED'
  | 'PENDING'
  | 'GRANTED'
  | 'PARTIALLY_GRANTED'
  | 'REJECTED_LIMIT'
  | 'REVOKED';

export type IAffiliateRevenueOrder = {
  id: string;
  order_no: string | null; // 쿠팡은 항상 null — 포스트백에 주문번호가 오지 않는다
  order_key: string;
  order_source: IAffiliateOrderSource;
  order_date: string;
  created_at: string;
  merchant_id: string;
  merchant_code: string;
  merchant_name: string;
  merchant_source: string; // LINKPRICE | MANUAL(쿠팡 등 직계약)
  merchant_img_url: string;
  user_id: string;
  nickname: string;
  identified_id: string;
  transaction_amount: number;
  commission_amount: number;
  commission_rate: number | null; // 취소 건은 null
  user_accrual_amount: number;
  user_accrual_rate: number | null;
  profit_amount: number;
  profit_rate_p: number | null;
  status: IAffiliateOrderStatus;
  ticket_status: IAffiliateTicketStatus;
  ticket_amount: number;
  ticket_unlock_date: string;
};

/* 제휴몰 고르기 칸에 넣는 한 줄 — /orders 와 /filters 가 같은 모양으로 준다.
   merchant_img_url 은 /orders 쪽에만 오므로 선택 항목으로 둔다. */
export type IAffiliateRevenueMerchantOption = {
  id: string;
  merchant_code: string;
  merchant_name: string;
  merchant_source: string; // LINKPRICE | MANUAL(쿠팡 등 직계약)
  order_source: IAffiliateOrderSource;
  merchant_img_url?: string;
  order_count: number; // 조회 구간 안에서 잡힌 주문 수
};

/* 상태 고르기 한 줄 — 값과 이름표를 서버가 함께 준다.
   value 에는 티켓 상태(GRANTED…)와 주문 취소(CANCELLED)가 섞여 오므로
   IAffiliateTicketStatus 로 좁히지 않는다 — 서버가 쥔 값을 그대로 되돌려 보낸다. */
export type IAffiliateRevenueStatusOption = {
  value: string;
  label: string;
  order_count: number;
};

export type IAffiliateRevenueOrderList = {
  rows: IAffiliateRevenueOrder[];
  // 줄과 나란히 오는 거르개 목록 — 제휴몰·상태 칸을 이 값으로 채운다
  merchants: IAffiliateRevenueMerchantOption[];
  ticket_statuses: IAffiliateRevenueStatusOption[];
  count: number;
};

/* ── 기간별·제휴몰별이 함께 쓰는 숫자 묶음 ──
   금액과 비율이 같이 온다. 비율이 null 인 줄은 거래가 없거나 취소된 줄이다. */
export type IAffiliateRevenueMetrics = {
  order_count: number;
  transaction_amount: number;
  commission_amount: number;
  user_accrual_amount: number;
  commission_rate: number | null;
  user_accrual_rate: number | null;
  profit_amount: number;
  profit_rate_p: number | null;
};

/* 설정된 요율 — 「티켓 적립 설정」에서 정한 값을 서버가 그대로 실어 보낸다.
   쿠팡 카드 꼬리말(수수료 3.00% → 적립률 2.00% = 수익 1.00%p)이 이 값을 쓴다. */
export type IAffiliateRevenueMerchantRate = {
  configured_commission_rate: number | null;
  configured_accrual_rate: number | null;
  is_accrual_rate_applied: boolean;
  configured_profit_rate_p: number | null;
};

export type IAffiliateRevenuePeriodRow = IAffiliateRevenueMetrics & {
  period: string;
  period_start: string;
  period_end: string;
};

// 쿠팡·링크프라이스 각각 이 모양으로 한 덩어리씩 온다
export type IAffiliateRevenueGroup<TRow> = {
  rows: TRow[];
  total: IAffiliateRevenueMetrics;
  payout_count: number; // 적립 지급 건수 — 우리 DB 기준이라 주문 건수와 1:1이 아니다
  merchant_rate: IAffiliateRevenueMerchantRate;
};

/* ── 기간별 매출(GET /by_period?group_by=DAY|MONTH|RANGE) ── */
export type IAffiliateRevenueByPeriod = {
  range: IAffiliateRevenueRange;
  group_by: IAffiliateRevenueGroupBy;
  coupang: IAffiliateRevenueGroup<IAffiliateRevenuePeriodRow>;
  linkprice: IAffiliateRevenueGroup<IAffiliateRevenuePeriodRow>;
};

/* ── 제휴몰별(GET /by_merchant) ──
   ⚠️ 응답 예시를 아직 받지 못해 by_period 와 같은 구조(쿠팡/링크프라이스 두 덩어리 +
   rows·total·payout_count·merchant_rate)로 가정했다. rows 에 머천트 식별자가 얹힌 형태다.
   실제 응답이 다르면 revenue-fee-api 의 매핑 한 곳만 고치면 된다. */
export type IAffiliateRevenueMerchantRow = IAffiliateRevenueMetrics & {
  merchant_id: string;
  merchant_code: string;
  merchant_name: string;
  merchant_source: string;
  merchant_img_url: string;
};

export type IAffiliateRevenueByMerchant = {
  range: IAffiliateRevenueRange;
  coupang: IAffiliateRevenueGroup<IAffiliateRevenueMerchantRow>;
  linkprice: IAffiliateRevenueGroup<IAffiliateRevenueMerchantRow>;
};

/* ── 거르개 목록(GET /filters?sort=MERCHANT_NAME) ──
   화면의 고르기 칸들이 쓰는 값을 서버가 한 번에 알려 준다. 목록을 화면에 박아 두면
   서버가 상태를 하나 늘렸을 때 조용히 어긋나므로, 옵션은 이 응답을 그대로 쓴다. */
export type IAffiliateRevenueFilters = {
  range: IAffiliateRevenueRange;
  merchants: IAffiliateRevenueMerchantOption[];
  order_sources: IAffiliateOrderSource[];
  statuses: IAffiliateOrderStatus[];
  ticket_statuses: IAffiliateTicketStatus[];
  // 합계에서 빼는 주문 상태 — 「취소는 합계에서 뺀다」는 규칙의 근거가 이 값이다
  excluded_statuses: IAffiliateOrderStatus[];
  period_groups: IAffiliateRevenueGroupBy[];
  merchant_sorts: IAffiliateRevenueMerchantSort[];
  range_types: IAffiliateRevenueRangeType[];
};

// 제휴몰별 정렬 — /filters 의 merchant_sorts 가 알려 주는 서버 값
export type IAffiliateRevenueMerchantSort =
  | 'PROFIT_AMOUNT'
  | 'COMMISSION_AMOUNT'
  | 'TRANSACTION_AMOUNT'
  | 'ORDER_COUNT'
  | 'PROFIT_RATE'
  | 'MERCHANT_NAME';
/* ── 화면 상태 ── */
export type IRevenueFeePeriodMode = 'day' | 'month' | 'range';
export type IRevenueFeeView = 'month' | 'day' | 'range';

// 「상태」 칸이 쓰는 표시용 키 — ticket_status 와 주문 취소 여부를 합쳐 하나로 만든다
export type IRevenueFeeStatusKey =
  | 'not_granted'
  | 'pending_grant'
  | 'granted'
  | 'partially_granted'
  | 'rejected_limit'
  | 'canceled'
  | 'clawed_back';
