import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ticketAPI, userAPI } from 'src/api';
import type { IAdminTicketType } from 'src/types/common';
import type { IUser } from 'src/types/users/user';
import type { IUserStat } from 'src/types/users/user_stat';

type IFilters = {
  search: string;
  account_status: string;
  kakao_status: string;
  marketing_consent: string;
};

// 서버 오류 응답의 type → 안내 문구
const MEMBER_UPDATE_ERROR_MESSAGE: Record<string, string> = {
  status_change_reason_required: '상태를 바꿀 때는 사유를 입력해야 합니다.',
  status_change_reason_too_long: '사유는 500자 이내로 입력해 주세요.',
  account_status_unchanged: '이미 같은 상태입니다.',
  nickname_already_exists: '이미 사용 중인 닉네임입니다.',
  nickname_required: '닉네임을 입력해 주세요.',
};

const getMemberUpdateErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'type' in error) {
    const { type } = error as { type?: unknown };
    if (typeof type === 'string' && MEMBER_UPDATE_ERROR_MESSAGE[type]) {
      return MEMBER_UPDATE_ERROR_MESSAGE[type];
    }
  }
  return '회원 업데이트에 실패했습니다.';
};

export const useMembers = () => {
  const [members, setMembers] = useState<IUser[]>([]);
  const [stats, setStats] = useState<IUserStat>({
    total_users: 0,
    total_normal_users: 0,
    total_blocked_users: 0,
    total_deleted_users: 0,
    total_kakao_linked: 0,
    total_kakao_not_linked: 0,
    total_marketing_consent: 0,
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

      const responseData = await userAPI.getUserList(page, limit, filter);

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

  // 닉네임은 admin/update, 계정 상태는 admin/update_status(사유 필수·이력 기록)로 나눠 보낸다 —
  // admin/update 는 account_status가 들어오면 400을 낸다. 바뀐 것만 보내고, 성공하면 true.
  const updateMember = async (
    original: IUser,
    updated: IUser,
    statusReason: string
  ): Promise<boolean> => {
    const nicknameChanged = updated.nickname !== original.nickname;
    const statusChanged = updated.account_status !== original.account_status;
    if (!nicknameChanged && !statusChanged) return true;

    try {
      if (nicknameChanged) {
        await userAPI.update(updated.id, { nickname: updated.nickname });
      }
      if (statusChanged) {
        await userAPI.updateStatus(updated.id, {
          account_status: updated.account_status,
          reason: statusReason.trim(),
        });
      }
      toast.success('회원 정보가 업데이트되었습니다.');
      return true;
    } catch (error) {
      console.error('Failed to update member:', error);
      toast.error(getMemberUpdateErrorMessage(error));
      return false;
    } finally {
      // 닉네임만 저장되고 상태 변경이 실패한 경우에도 목록이 서버 값과 맞도록 항상 다시 불러온다
      loadMembers();
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

  const grantTicket = useCallback(
    async (data: {
      user_identifier: string; // 닉네임 또는 UID
      action: 'ADMIN_ADD' | 'ADMIN_SUB';
      ticket_type: IAdminTicketType;
      amount: number;
      description: string;
    }) => {
      try {
        const responseData = await ticketAPI.addSubTicket(data);
        if (responseData && responseData.result && responseData.result.object) {
          toast.success(
            data.action === 'ADMIN_SUB'
              ? '티켓이 회수되었습니다.'
              : '티켓이 성공적으로 지급되었습니다.'
          );
          loadMembers();
        }
      } catch (error) {
        console.error('Failed to grant ticket:', error);
        toast.error(
          data.action === 'ADMIN_SUB' ? '티켓 회수에 실패했습니다.' : '티켓 지급에 실패했습니다.'
        );
      }
    },
    []
  );

  return {
    members,
    stats,
    isLoading,
    filters,
    setFilters: handleSetFilters,
    grantTicket,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    updateMember,
  };
};
