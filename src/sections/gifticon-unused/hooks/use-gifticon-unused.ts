'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { giftAPI } from 'src/api';
import type { IGifticonUnusedOrderListParams } from 'src/api/gift-api';
import {
  GIFTICON_UNUSED_ORDER_DEFAULT_FILTERS,
  type IGifticonOrder,
  type IGifticonUnusedOrderFilters,
} from 'src/types/gifticons/gifticon_order';
import { mapGifticonOrderFromApi } from 'src/utils/gifticon-orders';

// ----------------------------------------------------------------------

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const toApiParams = (filters: IGifticonUnusedOrderFilters): IGifticonUnusedOrderListParams => ({
  keyword: filters.keyword.trim() || undefined,
  product_name: filters.productName.trim() || undefined,
  voucher_code: filters.voucherCode.trim() || undefined,
  // 기간을 고르지 않았으면 어느 날짜 기준인지도 의미가 없으니 같이 뺀다.
  date_type: filters.from || filters.to ? filters.dateType : undefined,
  from: filters.from || undefined,
  to: filters.to || undefined,
});

export const useGifticonUnusedOrders = () => {
  const [orders, setOrders] = useState<IGifticonOrder[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IGifticonUnusedOrderFilters>(
    GIFTICON_UNUSED_ORDER_DEFAULT_FILTERS
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);

  // 응답이 늦게 도착해 이전 조회 결과가 최신 화면을 덮어쓰는 일을 막는다.
  const reqRef = useRef(0);
  // 목록을 다시 부르는 트리거 — 관리자 취소가 성공하면 같은 조건으로 다시 불러온다.
  const [reloadSeq, setReloadSeq] = useState(0);

  useEffect(() => {
    const seq = reqRef.current + 1;
    reqRef.current = seq;
    setIsLoading(true);
    giftAPI
      .getUnusedOrderList(page, limit, toApiParams(filters))
      .then((res) => {
        if (reqRef.current !== seq) return;
        const rows = res?.result?.object?.rows ?? [];
        setOrders(rows.map(mapGifticonOrderFromApi));
        setTotalItems(res?.result?.object?.count ?? 0);
      })
      .catch((error) => {
        if (reqRef.current !== seq) return;
        console.error('Failed to load unused gifticon orders:', error);
        toast.error('미사용 기프티콘 목록을 불러오지 못했습니다.');
        setOrders([]);
        setTotalItems(0);
      })
      .finally(() => {
        if (reqRef.current === seq) setIsLoading(false);
      });
  }, [page, limit, filters, reloadSeq]);

  const applyFilters = useCallback((next: IGifticonUnusedOrderFilters) => {
    setPage(1);
    setFilters(next);
  }, []);

  const changeLimit = useCallback((size: number) => {
    setPage(1);
    setLimit(size);
  }, []);

  const reload = useCallback(() => setReloadSeq((s) => s + 1), []);

  // 관리자 취소 — 성공하면 이 목록(미사용 건)에서는 빠지므로 다시 불러온다.
  const cancelOrder = useCallback(
    async (id: string) => {
      await giftAPI.cancelOrder(id);
      reload();
    },
    [reload]
  );

  // CSV 내보내기 — 지금 페이지가 아니라 같은 조건에 맞는 전체 건수를 다시 불러온다.
  const exportOrders = useCallback(async (): Promise<IGifticonOrder[]> => {
    const res = await giftAPI.getUnusedOrderList(1, Math.max(totalItems, 1), toApiParams(filters));
    const rows = res?.result?.object?.rows ?? [];
    return rows.map(mapGifticonOrderFromApi);
  }, [filters, totalItems]);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    orders,
    totalItems,
    totalPages,
    isLoading,
    page,
    setPage,
    limit,
    setLimit: changeLimit,
    filters,
    applyFilters,
    exportOrders,
    cancelOrder,
  };
};
