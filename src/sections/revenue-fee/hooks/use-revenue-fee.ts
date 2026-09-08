'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'src/hooks/use-debounce';
import { affiliateRevenueAPI } from 'src/api';
import type { ApiPagination } from 'src/types/api_response';
import type {
  IAffiliateRevenueByMerchant,
  IAffiliateRevenueByPeriod,
  IAffiliateRevenueFilters,
  IAffiliateRevenueMerchantOption,
  IAffiliateRevenueStatusOption,
  IAffiliateRevenueMerchantSort,
  IAffiliateRevenueOrder,
  IAffiliateRevenuePeriodRow,
  IAffiliateRevenueRangeParams,
  IAffiliateRevenueSummary,
  IRevenueFeePeriodMode,
  IRevenueFeeView,
} from 'src/types/revenue/revenue_fee';
import {
  RF_DEFAULT_MERCHANT_SORT,
  RF_VIEW_NAME,
  RF_VIEW_TO_GROUP_BY,
  rfDateInputValue,
  rfMonthInputValue,
  rfRangeFromPeriodRow,
  rfRangeParams,
  rfMerchantSortOptions,
} from 'src/utils/revenue-fee';

// 기간별 표는 서버가 구간 전체를 한 번에 주므로 화면에서 잘라 보여 준다
const BUCKET_PAGE_SIZE = 12;

// 검색어를 눌러 담는 시간 — 다른 화면의 회원 검색과 같은 값이다
const SEARCH_DEBOUNCE_MS = 500;

// 기본 조회 기간 = 최근 6개월. 30일만 잡으면 티켓 지급 대기(쿠팡 미연동 · 링크프라이스
// 기본이 30일이다)를 막 지날 건뿐이라 「지급 완료」가 통째로 0원으로 찍힌다.
const DEFAULT_RANGE_DAYS = 180;

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const defaultFrom = () => {
  const d = today();
  d.setDate(d.getDate() - (DEFAULT_RANGE_DAYS - 1));
  return d;
};

export type IRevenueFeeOrderFilters = {
  search: string;
  merchantId: string;
  ticketStatus: string;
};

export const useRevenueFee = () => {
  /* ── 조회 기간 ── */
  const [periodMode, setPeriodMode] = useState<IRevenueFeePeriodMode>('range');
  const [dayValue, setDayValue] = useState(() => rfDateInputValue(today()));
  const [monthValue, setMonthValue] = useState(() => rfMonthInputValue(today()));
  const [fromValue, setFromValue] = useState(() => rfDateInputValue(defaultFrom()));
  const [toValue, setToValue] = useState(() => rfDateInputValue(today()));

  // 「조회」를 눌러야 실제로 반영된다 — 날짜를 고르는 도중에 매번 서버를 부르면 정신없다
  const [appliedRange, setAppliedRange] = useState<IAffiliateRevenueRangeParams>(() =>
    rfRangeParams('range', {
      day: rfDateInputValue(today()),
      month: rfMonthInputValue(today()),
      from: rfDateInputValue(defaultFrom()),
      to: rfDateInputValue(today()),
    })
  );

  const [view, setView] = useState<IRevenueFeeView>('month');
  const [selectedPeriod, setSelectedPeriod] = useState<IAffiliateRevenuePeriodRow | null>(null);

  /* ── 서버에서 받아 오는 것들 ── */
  const [summary, setSummary] = useState<IAffiliateRevenueSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [byPeriod, setByPeriod] = useState<IAffiliateRevenueByPeriod | null>(null);
  const [isPeriodLoading, setIsPeriodLoading] = useState(true);

  /* 제휴몰별 — 구간·검색어·정렬을 모두 서버가 처리한다.
     화면에서 거르고 정렬하면 서버가 준 합계와 눈앞의 줄들이 어긋난다. */
  const [byMerchant, setByMerchant] = useState<IAffiliateRevenueByMerchant | null>(null);
  const [isMerchantLoading, setIsMerchantLoading] = useState(true);

  const [orders, setOrders] = useState<IAffiliateRevenueOrder[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [orderPagination, setOrderPagination] = useState<ApiPagination | null>(null);
  /* 제휴몰·상태 고르기 칸은 주문 응답이 함께 주는 목록으로 채운다. 다만 하나를 고른 뒤의
     응답에는 고른 값만 담겨 올 수 있어, 목록은 각자 「아직 고르지 않은」 응답에서만 새로
     받는다 — 그러지 않으면 하나를 고르는 순간 칸이 그 하나로 줄어 되돌아올 길이 없다. */
  const [merchantOptions, setMerchantOptions] = useState<IAffiliateRevenueMerchantOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<IAffiliateRevenueStatusOption[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  /* 거르개 목록 — 제휴몰 명부와 상태 값 목록을 /filters 한 번으로 받아 둔다.
     조회 기간을 바꿀 때마다 다시 부르지 않는다: 매 조회마다 호출이 하나씩 더 붙는데,
     거르개는 고르는 칸을 채우는 값일 뿐이라 그렇게까지 최신일 이유가 없다. */
  const [filterOptions, setFilterOptions] = useState<IAffiliateRevenueFilters | null>(null);

  const reload = useCallback(() => {
    setSelectedPeriod(null); // 조회 기간이 바뀌면 이전 줄 선택은 무효다
    setAppliedRange(
      rfRangeParams(periodMode, {
        day: dayValue,
        month: monthValue,
        from: fromValue,
        to: toValue,
      })
    );
  }, [periodMode, dayValue, monthValue, fromValue, toValue]);

  /* ── 제휴몰별 ── 검색어·정렬은 서버로 보낸다.
     글자를 칠 때마다 부르면 호출이 줄줄이 나가므로 잠깐 눌러 담았다가 보낸다. */
  const [mallSearch, setMallSearch] = useState('');
  const debouncedMallSearch = useDebounce(mallSearch, SEARCH_DEBOUNCE_MS);
  const [mallSort, setMallSort] = useState<IAffiliateRevenueMerchantSort>(RF_DEFAULT_MERCHANT_SORT);
  /* ── 건별 내역 ── 검색어는 제휴몰별과 마찬가지로 눌러 담았다가 보낸다.
     칸에는 친 글자가 바로 보이되(orderFilters.search), 서버로 나가는 값만 늦춘다. */
  const [orderFilters, setOrderFilters] = useState<IRevenueFeeOrderFilters>({
    search: '',
    merchantId: '',
    ticketStatus: '',
  });
  const debouncedOrderSearch = useDebounce(orderFilters.search, SEARCH_DEBOUNCE_MS);
  const [orderSize, setOrderSize] = useState(50);
  const [orderPage, setOrderPage] = useState(1);

  /* ── 서버 호출 ──
     응답이 늦게 도착해 이전 조회 결과가 최신 화면을 덮어쓰는 일을 막는다.
     기간을 빠르게 두 번 바꾸면 실제로 일어난다. */
  const summaryReq = useRef(0);
  const periodReq = useRef(0);
  const merchantReq = useRef(0);
  const ordersReq = useRef(0);

  /* 화면에 들어올 때 딱 한 번. deps 를 비워 두었으므로 조회 기간을 바꿔도 다시 부르지 않는다.
     initialRangeRef 로 첫 기간을 붙잡아 두는 것은 appliedRange 를 deps 에 넣지 않고도
     린트 규칙을 만족시키기 위해서다 — 값이 바뀌어도 이 호출은 다시 일어나지 않는다. */
  const initialRangeRef = useRef(appliedRange);

  useEffect(() => {
    let alive = true;
    affiliateRevenueAPI
      .getFilters({ range: initialRangeRef.current, sort: 'MERCHANT_NAME' })
      .then((res) => {
        if (alive) setFilterOptions(res?.result?.object ?? null);
      })
      .catch(() => {
        if (alive) setFilterOptions(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const seq = summaryReq.current + 1;
    summaryReq.current = seq;
    setIsSummaryLoading(true);
    affiliateRevenueAPI
      .getSummary(appliedRange)
      .then((res) => {
        if (summaryReq.current !== seq) return;
        setSummary(res?.result?.object ?? null);
      })
      .catch(() => {
        if (summaryReq.current === seq) setSummary(null);
      })
      .finally(() => {
        if (summaryReq.current === seq) setIsSummaryLoading(false);
      });
  }, [appliedRange]);

  useEffect(() => {
    const seq = periodReq.current + 1;
    periodReq.current = seq;
    setIsPeriodLoading(true);
    affiliateRevenueAPI
      .getByPeriod(appliedRange, RF_VIEW_TO_GROUP_BY[view])
      .then((res) => {
        if (periodReq.current !== seq) return;
        setByPeriod(res?.result?.object ?? null);
      })
      .catch(() => {
        if (periodReq.current === seq) setByPeriod(null);
      })
      .finally(() => {
        if (periodReq.current === seq) setIsPeriodLoading(false);
      });
  }, [appliedRange, view]);

  // 고른 구간이 없으면 조회 기간 그대로 — 같은 값이면 두 번 부르지 않는다
  const scopeRange = useMemo(
    () => (selectedPeriod ? rfRangeFromPeriodRow(selectedPeriod) : appliedRange),
    [selectedPeriod, appliedRange]
  );

  useEffect(() => {
    const seq = merchantReq.current + 1;
    merchantReq.current = seq;
    setIsMerchantLoading(true);
    affiliateRevenueAPI
      .getByMerchant({
        range: scopeRange,
        sort: mallSort,
        keyword: debouncedMallSearch.trim() || undefined,
      })
      .then((res) => {
        if (merchantReq.current !== seq) return;
        setByMerchant(res?.result?.object ?? null);
      })
      .catch(() => {
        if (merchantReq.current === seq) setByMerchant(null);
      })
      .finally(() => {
        if (merchantReq.current === seq) setIsMerchantLoading(false);
      });
  }, [scopeRange, mallSort, debouncedMallSearch]);

  useEffect(() => {
    const seq = ordersReq.current + 1;
    ordersReq.current = seq;
    setIsOrdersLoading(true);
    affiliateRevenueAPI
      .getOrders({
        page: orderPage,
        limit: orderSize,
        range: appliedRange,
        search: debouncedOrderSearch.trim() || undefined,
        merchantId: orderFilters.merchantId || undefined,
        ticketStatus: orderFilters.ticketStatus || undefined,
      })
      .then((res) => {
        if (ordersReq.current !== seq) return;
        setOrders(res?.result?.object?.rows ?? []);
        setOrderCount(res?.result?.object?.count ?? 0);
        setOrderPagination(res?.pagination ?? null);
        if (!orderFilters.merchantId) {
          setMerchantOptions(res?.result?.object?.merchants ?? []);
        }
        if (!orderFilters.ticketStatus) {
          setStatusOptions(res?.result?.object?.ticket_statuses ?? []);
        }
      })
      .catch(() => {
        if (ordersReq.current !== seq) return;
        setOrders([]);
        setOrderCount(0);
        setOrderPagination(null);
      })
      .finally(() => {
        if (ordersReq.current === seq) setIsOrdersLoading(false);
      });
  }, [
    appliedRange,
    orderPage,
    orderSize,
    debouncedOrderSearch,
    orderFilters.merchantId,
    orderFilters.ticketStatus,
  ]);

  /* ── 기간별 표 쪽나눔 ── */
  const [bucketPage, setBucketPage] = useState(1);
  const changeView = useCallback((next: IRevenueFeeView) => {
    setSelectedPeriod(null);
    setBucketPage(1);
    setView(next);
  }, []);

  // 같은 줄을 다시 누르면 선택이 풀린다
  const selectPeriodRow = useCallback((row: IAffiliateRevenuePeriodRow) => {
    setSelectedPeriod((prev) => (prev && prev.period === row.period ? null : row));
  }, []);

  const clearSelection = useCallback(() => setSelectedPeriod(null), []);

  /* ── 기간별 표 ── */
  const groupBy = byPeriod?.group_by ?? RF_VIEW_TO_GROUP_BY[view];
  const lpRows = byPeriod?.linkprice.rows ?? [];
  const cpRows = byPeriod?.coupang.rows ?? [];
  // 쿠팡·링크프라이스는 같은 구간 격자를 받지만, 한쪽만 비는 응답에서도 줄이 잘리지 않게 긴 쪽을 쓴다
  const bucketRowCount = Math.max(lpRows.length, cpRows.length);
  const bucketTotalPages = Math.max(1, Math.ceil(bucketRowCount / BUCKET_PAGE_SIZE));
  const currentBucketPage = Math.min(bucketPage, bucketTotalPages);
  const sliceStart = (currentBucketPage - 1) * BUCKET_PAGE_SIZE;
  const pagedLpRows = lpRows.slice(sliceStart, sliceStart + BUCKET_PAGE_SIZE);
  // 쿠팡 표는 같은 구간을 나란히 놓고 읽는 표라 같은 쪽을 잘라야 줄이 어긋나지 않는다
  const pagedCpRows = cpRows.slice(sliceStart, sliceStart + BUCKET_PAGE_SIZE);

  const changeOrderFilters = useCallback((next: Partial<IRevenueFeeOrderFilters>) => {
    setOrderPage(1);
    setOrderFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const changeOrderSize = useCallback((size: number) => {
    setOrderPage(1);
    setOrderSize(size);
  }, []);

  const orderTotalPages = Math.max(1, Math.ceil(orderCount / orderSize));

  return {
    // 조회 기간
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

    // 요약 다섯 장
    summary,
    isSummaryLoading,

    // 기간별 매출
    byPeriod,
    isPeriodLoading,
    groupBy,
    view,
    changeView,
    viewName: RF_VIEW_NAME[view],
    lpRowCount: lpRows.length,
    pagedLpRows,
    pagedCpRows,
    bucketPage: currentBucketPage,
    bucketTotalPages,
    setBucketPage,
    selectedPeriod,
    selectPeriodRow,
    clearSelection,

    // 제휴몰별
    byMerchant,
    isMerchantLoading,
    // 서버가 이미 거르고 정렬해 준 줄 그대로
    mallRows: byMerchant?.linkprice.rows ?? [],
    mallSearch,
    setMallSearch,
    mallSort,
    setMallSort,

    // 건별 내역
    orders,
    orderCount,
    orderPagination,
    isOrdersLoading,
    orderFilters,
    changeOrderFilters,
    orderSize,
    changeOrderSize,
    // /filters 의 merchants 를 그대로 쓴다 — 거르개 값(merchant_id)이 곧 이 목록의 id 다
    merchantOptions,
    ticketStatusOptions: statusOptions,
    mallSortOptions: rfMerchantSortOptions(filterOptions?.merchant_sorts),
    orderPage,
    orderTotalPages,
    setOrderPage,
  };
};
