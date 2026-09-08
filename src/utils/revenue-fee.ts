import type {
  IAffiliateOrderStatus,
  IAffiliateRevenueGroupBy,
  IAffiliateRevenueMerchantRate,
  IAffiliateRevenueMerchantSort,
  IAffiliateRevenueMetrics,
  IAffiliateRevenueOrder,
  IAffiliateRevenueRange,
  IAffiliateRevenueRangeParams,
  IAffiliateTicketStatus,
  IRevenueFeePeriodMode,
  IRevenueFeeStatusKey,
  IRevenueFeeView,
} from 'src/types/revenue/revenue_fee';

/* ── 제휴 수수료 매출 ─────────────────────────────────────────────────────────
   이 화면의 결론은 「수수료 − 유저 적립 = 수익」이다. 뺄셈도 비율도 서버가 이미 해서
   내려주므로 화면은 다시 계산하지 않는다 — 다시 계산하면 반올림이 갈려 서버 숫자와 어긋난다.
   여기 있는 건 기간 파라미터 만들기와 표기(원·%·상태 이름)뿐이다.
   ───────────────────────────────────────────────────────────────────────── */

/* ── 표기 ── */

export const rfN = (n: number | null | undefined) => (n ?? 0).toLocaleString('ko-KR');
export const rfWon = (n: number | null | undefined) => `${rfN(n)}원`;

// 'YYYY-MM-DD' → 'YYYY/MM/DD'. 서버가 주는 날짜 문자열을 Date 로 되돌리지 않는다 —
// 시간대가 끼면 하루가 밀린다.
export const rfDt = (isoDate: string | null | undefined) =>
  (isoDate ?? '').slice(0, 10).replace(/-/g, '/');

// created_at(ISO)에서 시각만 — 같은 날 건이 여러 건이라 시각 없이는 실구매 기록과 못 맞춘다
export const rfTm = (isoDateTime: string | null | undefined) => {
  if (!isoDateTime) return '';
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
    d.getSeconds()
  ).padStart(2, '0')}`;
};

export const rfDateInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const rfMonthInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/* 비율 표기 — 서버가 준 값을 그대로 쓴다. null 이면 아무것도 안 붙인다(0%로 적으면
   「0이다」와 「알 수 없다」가 같아 보인다). 딱 떨어지면 정수, 아니면 소수 두 자리. */
export const rfRateLabel = (rate: number | null | undefined): string => {
  if (rate === null || rate === undefined || Number.isNaN(rate)) return '';
  return rate % 1 === 0 ? String(rate) : rate.toFixed(2);
};

// 카드 꼬리말처럼 소수 두 자리로 고정해 읽는 자리
export const rfRateFixed = (rate: number | null | undefined, digits = 2): string =>
  rate === null || rate === undefined || Number.isNaN(rate) ? '—' : rate.toFixed(digits);

export const rfMatch = (text: string | null | undefined, query: string) =>
  String(text ?? '')
    .toLowerCase()
    .includes((query || '').toLowerCase());

export const RF_EMPTY_METRICS: IAffiliateRevenueMetrics = {
  order_count: 0,
  transaction_amount: 0,
  commission_amount: 0,
  user_accrual_amount: 0,
  commission_rate: null,
  user_accrual_rate: null,
  profit_amount: 0,
  profit_rate_p: null,
};

/* ── 조회 기간 ── */

export const RF_VIEW_TO_GROUP_BY: Record<IRevenueFeeView, IAffiliateRevenueGroupBy> = {
  month: 'MONTH',
  day: 'DAY',
  range: 'RANGE',
};

export const RF_VIEW_NAME: Record<IRevenueFeeView, string> = {
  month: '월별',
  day: '일별',
  range: '기간별',
};

// 화면의 「하루 / 한 달 / 기간 지정」을 서버 파라미터로 바꾼다 — 셋 중 하나만 실려 나간다
export const rfRangeParams = (
  mode: IRevenueFeePeriodMode,
  values: { day: string; month: string; from: string; to: string }
): IAffiliateRevenueRangeParams => {
  if (mode === 'day') return { range_type: 'DAY', date: values.day };
  if (mode === 'month') return { range_type: 'MONTH', month: values.month };
  // 거꾸로 고른 날짜는 여기서 바로잡는다 — 서버까지 보내 빈 결과를 받게 두지 않는다
  const [from, to] = values.from > values.to ? [values.to, values.from] : [values.from, values.to];
  return { range_type: 'RANGE', from, to };
};

// 기간별 한 줄을 골랐을 때 그 구간으로 다시 부르는 파라미터
export const rfRangeFromPeriodRow = (row: {
  period_start: string;
  period_end: string;
}): IAffiliateRevenueRangeParams => ({
  range_type: 'RANGE',
  from: row.period_start,
  to: row.period_end,
});

// 서버가 되돌려 준 구간을 그대로 적는다 — 화면이 요청한 값이 아니라 실제 조회된 구간이다
export const rfRangeLabel = (range?: IAffiliateRevenueRange | null) =>
  range ? `${rfDt(range.from)} ~ ${rfDt(range.to)}` : '—';

/* 기간별 표의 한 줄 제목·꼬리말.
   MONTH 는 'YYYY-MM', DAY 는 'YYYY-MM-DD', RANGE 는 구간 전체가 한 줄로 온다. */
export const RF_WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

export const rfPeriodRowLabel = (
  row: { period: string; period_start: string; period_end: string },
  groupBy: IAffiliateRevenueGroupBy
) => {
  if (groupBy === 'MONTH') return row.period;
  if (groupBy === 'DAY') return row.period.slice(5).replace('-', '/');
  return `${rfDt(row.period_start)} ~ ${rfDt(row.period_end)}`;
};

export const rfPeriodRowSub = (
  row: { period: string; period_start: string; period_end: string },
  groupBy: IAffiliateRevenueGroupBy
) => {
  if (groupBy === 'DAY') {
    const d = new Date(`${row.period}T00:00:00`);
    return Number.isNaN(d.getTime()) ? '' : `${RF_WEEKDAY_KO[d.getDay()]}요일`;
  }
  if (groupBy === 'MONTH')
    return `${rfDt(row.period_start).slice(5)} ~ ${rfDt(row.period_end).slice(5)}`;
  return '한 덩어리로 봅니다';
};

/* 쿠팡 카드 꼬리말 — 「티켓 적립 설정」에서 정한 요율을 서버가 실어 보낸 값이다.
   두 탭이 서로 다른 수수료율을 적고 있으면 어느 쪽이 맞는지 물어보게 되므로 한 곳에서 만든다.
   is_accrual_rate_applied 가 false 면 적립률이 실제로는 안 걸린 상태라 그렇게 적는다. */
export const rfMerchantRateNote = (rate?: IAffiliateRevenueMerchantRate | null): string => {
  if (!rate) return '';
  const fee = rfRateFixed(rate.configured_commission_rate);
  const accrual = rfRateFixed(rate.configured_accrual_rate);
  const profit = rfRateFixed(rate.configured_profit_rate_p);
  const note = `수수료 ${fee}% → 적립률 ${accrual}% = 수익 ${profit}%p`;
  return rate.is_accrual_rate_applied ? note : `${note} · 적립률 미적용`;
};

/* ── 상태 ──
   서버는 두 축으로 내려준다: status(구매가 확정됐는가)와 ticket_status(티켓을 줬는가).
   화면의 「상태」 칸이 묻는 것은 뒤쪽이므로 ticket_status 를 앞세우되, 주문이 취소됐는데
   티켓은 아직 안 준 건은 「취소」로 적는다 — 「환수」는 이미 준 것을 도로 뺏은 경우뿐이다. */
const TICKET_STATUS_TO_KEY: Record<IAffiliateTicketStatus, IRevenueFeeStatusKey> = {
  NOT_GRANTED: 'not_granted',
  PENDING: 'pending_grant',
  GRANTED: 'granted',
  PARTIALLY_GRANTED: 'partially_granted',
  REJECTED_LIMIT: 'rejected_limit',
  REVOKED: 'clawed_back',
};

export const rfStatusKey = (
  order: Pick<IAffiliateRevenueOrder, 'status' | 'ticket_status'>
): IRevenueFeeStatusKey => {
  // 환수는 「이미 준 것을 도로 뺏었다」라 주문 취소보다 먼저 본다 — 둘 다 해당하는 건이 그렇다
  if (order.ticket_status === 'REVOKED') return 'clawed_back';
  if (order.status === 'CANCELLED') return 'canceled';
  // 서버가 상태를 새로 늘려도 화면이 깨지지 않게 모르는 값은 「지급 대기」로 둔다
  return TICKET_STATUS_TO_KEY[order.ticket_status] ?? 'pending_grant';
};

export const RF_STATUS_LABEL: Record<IRevenueFeeStatusKey, string> = {
  not_granted: '미지급',
  pending_grant: '지급 대기',
  granted: '지급 완료',
  partially_granted: '일부 지급',
  rejected_limit: '한도 초과',
  canceled: '취소',
  clawed_back: '취소(환수)',
};

/* 배지 색 — 취소 둘은 죽은 건이라 회색 계열로 두되, 받았다 도로 빼앗긴 것만 테두리를 둘러
   갈라 놓는다. 「한도 초과」는 수수료는 들어왔는데 유저에게 티켓이 안 나간 건이라
   눈에 띄어야 한다(한도를 조정할지 판단할 근거다). */
export const RF_STATUS_BADGE: Record<IRevenueFeeStatusKey, string> = {
  not_granted: 'badge badge-gray',
  pending_grant: 'badge badge-amber',
  granted: 'badge badge-green',
  partially_granted: 'badge badge-blue',
  rejected_limit: 'badge badge-red',
  canceled: 'badge badge-gray',
  clawed_back: 'badge badge-gray-out',
};

// 합계에서 빠지는 줄 — 흐리게 그린다. 지워 버리면 왜 합계가 다른지 알 수 없다.
export const rfIsCanceled = (order: Pick<IAffiliateRevenueOrder, 'status' | 'ticket_status'>) => {
  const key = rfStatusKey(order);
  return key === 'canceled' || key === 'clawed_back';
};

// 주문 상태 이름 — 「상태」 칸의 말풍선에 곁들인다(칸을 늘리지 않는다)
export const RF_ORDER_STATUS_LABEL: Record<IAffiliateOrderStatus, string> = {
  PENDING: '접수',
  SETTLING: '정산 중',
  CONFIRMED: '확정',
  CANCEL_REQUESTED: '취소 요청',
  CANCELLED: '취소',
};

// 제휴몰별 정렬 이름 — 값은 서버(merchant_sorts)가 정한다
export const RF_MERCHANT_SORT_LABEL: Record<IAffiliateRevenueMerchantSort, string> = {
  PROFIT_AMOUNT: '수익 많은 순',
  COMMISSION_AMOUNT: '수수료 많은 순',
  TRANSACTION_AMOUNT: '거래액 많은 순',
  ORDER_COUNT: '주문 건수 많은 순',
  PROFIT_RATE: '수익 %p 높은 순',
  MERCHANT_NAME: '제휴몰 이름순',
};

/* 정렬 고르기 옵션 — /filters 의 merchant_sorts 순서를 그대로 따른다.
   상태 거르개와 같은 이유다: 화면에 박아 두면 서버가 정렬을 하나 늘렸을 때 조용히 빠진다. */
export const rfMerchantSortOptions = (sorts: IAffiliateRevenueMerchantSort[] | undefined) =>
  (sorts ?? []).map((v) => ({ value: v, label: RF_MERCHANT_SORT_LABEL[v] ?? v }));

// 정렬을 아직 못 받았을 때 첫 화면에서 쓰는 값 — merchant_sorts 의 첫 항목과 같다
export const RF_DEFAULT_MERCHANT_SORT: IAffiliateRevenueMerchantSort = 'PROFIT_AMOUNT';
// 쿠팡 포스트백에는 주문번호가 애초에 오지 않는다 — 빈 것이 아니라 받을 수 없는 값이다
export const RF_CP_NO_ORDERNO_TITLE =
  '쿠팡 포스트백에는 주문번호가 오지 않습니다. 빈 것이 아니라 받을 수 없는 값입니다.';
