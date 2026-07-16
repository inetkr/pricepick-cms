import { useEffect, useState } from 'react';
import { activityLogAPI } from 'src/api';
import type { IActivityLog } from 'src/types/activity_log';

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<IActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadActivityLogs = async () => {
    setIsLoading(true);
    try {
      const responseData = await activityLogAPI.getActivityLogList(page, limit);
      if (responseData && responseData.result && responseData.result.object) {
        setLogs(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivityLogs();
  }, [page, limit]);

  const handleSetLimit = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

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
