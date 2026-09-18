'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { giftAPI } from 'src/api';
import type { IGifticonProduct } from 'src/types/gifticon-products/gifticon_product';
import { mapGifticonProductFromApi } from 'src/utils/gifticon-products';

// ----------------------------------------------------------------------

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const useGifticonProducts = () => {
  const [products, setProducts] = useState<IGifticonProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);

  // 응답이 늦게 도착해 이전 조회 결과가 최신 화면을 덮어쓰는 일을 막는다.
  const reqRef = useRef(0);

  useEffect(() => {
    const seq = reqRef.current + 1;
    reqRef.current = seq;
    setIsLoading(true);
    giftAPI
      .getProductList(page, limit, keyword.trim() || undefined)
      .then((res) => {
        if (reqRef.current !== seq) return;
        const rows = res?.result?.object?.rows ?? [];
        setProducts(rows.map(mapGifticonProductFromApi));
        setTotalItems(res?.result?.object?.count ?? 0);
      })
      .catch((error) => {
        if (reqRef.current !== seq) return;
        console.error('Failed to load gifticon products:', error);
        toast.error('상품 목록을 불러오지 못했습니다.');
        setProducts([]);
        setTotalItems(0);
      })
      .finally(() => {
        if (reqRef.current === seq) setIsLoading(false);
      });
  }, [page, limit, keyword]);

  const handleSearch = useCallback((value: string) => {
    setPage(1);
    setKeyword(value);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPage(1);
    setLimit(size);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    products,
    setProducts,
    totalItems,
    totalPages,
    isLoading,
    page,
    setPage,
    limit,
    setLimit: handlePageSizeChange,
    keyword,
    handleSearch,
  };
};
