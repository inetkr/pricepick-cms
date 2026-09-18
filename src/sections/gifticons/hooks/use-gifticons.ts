'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { giftAPI } from 'src/api';
import type { IGifticonOrderListParams } from 'src/api/gift-api';
import {
  GIFTICON_ORDER_DEFAULT_FILTERS,
  type IGifticonOrder,
  type IGifticonOrderFilters,
} from 'src/types/gifticons/gifticon_order';

// ----------------------------------------------------------------------

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const toApiParams = (filters: IGifticonOrderFilters): IGifticonOrderListParams => ({
  keyword: filters.keyword.trim() || undefined,
  product_name: filters.productName.trim() || undefined,
  voucher_code: filters.voucherCode.trim() || undefined,
  status: filters.status || undefined,
  // 기간을 고르지 않았으면 어느 날짜 기준인지도 의미가 없으니 같이 뺀다.
  date_type: filters.from || filters.to ? filters.dateType : undefined,
  from: filters.from || undefined,
  to: filters.to || undefined,
});

export const useGifticonOrders = () => {
  const [orders, setOrders] = useState<IGifticonOrder[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IGifticonOrderFilters>(GIFTICON_ORDER_DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);

  // 응답이 늦게 도착해 이전 조회 결과가 최신 화면을 덮어쓰는 일을 막는다.
  const reqRef = useRef(0);

  useEffect(() => {
    const seq = reqRef.current + 1;
    reqRef.current = seq;
    setIsLoading(true);
    giftAPI
      .getOrderList(page, limit, toApiParams(filters))
      .then((res) => {
        if (reqRef.current !== seq) return;
        const rows = res?.result?.object?.rows ?? [];
        setOrders(rows);
        setTotalItems(res?.result?.object?.count ?? 0);
      })
      .catch((error) => {
        if (reqRef.current !== seq) return;
        console.error('Failed to load gifticon orders:', error);
        toast.error('구매내역을 불러오지 못했습니다.');
        setOrders([]);
        setTotalItems(0);
      })
      .finally(() => {
        if (reqRef.current === seq) setIsLoading(false);
      });
  }, [page, limit, filters]);

  const applyFilters = useCallback((next: IGifticonOrderFilters) => {
    setPage(1);
    setFilters(next);
  }, []);

  const changeLimit = useCallback((size: number) => {
    setPage(1);
    setLimit(size);
  }, []);

  // CSV 내보내기 — 지금 페이지가 아니라 같은 조건에 맞는 전체 건수를 다시 불러온다.
  const exportOrders = useCallback(async (): Promise<IGifticonOrder[]> => {
    const res = await giftAPI.getOrderList(1, Math.max(totalItems, 1), toApiParams(filters));
    return res?.result?.object?.rows ?? [];
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
  };
};
