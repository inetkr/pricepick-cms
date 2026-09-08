'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { postbackAPI } from 'src/api';
import type { ApiPagination } from 'src/types/api_response';
import type {
  IPostbackCoupangFilters,
  IPostbackLinkpriceFilters,
  IPostbackLog,
  IPostbackMerchantOption,
  IPostbackTab,
} from 'src/types/postback/postback';
import { PB_TAB_SOURCE } from 'src/utils/postback';

/* ── 포스트백 로그 ───────────────────────────────────────────────────────────
   서버가 받는 것은 page · limit · source · keyword · action 뿐이다.
   탭(쿠팡/링크프라이스)은 source 하나로 갈리고, 탭마다 자기 검색·거르개를 따로 든다 —
   한쪽에 걸러도 다른 쪽은 그대로다.

   조건은 「검색」을 눌러야 나간다. 검색어든 고르는 칸이든 손댄 것은 draft 에만 쌓이고,
   서버로 나가는 값(filters)은 그때 한 번에 바뀐다 — 칸을 하나 고칠 때마다 부르면
   검색어와 구분을 함께 바꾸려던 사이에 쓸데없는 조회가 끼어든다.
   그리고 누를 때마다 한 번은 나간다: 조건이 그대로여도 다시 불러온다.
   ───────────────────────────────────────────────────────────────────────── */

// 서버 기본값과 같은 쪽 크기
const PAGE_SIZE = 20;

const COUPANG_EMPTY: IPostbackCoupangFilters = { search: '', kind: 'ALL' };
const LINKPRICE_EMPTY: IPostbackLinkpriceFilters = { search: '', merchantId: '' };

export const usePostback = () => {
  const [tab, setTab] = useState<IPostbackTab>('coupang');

  /* 탭마다 두 벌씩 — 손대는 중인 값(draft)과 서버로 나간 값(filters).
     「검색」을 누르기 전까지 둘이 갈라져 있는 것이 이 화면의 규칙이다. */
  const [coupangDraft, setCoupangDraft] = useState<IPostbackCoupangFilters>(COUPANG_EMPTY);
  const [coupangFilters, setCoupangFilters] = useState<IPostbackCoupangFilters>(COUPANG_EMPTY);
  const [linkpriceDraft, setLinkpriceDraft] = useState<IPostbackLinkpriceFilters>(LINKPRICE_EMPTY);
  const [linkpriceFilters, setLinkpriceFilters] =
    useState<IPostbackLinkpriceFilters>(LINKPRICE_EMPTY);

  /* 「검색」을 누른 횟수 — 조회를 부르는 방아쇠다.
     조건만 보고 부르면 같은 조건으로 다시 누를 때 아무 일도 일어나지 않는다:
     누른 사람은 새로 불러온 줄 알지만 화면은 아까 그대로다. 눌렀으면 한 번은 나간다. */
  const [searchSeq, setSearchSeq] = useState(0);

  const [coupangPage, setCoupangPage] = useState(1);
  const [linkpricePage, setLinkpricePage] = useState(1);

  const [rows, setRows] = useState<IPostbackLog[]>([]);
  const [count, setCount] = useState(0);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCoupang = tab === 'coupang';
  const page = isCoupang ? coupangPage : linkpricePage;
  const keyword = isCoupang ? coupangFilters.search : linkpriceFilters.search;
  // 구분(action)은 쿠팡 탭에만 있다 — 링크프라이스 툴바에는 그 칸이 없다
  const action = isCoupang ? coupangFilters.kind : 'ALL';

  /* 응답이 늦게 도착해 이전 조회 결과가 최신 화면을 덮어쓰는 일을 막는다 —
     탭을 빠르게 두 번 누르면 실제로 일어난다. */
  const listReq = useRef(0);

  useEffect(() => {
    const seq = listReq.current + 1;
    listReq.current = seq;
    setIsLoading(true);
    postbackAPI
      .getList({
        page,
        limit: PAGE_SIZE,
        source: PB_TAB_SOURCE[tab],
        keyword: keyword.trim(),
        action,
      })
      .then((res) => {
        if (listReq.current !== seq) return;
        const object = res?.result?.object;
        setRows(object?.rows ?? []);
        setCount(object?.count ?? 0);
        setPagination(res?.pagination ?? null);
      })
      .catch(() => {
        if (listReq.current !== seq) return;
        setRows([]);
        setCount(0);
        setPagination(null);
      })
      .finally(() => {
        if (listReq.current === seq) setIsLoading(false);
      });
  }, [tab, page, keyword, action, searchSeq]);

  /* 머천트 고르는 칸 — 목록은 서버가 따로 내려 준다(value 코드 · label 이름 · count 건수).
     목록이 자주 바뀌지 않아 링크프라이스 탭을 처음 열 때 한 번만 부르고 들고 있는다.
     쿠팡 탭에서는 쓰지 않으므로 그 탭만 보다 나가면 아예 부르지 않는다. */
  const [merchantOptions, setMerchantOptions] = useState<IPostbackMerchantOption[]>([]);
  const merchantsAsked = useRef(false);

  useEffect(() => {
    if (isCoupang || merchantsAsked.current) return;
    merchantsAsked.current = true;
    postbackAPI
      .getMerchants()
      .then((res) => setMerchantOptions(res?.result?.object ?? []))
      .catch(() => {
        /* 목록을 못 받으면 칸은 「전체」만 남는다 — 거르지 못할 뿐 표는 그대로 보인다.
           다음에 탭을 열 때 다시 부르도록 표시를 되돌린다. */
        merchantsAsked.current = false;
        setMerchantOptions([]);
      });
  }, [isCoupang]);

  /* 거르는 것은 여전히 화면 몫이다 — 서버가 merchant_code 를 안 받는다.
     서버가 쪽을 잘라 주므로 이 거르개는 「지금 보고 있는 쪽」에만 걸린다: 목록에는 있지만
     이 쪽에 안 온 머천트를 고르면 0건이 된다(그 머천트가 없는 게 아니라 이 쪽에 없는 것이다).
     서버가 merchant_code 를 받게 되면 keyword·action 처럼 그대로 넘기면 된다. */
  const visibleRows = useMemo(() => {
    if (isCoupang || !linkpriceFilters.merchantId) return rows;
    return rows.filter((r) => r.merchant_code === linkpriceFilters.merchantId);
  }, [rows, isCoupang, linkpriceFilters.merchantId]);

  /* 「검색」 한 번에 그 탭의 조건을 통째로 내보낸다 — 검색어와 고른 값이 함께 바뀐다.
     조건이 바뀌면 1쪽으로 — 3쪽을 보다 걸렀는데 그 조건의 3쪽이 없으면
     빈 화면이 떠서 결과가 없는 줄로 읽힌다. */
  const changeCoupangDraft = useCallback((patch: Partial<IPostbackCoupangFilters>) => {
    setCoupangDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyCoupang = useCallback(() => {
    setCoupangFilters(coupangDraft);
    setCoupangPage(1);
    setSearchSeq((n) => n + 1);
  }, [coupangDraft]);

  const changeLinkpriceDraft = useCallback((patch: Partial<IPostbackLinkpriceFilters>) => {
    setLinkpriceDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyLinkprice = useCallback(() => {
    setLinkpriceFilters(linkpriceDraft);
    setLinkpricePage(1);
    setSearchSeq((n) => n + 1);
  }, [linkpriceDraft]);

  /* 마지막 쪽 판정 — 서버가 총 건수(count)를 주므로 그걸로 센다.
     pagination.next_page 는 다음 쪽 번호일 뿐 「더 있다」는 뜻이 아니어서
     마지막 쪽에서도 값이 차 있는 경우가 있다. */
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return {
    tab,
    // 탭을 옮겨도 저쪽 탭에 걸어 둔 조건과 쪽수는 그대로 남는다
    changeTab: setTab,
    rows: visibleRows,
    count,
    isLoading,
    pagination,
    page,
    totalPages,
    setPage: isCoupang ? setCoupangPage : setLinkpricePage,
    coupang: {
      draft: coupangDraft,
      onDraftChange: changeCoupangDraft,
      onApplySearch: applyCoupang,
    },
    linkprice: {
      draft: linkpriceDraft,
      onDraftChange: changeLinkpriceDraft,
      onApplySearch: applyLinkprice,
      merchantOptions,
    },
  };
};

export type IUsePostback = ReturnType<typeof usePostback>;
