import { useEffect, useState } from 'react';
import { userAPI } from 'src/api';
import type { IUser } from 'src/types/users/user';
import type { IWithdrawalStat } from 'src/types/users/withdrawal_stat';

type IFilters = {
  search: string;
};

export const useWithdrawal = () => {
  const [members, setMembers] = useState<IUser[]>([]);
  const [stats, setStats] = useState<IWithdrawalStat>({
    deleted_this_month: 0,
    deleted_total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({ search: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      ) as IFilters;

      const responseData = await userAPI.getDeletedUserList(page, limit, filter);

      if (responseData && responseData.result && responseData.result.object) {
        setMembers(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }
    } catch (error) {
      console.error('Failed to load withdrawn members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const responseData = await userAPI.getDeletedUserStat();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load withdrawal stats:', error);
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
    loadMembers();
  }, [filters, page, limit]);

  return {
    members,
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
