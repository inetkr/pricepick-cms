import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { notificationAPI } from 'src/api';
import { NOTIFICATION_ERROR_MESSAGE } from 'src/constants/notification';
import type {
  INotification,
  INotificationStat,
  ISendNotificationPayload,
} from 'src/types/notification';

type IFilters = {
  title: string;
  target_audience: string;
  status: string;
};

// 백엔드가 errorService.custom.customError(message, statusCode, type)로 던진 에러는
// axios 인터셉터에 의해 { code, type, message } 형태 그대로 catch (error)에 전달된다.
const getNotificationErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'type' in error) {
    const { type } = error as { type?: unknown };
    if (typeof type === 'string' && NOTIFICATION_ERROR_MESSAGE[type]) {
      return NOTIFICATION_ERROR_MESSAGE[type];
    }
  }
  return fallback;
};

// withHistory — 발송 기록 탭에서만 목록을 불러온다 (수동 발송 탭은 통계만 쓴다)
export const useNotification = ({ withHistory }: { withHistory: boolean }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [stats, setStats] = useState<INotificationStat>({
    sent_this_month: 0,
    scheduled_pending: 0,
  });
  const [isLoading, setIsLoading] = useState(withHistory);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingIndividual, setIsSendingIndividual] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [filters, setFilters] = useState<IFilters>({ title: '', target_audience: '', status: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!withHistory) return;
    setIsLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      ) as IFilters;

      const responseData = await notificationAPI.getNotificationList(page, limit, filter);

      if (responseData && responseData.result && responseData.result.object) {
        setNotifications(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [withHistory, filters, page, limit]);

  const loadStats = useCallback(async () => {
    try {
      const responseData = await notificationAPI.getNotificationStats();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load notification stats:', error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const reload = () => {
    loadStats();
    loadNotifications();
  };

  const sendNotification = async (payload: ISendNotificationPayload) => {
    setIsSaving(true);
    try {
      const responseData = await notificationAPI.sendNotification(payload);
      if (responseData && responseData.result && responseData.result.object) {
        const successMessage =
          payload.send_type === 'SCHEDULED' ? '알림이 예약되었습니다.' : '알림이 발송되었습니다.';
        toast.success(successMessage);
        setPage(1);
        reload();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error(getNotificationErrorMessage(error, '알림 발송에 실패했습니다.'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // 선택 개별 발송 — 고른 회원에게만 즉시 발송, 발송 기록에는 「개별 발송」으로 남는다
  const sendIndividualNotification = async (
    payload: { title: string; content: string },
    userIds: string[]
  ) => {
    if (!userIds.length) {
      toast.error('발송할 회원을 선택하세요.');
      return false;
    }
    setIsSendingIndividual(true);
    try {
      const responseData = await notificationAPI.sendIndividualNotification({
        channel: 'PUSH_APP',
        target_audience: 'INDIVIDUAL',
        target_user_ids: userIds,
        title: payload.title,
        content: payload.content,
        send_type: 'NOW',
        // 서버는 is_test: true를 먼저 보고 테스트 발송(현재 막힘)으로 처리하므로 false로 보낸다
        is_test: false,
      });
      const campaign = responseData?.result?.object?.campaign;
      const success = campaign?.success_count ?? 0;
      const notDone =
        (campaign?.fail_count ?? 0) + (campaign?.skipped_count ?? 0) + (campaign?.unknown_count ?? 0);

      if (!notDone) {
        toast.success(`개별 발송 완료 · ${success.toLocaleString()}명`);
      } else {
        // 누가 왜 못 받았는지는 발송 기록에서 그 건을 눌러 수신자 목록으로 본다
        toast.warning(
          `개별 발송 · 성공 ${success.toLocaleString()}명 / 실패 ${(campaign?.fail_count ?? 0).toLocaleString()}명 / 미처리 ${(campaign?.skipped_count ?? 0).toLocaleString()}명`,
          { description: '발송 기록에서 해당 건을 누르면 회원별 결과를 볼 수 있습니다.' }
        );
      }
      reload();
      return true;
    } catch (error) {
      console.error('Failed to send individual notification:', error);
      toast.error(getNotificationErrorMessage(error, '개별 발송에 실패했습니다.'));
      return false;
    } finally {
      setIsSendingIndividual(false);
    }
  };

  // 예약 건 취소 — 발송 전인 예약 건만. 취소한 건은 목록에 「예약 / 취소됨」으로 남는다
  const cancelScheduledNotification = async (notification: INotification) => {
    if (notification.status !== 'SCHEDULED') return false;
    setIsCancelling(true);
    try {
      await notificationAPI.cancelScheduledNotification(notification.id);
      toast.success('예약 발송이 취소되었습니다.');
      reload();
      return true;
    } catch (error) {
      console.error('Failed to cancel scheduled notification:', error);
      toast.error(getNotificationErrorMessage(error, '예약 취소에 실패했습니다.'));
      // 그 사이 발송됐거나 이미 취소된 경우 — 목록을 새로 받아 실제 상태를 보여 준다
      reload();
      return false;
    } finally {
      setIsCancelling(false);
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

  return {
    notifications,
    stats,
    isLoading,
    isSaving,
    isSendingIndividual,
    isCancelling,
    filters,
    setFilters: handleSetFilters,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    sendNotification,
    sendIndividualNotification,
    cancelScheduledNotification,
  };
};
