import { useState, useEffect, useCallback } from 'react';
import { ticketAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type { ITicket } from 'src/types/tickets/ticket';
import type { ITicketStat } from 'src/types/tickets/ticket_stat';

type IFilters = {
  search: string;
  transaction_type_group: string;
  usage_status: string;
}

export const useTickets = () => {
  const { showMessageIcon } = useDialogMessage();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [stats, setStats] = useState<ITicketStat>({
    total_issued: {
      all: 0,
      bronze: 0,
      event: 0,
      gold: 0,
      silver: 0,
    },
    today_issued: {
      all: 0,
      bronze: 0,
      event: 0,
      gold: 0,
      silver: 0,
    },
    gifticon_purchases_this_month: 0,
    event_ticket_prize_entries: 0,
    fraud_revoked: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    search: '', transaction_type_group: '', usage_status: '',
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

  const manualTicketAction = useCallback(
    async (data: {
      user_identifier: string; // 닉네임 또는 UID
      action: 'ADMIN_ADD' | 'ADMIN_SUB';
      ticket_type: 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT';
      amount: number;
      description: string;
    }) => {
      try {
        const responseData = await ticketAPI.addSubTicket({
          user_identifier: data.user_identifier,
          action: data.action,
          ticket_type: data.ticket_type,
          amount: data.amount,
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
  };
};
