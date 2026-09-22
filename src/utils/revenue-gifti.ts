import type {
  IGiftiRevenueByPeriod,
  IGiftiRevenueGroupBy,
  IGiftiRevenuePeriodMode,
  IGiftiRevenueRange,
  IGiftiRevenueRangeParams,
  IGiftiRevenueView,
  IGiftiTicketCounts,
  IGiftiTicketGrade,
} from 'src/types/revenue/revenue_gifti';

/* ── Gifti Shop sales revenue ────────────────────────────────────────────────
   Only two things to answer — how much sold per day, which month sold most.
   Won conversion is calculated by the server from settings/ticket_value alone. The
   screen just displays the received value as-is and never multiplies it again —
   doing so would drift from the server the moment a grade's value changed.
   Both by_period and orders are real APIs now (no mock data) — what's left here is
   just building query-range params, display formatting, and a zero-value placeholder
   (gsZeroByPeriod) for the state where no query range has been picked yet.
   ───────────────────────────────────────────────────────────────────────── */

/* ── Display formatting ──
   Uses the same conventions as the affiliate-fee revenue screen. If two screens write
   "1,234원" differently, they can't be read side by side. */

export const gsN = (n: number | null | undefined) => (n ?? 0).toLocaleString('ko-KR');
export const gsWon = (n: number | null | undefined) => `${gsN(n)}원`;

// 'YYYY-MM-DD' → 'YYYY/MM/DD'. Doesn't round-trip the server's date string through Date —
// doing so shifts the date by a day once a timezone gets involved.
export const gsDt = (isoDate: string | null | undefined) =>
  (isoDate ?? '').slice(0, 10).replace(/-/g, '/');

// Time-only from created_at(ISO) — with several orders on the same day, matching an
// order to the real purchase record needs the time, not just the date.
export const gsTm = (isoDateTime: string | null | undefined) => {
  if (!isoDateTime) return '';
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
    d.getSeconds()
  ).padStart(2, '0')}`;
};

export const gsDateInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const gsMonthInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/* ── Tickets-used display ──
   One line per grade. Cramming them onto one line truncates like "Gold 1206 · Silver
   133 · Bronze". Zero-count grades are dropped entirely, largest grade first (the
   accrual rule fills the largest grade first, so that order is the natural reading order). */
export const GS_GRADE_ORDER: IGiftiTicketGrade[] = ['GOLD', 'SILVER', 'BRONZE'];

export const GS_GRADE_KO: Record<IGiftiTicketGrade, string> = {
  GOLD: '골드',
  SILVER: '실버',
  BRONZE: '브론즈',
};

export type IGiftiTicketPart = { grade: IGiftiTicketGrade; count: number };

export const gsTicketParts = (counts: IGiftiTicketCounts | null | undefined): IGiftiTicketPart[] =>
  GS_GRADE_ORDER.map((grade) => ({ grade, count: counts?.[grade] ?? 0 })).filter((p) => p.count > 0);

/* For the "원화 환산액" (won-converted amount) stat card's subtext only — "Gold N ·
   Silver N · Bronze N". Zero-count grades are NOT dropped here; all three grades are
   always listed (this cell follows a different rule than the tickets-used table cell,
   which does drop zeros). No thousands separator — plain numbers as-is. */
export const gsTicketStatSub = (counts: IGiftiTicketCounts | null | undefined) =>
  GS_GRADE_ORDER.map((g) => `${GS_GRADE_KO[g]} ${counts?.[g] ?? 0}`).join(' · ');

/* ── Query range ── */

export const GS_VIEW_TO_GROUP_BY: Record<IGiftiRevenueView, IGiftiRevenueGroupBy> = {
  month: 'MONTH',
  day: 'DAY',
};

export const GS_VIEW_NAME: Record<IGiftiRevenueView, string> = {
  month: '월별',
  day: '일별',
};

/* Turns the screen's "day / month / custom range" choice into server params — only one
   of the three is ever sent. A custom range with both from and to still empty sends
   no range_type at all (the empty-object variant) — same as the default "nothing
   picked" state, since there's no value yet to attach to it; the server reads that as
   "all". Only a swapped-order pair of dates is corrected, and only when neither side
   is empty (the unbounded side is left alone). */
export const gsRangeParams = (
  mode: IGiftiRevenuePeriodMode,
  values: { day: string; month: string; from: string; to: string }
): IGiftiRevenueRangeParams => {
  if (mode === 'day') return { range_type: 'DAY', date: values.day };
  if (mode === 'month') return { range_type: 'MONTH', month: values.month };
  const { from, to } = values;
  if (!from && !to) return {};
  if (from && to && from > to) return { range_type: 'RANGE', from: to, to: from };
  return { range_type: 'RANGE', from, to };
};

// Whether the query-range fields haven't all been picked yet, so there's no range to
// query — day/month mode requires a value, while custom range is always valid even
// empty (read as "all").
export const gsHasRange = (mode: IGiftiRevenuePeriodMode, day: string, month: string) => {
  if (mode === 'day') return !!day;
  if (mode === 'month') return !!month;
  return true;
};

/* The hint shown next to the query-range field — written from what's picked right
   now, without waiting on the server response. In day/month mode with nothing picked
   yet it shows "기간을 고르세요" (pick a range); a custom range with both from and to
   empty isn't blocked — it reads as "전체" (all). */
export const gsPeriodLabel = (
  mode: IGiftiRevenuePeriodMode,
  day: string,
  month: string,
  from: string,
  to: string
) => {
  if (mode === 'day') return day || '기간을 고르세요';
  if (mode === 'month') return month || '기간을 고르세요';
  if (!from && !to) return '전체';
  return `${from || '처음'} ~ ${to || '지금'}`;
};

/* ── Status badge ──
   Cancelled orders are dimmed to gray since they're excluded from the total — with
   the same color as a live order, there'd be no way to tell from the table why it
   wasn't counted in the total. */
export const GS_STATUS_BADGE: Record<string, string> = {
  ISSUED: 'badge-green',
  USED: 'badge-green',
  EXPIRED: 'badge-gray',
  CANCELLED: 'badge-gray-out',
};

export const gsStatusBadgeClass = (status: string) => GS_STATUS_BADGE[status] ?? 'badge-gray';

/* The state where the query-range fields aren't fully picked yet (day/month mode with
   no value selected) — there's no range to query, so nothing is fetched and only a
   zero-filled placeholder is shown. The screen no longer reads the `range` field from
   this (gsPeriodLabel computes the query-range hint separately) — it's just here to
   fill the shape. */
const ZERO_RANGE: IGiftiRevenueRange = { range_type: 'ALL', from: null, to: null };

export const gsZeroByPeriod = (groupBy: IGiftiRevenueGroupBy): IGiftiRevenueByPeriod => ({
  range: ZERO_RANGE,
  group_by: groupBy,
  period_count: 0,
  rows: [],
  total: { sold_count: 0, tickets_used: {}, total_won: 0, cancelled_count: 0 },
});
