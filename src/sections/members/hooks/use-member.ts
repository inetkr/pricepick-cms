import { useState, useEffect } from 'react';
import { userAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import { IUser } from 'src/types/users/user';
import { IUserStat } from 'src/types/users/user_stat';

type IFilters = {
  search: string;
  account_status: string;
  kakao_status: string;
  marketing_consent: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<IUser[]>([]);
  const { showMessageIcon } = useDialogMessage();
  const [stats, setStats] = useState<IUserStat>({
    total_users: 0,
    total_kakao_linked: 0,
    total_kakao_not_linked: 0,
    total_marketing_consent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    search: '',
    account_status: '',
    kakao_status: '',
    marketing_consent: '',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadMembers = async () => {
    setIsLoading(true);

    try {
      const filter = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      ) as IFilters;

      const responseData = await userAPI.getUserList(
        page,
        limit,
        filter
      );

      if (responseData && responseData.result && responseData.result.object) {
        setMembers(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }

    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const responseData = await userAPI.getUserStat();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const updateMember = async (updatedMember: IUser) => {
    try {
      const responseData = await userAPI.update(updatedMember.id, {
        nickname: updatedMember.nickname,
        account_status: updatedMember.account_status,
      });
      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('회원 정보가 업데이트되었습니다.', DialogMessageIcon.success, () => {
          loadMembers();
        });
      }
    } catch (error) {
      console.error('Failed to update member:', error);
      showMessageIcon('회원 업데이트에 실패했습니다.', DialogMessageIcon.alert);
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

  // Load members
  useEffect(() => {
    loadStats();
  }, []);

  // Apply filters & pagination
  useEffect(() => {
    loadMembers();
  }, [filters, page, limit]);

    // const grantTicket = useCallback((memberId: number, grade: string, quantity: number) => {
    //   setMembers(prev =>
    //     prev.map(m => {
    //       if (m.id !== memberId) return m;
    //       const key = grade as keyof typeof m.tickets.grade;
    //       return {
    //         ...m,
    //         tickets: {
    //           ...m.tickets,
    //           grade: {
    //             ...m.tickets.grade,
    //             [key]: m.tickets.grade[key] + quantity,
    //           },
    //         },
    //       };
    //     })
    //   );
    // }, []);

  return {
    members,
    stats,
    isLoading,
    filters,
    setFilters: handleSetFilters,
    // grantTicket,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    updateMember
  };
};