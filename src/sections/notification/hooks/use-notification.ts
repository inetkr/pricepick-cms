import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { notificationAPI } from 'src/api';
import { NOTIFICATION_ERROR_MESSAGE } from 'src/constants/notification';
import type { INotification, INotificationStat, ISendNotificationPayload } from 'src/types/notification';

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

export const useNotification = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [stats, setStats] = useState<INotificationStat>({
    sent_this_month: 0,
    scheduled_pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [filters, setFilters] = useState<IFilters>({ title: '', target_audience: '', status: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadNotifications = useCallback(async () => {
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
  }, [filters, page, limit]);

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
        const successMessage = payload.send_type === 'SCHEDULED' ? '알림이 예약되었습니다.' : '알림이 발송되었습니다.';
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

  const sendTestNotification = async (payload: Omit<ISendNotificationPayload, 'is_test'>) => {
    setIsSendingTest(true);
    try {
      await notificationAPI.sendNotification({ ...payload, is_test: true });
      toast.success('테스트 발송이 완료되었습니다. (본인)');
      reload();
      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error(getNotificationErrorMessage(error, '테스트 발송에 실패했습니다.'));
      return false;
    } finally {
      setIsSendingTest(false);
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
    isSendingTest,
    filters,
    setFilters: handleSetFilters,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    sendNotification,
    sendTestNotification,
  };
};
