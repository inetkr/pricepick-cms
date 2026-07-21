import { useCallback, useEffect, useState } from 'react';
import { announcementAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type {
  IAnnouncement,
  IAnnouncementStat,
  ICreateAnnouncementPayload,
  IUpdateAnnouncementPayload,
} from 'src/types/announcement';

type IFilters = {
  title: string;
};

export const useAnnouncement = () => {
  const { showMessageIcon, showConfirmMessageIcon } = useDialogMessage();
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [stats, setStats] = useState<IAnnouncementStat>({
    published: 0,
    draft: 0,
    published_diff_vs_last_month: 0,
    published_last_month: 0,
    published_this_month: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [filters, setFilters] = useState<IFilters>({ title: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadAnnouncements = useCallback(async () => {
    setIsLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      ) as IFilters;

      const responseData = await announcementAPI.getAnnouncementList(page, limit, filter);

      if (responseData && responseData.result && responseData.result.object) {
        setAnnouncements(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit));
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, limit]);

  const loadStats = useCallback(async () => {
    try {
      const responseData = await announcementAPI.getAnnouncementStats();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load announcement stats:', error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const reload = () => {
    loadStats();
    loadAnnouncements();
  };

  const createAnnouncement = async (payload: ICreateAnnouncementPayload) => {
    setIsSaving(true);
    try {
      const responseData = await announcementAPI.createAnnouncement(payload);
      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('공지사항이 등록되었습니다.', DialogMessageIcon.success, () => {
          setPage(1);
          reload();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create announcement:', error);
      showMessageIcon('공지사항 등록에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateAnnouncement = async (id: string, payload: IUpdateAnnouncementPayload) => {
    setIsSaving(true);
    try {
      const responseData = await announcementAPI.updateAnnouncement(id, payload);
      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('공지사항이 수정되었습니다.', DialogMessageIcon.success, () => {
          reload();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update announcement:', error);
      showMessageIcon('공지사항 수정에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAnnouncement = (announcement: IAnnouncement) => {
    showConfirmMessageIcon(
      `'${announcement.title}' 공지사항을 삭제하시겠습니까?`,
      DialogMessageIcon.alert,
      async () => {
        try {
          await announcementAPI.deleteAnnouncement(announcement.id);
          showMessageIcon('공지사항이 삭제되었습니다.', DialogMessageIcon.success, () => {
            reload();
          });
        } catch (error) {
          console.error('Failed to delete announcement:', error);
          showMessageIcon('공지사항 삭제에 실패했습니다.', DialogMessageIcon.alert);
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
    announcements,
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
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};
