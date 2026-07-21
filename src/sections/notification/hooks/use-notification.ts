import { useCallback, useEffect, useState } from 'react';
import { notificationAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type {
  ICreateNotificationPayload,
  INotification,
  INotificationStat,
  ISendTestNotificationPayload,
} from 'src/types/notification';

type IFilters = {
  title: string;
};

export const useNotification = () => {
  const { showMessageIcon, showConfirmMessageIcon } = useDialogMessage();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [stats, setStats] = useState<INotificationStat>({
    sent_this_month: 0,
    avg_open_rate: 0,
    scheduled_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [filters, setFilters] = useState<IFilters>({ title: '' });
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

  const createNotification = async (payload: ICreateNotificationPayload) => {
    setIsSaving(true);
    try {
      const responseData = await notificationAPI.createNotification(payload);
      if (responseData && responseData.result && responseData.result.object) {
        const successMessage = payload.scheduled_at
          ? '알림이 예약되었습니다.'
          : '알림이 발송되었습니다.';
        showMessageIcon(successMessage, DialogMessageIcon.success, () => {
          setPage(1);
          reload();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create notification:', error);
      showMessageIcon('알림 발송에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const sendTestNotification = async (payload: ISendTestNotificationPayload) => {
    try {
      await notificationAPI.sendTestNotification(payload);
      showMessageIcon('테스트 발송이 완료되었습니다. (본인)', DialogMessageIcon.success);
      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      showMessageIcon('테스트 발송에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    }
  };

  const cancelNotification = (notification: INotification) => {
    showConfirmMessageIcon(
      `'${notification.title}' 예약 발송을 취소하시겠습니까?`,
      DialogMessageIcon.alert,
      async () => {
        try {
          await notificationAPI.cancelNotification(notification.id);
          showMessageIcon('예약 발송이 취소되었습니다.', DialogMessageIcon.success, () => {
            reload();
          });
        } catch (error) {
          console.error('Failed to cancel notification:', error);
          showMessageIcon('예약 취소에 실패했습니다.', DialogMessageIcon.alert);
        }
      }
    );
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
    filters,
    setFilters: handleSetFilters,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    createNotification,
    sendTestNotification,
    cancelNotification,
  };
};
