'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { giftiRevenueAPI } from 'src/api';
import type {
  IGiftiRevenueByPeriod,
  IGiftiRevenueDrill,
  IGiftiRevenueOrder,
  IGiftiRevenuePeriodMode,
  IGiftiRevenuePeriodRow,
  IGiftiRevenueRangeParams,
  IGiftiRevenueView,
} from 'src/types/revenue/revenue_gifti';
import {
  GS_VIEW_NAME,
  GS_VIEW_TO_GROUP_BY,
  gsHasRange,
  gsPeriodLabel,
  gsRangeParams,
  gsZeroByPeriod,
} from 'src/utils/revenue-gifti';

// Rows per page for the per-order table — matches the server sample (limit=20)
const ORDERS_PAGE_SIZE = 20;

const MONTH_LEVEL: IGiftiRevenueDrill = { level: 'month', month: '', day: '' };

export const useRevenueGifti = () => {
  /* ── Query range: draft vs. applied ──
     The toolbar's fields are a draft — editing them only updates what's displayed in
     the inputs. Nothing is queried until "조회" (query) is pressed, which copies the
     draft into the applied range below. Only the applied range drives hasRange/
     periodLabel/scopeRange and, through them, the fetches — so results never refetch
     on every keystroke or date pick.
     Both draft and applied start with empty fields — custom range (range) mode,
     from/to left blank. With both from and to empty, it reads as "전체" (all), so the
     initial load still shows the full sales history right away. */
  const [periodMode, setPeriodMode] = useState<IGiftiRevenuePeriodMode>('range');
  const [dayValue, setDayValue] = useState('');
  const [monthValue, setMonthValue] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const [appliedMode, setAppliedMode] = useState<IGiftiRevenuePeriodMode>('range');
  const [appliedDay, setAppliedDay] = useState('');
  const [appliedMonth, setAppliedMonth] = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');

  /* ── Drill-down ──
     Monthly → daily → per-order. Whatever level it's on, the stat cards follow that
     level's range — showing a different period above and below would leave no way to
     tell which numbers to trust. */
  const [drill, setDrill] = useState<IGiftiRevenueDrill>(MONTH_LEVEL);
  const [view, setView] = useState<IGiftiRevenueView>('month');

  // Page number for the per-order table — resets to page 1 when drilling into a new
  // date or leaving that level
  const [ordersPage, setOrdersPage] = useState(1);

  const resetDrill = useCallback(() => {
    setDrill(MONTH_LEVEL);
    setOrdersPage(1);
  }, []);

  // The "조회" (query) button — commits the draft fields to the applied query and
  // folds up any active drill-down position, since the month/day it pointed to isn't
  // guaranteed to still be within the newly applied range
  const reload = useCallback(() => {
    setAppliedMode(periodMode);
    setAppliedDay(dayValue);
    setAppliedMonth(monthValue);
    setAppliedFrom(fromValue);
    setAppliedTo(toValue);
    resetDrill();
  }, [periodMode, dayValue, monthValue, fromValue, toValue, resetDrill]);

  const hasRange = gsHasRange(appliedMode, appliedDay, appliedMonth);

  // The toolbar's own hint — reflects the draft fields as they're being edited, so it
  // updates the moment the mode/day/month/range picker changes, before "조회" is
  // pressed. This is a preview of what pressing "조회" will search for, not what's
  // currently on screen.
  const periodLabel = useMemo(
    () => gsPeriodLabel(periodMode, dayValue, monthValue, fromValue, toValue),
    [periodMode, dayValue, monthValue, fromValue, toValue]
  );

  // The stat cards' scope hint — reflects the applied query (what the screen is
  // actually showing), not the fields mid-edit, so it never describes a scope the
  // data doesn't match
  const appliedPeriodLabel = useMemo(
    () => gsPeriodLabel(appliedMode, appliedDay, appliedMonth, appliedFrom, appliedTo),
    [appliedMode, appliedDay, appliedMonth, appliedFrom, appliedTo]
  );

  /* ── What comes back from the server ──
     No separate call for the stat cards — they reuse byPeriod's `total`. */
  const [byPeriod, setByPeriod] = useState<IGiftiRevenueByPeriod | null>(null);
  const [isPeriodLoading, setIsPeriodLoading] = useState(true);

  const [orders, setOrders] = useState<IGiftiRevenueOrder[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  /* Guards against a late response overwriting the latest screen state with a stale
     query result — this genuinely happens when the range is changed twice quickly,
     or when months are clicked in rapid succession. */
  const periodReq = useRef(0);
  const ordersReq = useRef(0);

  /* ── The range currently being viewed ──
     Narrows to the drilled-down position when there is one. In day/month mode with
     nothing applied yet, there's no range to query (null) — in that case nothing is
     fetched and only a zero-filled placeholder is shown.
     The per-order (detail) level always drills down to single-day granularity — since
     the per-order API only accepts range_type=DAY&date=…, it's sent as DAY directly
     rather than faked with RANGE(from=to). */
  const scopeRange = useMemo<IGiftiRevenueRangeParams | null>(() => {
    if (drill.level === 'detail' && drill.day) return { range_type: 'DAY', date: drill.day };
    if (drill.level === 'day' && drill.month) return { range_type: 'MONTH', month: drill.month };
    if (!hasRange) return null;
    return gsRangeParams(appliedMode, {
      day: appliedDay,
      month: appliedMonth,
      from: appliedFrom,
      to: appliedTo,
    });
  }, [drill, hasRange, appliedMode, appliedDay, appliedMonth, appliedFrom, appliedTo]);

  // Drilling down follows monthly → daily automatically (no need to pick it separately)
  const effectiveView: IGiftiRevenueView = drill.level === 'month' ? view : 'day';
  const groupBy = GS_VIEW_TO_GROUP_BY[effectiveView];

  /* ── By-period table + summary ──
     Not fetched once drilled down to the per-order level — that level only shows
     that single day's individual orders. */
  useEffect(() => {
    if (drill.level === 'detail') return;

    const reqId = periodReq.current + 1;
    periodReq.current = reqId;

    if (!scopeRange) {
      setByPeriod(gsZeroByPeriod(groupBy));
      setIsPeriodLoading(false);
      return;
    }

    setIsPeriodLoading(true);
    giftiRevenueAPI
      .getByPeriod(scopeRange, groupBy)
      .then((res) => {
        if (periodReq.current !== reqId) return;
        setByPeriod(res.result.object);
        setIsPeriodLoading(false);
      })
      .catch(() => {
        if (periodReq.current !== reqId) return;
        setByPeriod(null);
        setIsPeriodLoading(false);
      });
  }, [scopeRange, groupBy, drill.level, drill.month]);

  /* ── Per-order table ── only fetched once a day has been drilled into */
  useEffect(() => {
    if (drill.level !== 'detail' || !scopeRange) {
      setOrders([]);
      setOrdersCount(0);
      return;
    }

    const reqId = ordersReq.current + 1;
    ordersReq.current = reqId;
    setIsOrdersLoading(true);

    giftiRevenueAPI
      .getOrders({ page: ordersPage, limit: ORDERS_PAGE_SIZE, range: scopeRange })
      .then((res) => {
        if (ordersReq.current !== reqId) return;
        setOrders(res.result.object.rows);
        setOrdersCount(res.result.object.count);
        setIsOrdersLoading(false);
      })
      .catch(() => {
        if (ordersReq.current !== reqId) return;
        setOrders([]);
        setOrdersCount(0);
        setIsOrdersLoading(false);
      });
  }, [scopeRange, drill.level, ordersPage]);

  /* ── Drill-down actions ── */
  const drillInto = useCallback(
    (row: IGiftiRevenuePeriodRow) => {
      setOrdersPage(1);
      if (effectiveView === 'month') setDrill({ level: 'day', month: row.period, day: '' });
      else setDrill({ level: 'detail', month: row.period.slice(0, 7), day: row.period });
    },
    [effectiveView]
  );

  const drillUp = useCallback(() => {
    setOrdersPage(1);
    setDrill((prev) =>
      prev.level === 'detail' ? { level: 'day', month: prev.month, day: '' } : MONTH_LEVEL
    );
  }, []);

  // Changing the view selector directly exits any drill-down position — it returns to that view
  const changeView = useCallback((next: IGiftiRevenueView) => {
    setView(next);
    setDrill(MONTH_LEVEL);
    setOrdersPage(1);
  }, []);

  const ordersTotalPages = Math.max(1, Math.ceil(ordersCount / ORDERS_PAGE_SIZE));

  return {
    /* Query range — draft fields bound to the toolbar's inputs */
    periodMode,
    setPeriodMode,
    dayValue,
    setDayValue,
    monthValue,
    setMonthValue,
    fromValue,
    setFromValue,
    toValue,
    setToValue,
    reload,
    hasRange,
    periodLabel,
    appliedPeriodLabel,

    /* Fetched values — the stat cards reuse byPeriod.total as-is */
    summary: byPeriod?.total ?? null,
    isSummaryLoading: isPeriodLoading,
    byPeriod,
    isPeriodLoading,
    orders,
    ordersCount,
    isOrdersLoading,

    /* Drill-down · view */
    drill,
    drillInto,
    drillUp,
    view: effectiveView,
    viewName: GS_VIEW_NAME[effectiveView],
    changeView,
    groupBy,

    rows: byPeriod?.rows ?? [],
    // Number of periods the server counted — not recounted on-screen via rows.length
    // (the received value is trusted as-is)
    periodCount: byPeriod?.period_count ?? 0,

    /* Per-order table pagination */
    ordersPage,
    setOrdersPage,
    ordersTotalPages,
  };
};
