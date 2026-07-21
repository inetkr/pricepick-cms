import { useState, useEffect, useCallback } from 'react';
import { ticketAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type { ITicket } from 'src/types/tickets/ticket';
import type { ITicketStat } from 'src/types/tickets/ticket_stat';

type IFilters = {
  search: string;
  transaction_type: string;
  // usage_status: string;
}

export const useTickets = () => {
  const { showMessageIcon } = useDialogMessage();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [stats, setStats] = useState<ITicketStat>({
    total_transactions: 0,
    total_gifticon_purchases: 0,
    total_accumulation_transactions: 0,
    total_expired: 0,
    total_admin_sub: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    search: '', transaction_type: ''
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      ) as IFilters;
      const responseData = await ticketAPI.getTicketList(page, limit, filter);
      if (responseData && responseData.result && responseData.result.object) {
        setTickets(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const responseData = await ticketAPI.getTicketStat();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const exportTickets = useCallback(async (): Promise<ITicket[]> => {
    const filter = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    ) as IFilters;
    const responseData = await ticketAPI.getTicketList(1, totalItems || 1, filter);
    if (responseData && responseData.result && responseData.result.object) {
      return responseData.result.object.rows;
    }
    return [];
  }, [filters, totalItems]);

  const manualTicketAction = useCallback(
    async (data: {
      user_identifier: string; // 닉네임 또는 UID
      action: 'ADMIN_ADD' | 'ADMIN_SUB';
      tickets: { ticket_type: 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT'; amount: number }[];
      description: string;
    }) => {
      try {
        const responseData = await ticketAPI.addSubMultiTicket({
          user_id: data.user_identifier,
          action: data.action,
          tickets: data.tickets,
          description: data.description,
        });

        if (responseData && responseData.result && responseData.result.object) {
          showMessageIcon('티켓이 성공적으로 처리되었습니다.', DialogMessageIcon.success, () => {
            loadTickets();
            loadStats();
          });
        }
      } catch (error) {
        console.error('Failed to process manual ticket action:', error);
        showMessageIcon('티켓 처리에 실패했습니다.', DialogMessageIcon.alert);
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
    loadTickets();
  }, [filters, page, limit]);

  return {
    tickets,
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
    manualTicketAction,
    exportTickets,
  };
};
