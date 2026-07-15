import { useState, useEffect, useCallback } from 'react';
import { pointAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type { IPoint } from 'src/types/points/point';
import type { IPointStat } from 'src/types/points/point_stat';

type IFilters = {
  search: string;
  category: string;
  days: string;
};

export const usePoints = () => {
  const { showMessageIcon } = useDialogMessage();
  const [points, setPoints] = useState<IPoint[]>([]);
  const [stats, setStats] = useState<IPointStat>({
    total_accumulated: 0,
    total_transactions: 0,
    used_and_converted: 0,
    total_expired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    search: '',
    category: '',
    days: '',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const buildFilter = (source: IFilters) => {
    const filter: { search?: string; category?: string; days?: number } = {};
    if (source.search) filter.search = source.search;
    if (source.category) filter.category = source.category;
    if (source.days) filter.days = Number(source.days);
    return filter;
  };

  const loadPoints = async () => {
    setIsLoading(true);
    try {
      const responseData = await pointAPI.getPointHistoryList(page, limit, buildFilter(filters));
      if (responseData && responseData.result && responseData.result.object) {
        setPoints(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.max(1, Math.ceil(responseData.result.object.count / limit)));
      }
    } catch (error) {
      console.error('Failed to load points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const responseData = await pointAPI.getPointStat();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const exportPoints = useCallback(async (): Promise<IPoint[]> => {
    const responseData = await pointAPI.getPointHistoryList(
      1,
      totalItems || 1,
      buildFilter(filters)
    );
    if (responseData && responseData.result && responseData.result.object) {
      return responseData.result.object.rows;
    }
    return [];
  }, [filters, totalItems]);

  const manualPointAction = useCallback(
    async (data: {
      user_identifier: string;
      action: 'ADMIN_ADD' | 'ADMIN_SUB';
      amount: number;
      description: string;
    }) => {
      try {
        const responseData = await pointAPI.addSubPoint(data);
        if (responseData && responseData.result) {
          showMessageIcon('포인트가 성공적으로 처리되었습니다.', DialogMessageIcon.success, () => {
            loadPoints();
            loadStats();
          });
        }
      } catch (error) {
        console.error('Failed to process manual point action:', error);
        showMessageIcon('포인트 처리에 실패했습니다.', DialogMessageIcon.alert);
      }
    },
    []
  );

  const handleSetFilters = (newFilters: IFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleSetLimit = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadPoints();
  }, [filters, page, limit]);

  return {
    points,
    stats,
    isLoading,
    filters,
    setFilters: handleSetFilters,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    manualPointAction,
    exportPoints,
  };
};
