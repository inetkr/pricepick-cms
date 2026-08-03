import { useCallback, useEffect, useState } from 'react';
import { ticketAPI } from 'src/api';
import type { ILuckySpinLog, ILuckySpinType } from 'src/types/tickets/roulette';

export const useRouletteLogs = (spinType: ILuckySpinType) => {
  const [logs, setLogs] = useState<ILuckySpinLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await ticketAPI.getLuckySpinLogs(page, limit, spinType);
      if (responseData?.result?.object) {
        setLogs(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }
    } catch (error) {
      console.error('Failed to load lucky spin logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, spinType]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSetLimit = useCallback((newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  }, []);

  return {
    logs,
    isLoading,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
  };
};
