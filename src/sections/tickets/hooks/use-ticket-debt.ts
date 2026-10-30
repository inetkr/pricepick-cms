import { useEffect, useState } from 'react';
import { ticketAPI } from 'src/api';
import type { ITicketDebt } from 'src/types/tickets/ticket_debt';

// 티켓 내역 > 환수 부채 추적 목록. 위쪽 티켓 이력 거르개와는 상관없이 따로 넘긴다.
export const useTicketDebts = () => {
  const [debts, setDebts] = useState<ITicketDebt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    ticketAPI
      .getTicketDebtList(page, limit)
      .then((res) => {
        if (cancelled) return;
        setDebts(res?.result?.object?.rows ?? []);
        setTotalItems(res?.result?.object?.count ?? 0);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load ticket debts:', error);
        setDebts([]);
        setTotalItems(0);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  const handleSetLimit = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

  return {
    debts,
    isLoading,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / limit)),
  };
};
