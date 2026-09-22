// Gifti Shop sales revenue — response types for /api/gift_revenue/admin/*.
// This screen answers exactly two questions — how much sold per day, which month sold most.
// The source of truth is a single gifticon purchase record, and the won conversion
// (ticket → won) is calculated by the server from settings/ticket_value alone —
// if the screen multiplied it again, the numbers would drift from the server's the
// moment a grade's value changed.
// There's no separate summary endpoint — the stat cards reuse the `total` that
// by_period already returns (the whole queried range grouped by MONTH). Calling a
// second endpoint would just recompute the same value twice.

/* ── Query range ──
   The default sends no value at all — range_type itself is omitted, and the server
   reads that as "ALL" and returns the full range. Once day/month/custom range is
   actually picked, range_type and its matching value (date · month · from+to) are
   sent together. */
export type IGiftiRevenueRangeType = 'DAY' | 'MONTH' | 'RANGE' | 'ALL';
export type IGiftiRevenueGroupBy = 'DAY' | 'MONTH';

// One of four — the default "nothing picked yet" state is an empty object (no range_type key at all)
export type IGiftiRevenueRangeParams =
  | { range_type: 'DAY'; date: string }
  | { range_type: 'MONTH'; month: string }
  | { range_type: 'RANGE'; from: string; to: string }
  | Record<string, never>;

// The actual queried range the server echoes back — when nothing was sent, range_type
// comes back as 'ALL' and from/to come back as null.
export type IGiftiRevenueRange = {
  range_type: IGiftiRevenueRangeType;
  from: string | null;
  to: string | null;
};

/* ── Tickets used ──
   One order can mix grades (the rule fills the largest grade first, so gold+silver
   together is normal). Grades may grow over time, so the keys aren't pinned down —
   received as Partial. */
export type IGiftiTicketGrade = 'GOLD' | 'SILVER' | 'BRONZE';

export type IGiftiTicketCounts = Partial<Record<IGiftiTicketGrade, number>>;

/* ── By period (GET /by_period) ──
   Only monthly/daily — there's no "by range (as one lump)". This screen's question
   is "which month sold most," so collapsing everything into one row leaves nothing
   to answer. Field names match the server response as-is (sold_count · tickets_used ·
   total_won) — not renamed to screen-side wording. */
export type IGiftiRevenuePeriodRow = {
  period: string; // 'YYYY-MM' or 'YYYY-MM-DD' — used directly as the drill-down key
  period_start: string;
  period_end: string;
  sold_count: number;
  tickets_used: IGiftiTicketCounts;
  total_won: number;
};

export type IGiftiRevenueByPeriod = {
  range: IGiftiRevenueRange;
  group_by: IGiftiRevenueGroupBy;
  period_count: number;
  rows: IGiftiRevenuePeriodRow[];
  // `total` carries one field the per-period rows don't: cancelled_count. Cancelled
  // orders in the queried range, excluded from sold_count/total_won — the server
  // only sends this on the aggregate, not per row.
  total: Omit<IGiftiRevenuePeriodRow, 'period' | 'period_start' | 'period_end'> & {
    cancelled_count: number;
  };
};

/* ── Per-order (GET /orders?page=&limit=&range_type=DAY&date=YYYY-MM-DD) ──
   The sales for that day once you drill into a single day. The server paginates —
   the pagination info lives outside the result (received as
   ApiResponse<IGiftiRevenueOrderList> & { pagination: ApiPagination }). Member
   identity uses the same 3-line format as other screens (nickname / Kakao ID /
   identified ID), so the fields use the same names. Field names match the server
   response as-is (created_at · won, etc.) — not renamed to screen-side wording. */
export type IGiftiRevenueOrderStatus = 'ISSUED' | 'USED' | 'EXPIRED' | 'CANCELLED';

export type IGiftiRevenueOrderUser = {
  id: string;
  nickname: string | null;
  identified_id: string;
  kakao_id: string | null;
  kakao_email: string | null;
};

export type IGiftiRevenueOrder = {
  id: string;
  order_no: string; // Order number (GO…) issued by the gifticon issuance API
  created_at: string; // ISO
  product_name: string;
  brand_name: string | null;
  tickets_used: IGiftiTicketCounts;
  won: number; // Won conversion for this order — server-computed
  status: IGiftiRevenueOrderStatus;
  status_label: string; // The label to render as-is (uses the wording the server sends)
  user: IGiftiRevenueOrderUser;
};

// `range` isn't echoed here — that comes instead via `pagination` (ApiPagination) outside the result
export type IGiftiRevenueOrderList = {
  count: number;
  rows: IGiftiRevenueOrder[];
};

/* ── Screen state ──
   Drilling down has three levels: monthly → daily → per-order.
   Clicking a month in the monthly table goes to that month's daily table; clicking a
   day in the daily table goes to that day's per-order table. */
export type IGiftiRevenuePeriodMode = 'day' | 'month' | 'range';
export type IGiftiRevenueView = 'month' | 'day';
export type IGiftiRevenueLevel = 'month' | 'day' | 'detail';

// What's currently being viewed — carries the level together with the key (month/day) drilled into at that point
export type IGiftiRevenueDrill = {
  level: IGiftiRevenueLevel;
  month: string; // 'YYYY-MM' — only filled when level is day or detail
  day: string; // 'YYYY-MM-DD' — only filled when level is detail
};
