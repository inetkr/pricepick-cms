import { useState, useEffect } from 'react';
import { pointAPI } from 'src/api';
import type { IPoint } from 'src/types/points/point';
import type { IPointStat } from 'src/types/points/point_stat';

type IFilters = {
  search: string;
  type: string;
  period: string;
}

export const usePoints = () => {
  const [points, setPoints] = useState<IPoint[]>([]);
  const [stats, setStats] = useState<IPointStat>({
    total_accumulated: 0,
    today_accumulated: 0,
    total_used: 0,
    expired_this_month: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    search: '', type: '', period: '',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadPoints = async () => {
    setIsLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      ) as IFilters;
      const responseData = await pointAPI.getPointList(page, limit, filter);
      if (responseData && responseData.result && responseData.result.object) {
        setPoints(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
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
  };
};
