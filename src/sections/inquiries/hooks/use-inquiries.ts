import { useCallback, useEffect, useState } from 'react';
import { qnaAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type { IQna, IQnaStats, IUpdateQnaPayload } from 'src/types/qna';

export interface InquiryFilterValues {
  search: string;
  state: string;
  type: string;
}

const defaultFilters: InquiryFilterValues = { search: '', state: '', type: '' };

const defaultStats: IQnaStats = {
  pending: 0,
  processing: 0,
  completed: 0,
  avg_response_hours: 0,
};

export const useInquiries = () => {
  const { showMessageIcon, showConfirmMessageIcon } = useDialogMessage();

  const [inquiries, setInquiries] = useState<IQna[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<InquiryFilterValues>(defaultFilters);

  const [stats, setStats] = useState<IQnaStats>(defaultStats);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const filter: { state?: string; type?: string } = {};
      if (filters.state) filter.state = filters.state;
      if (filters.type) filter.type = filters.type;
      const responseData = await qnaAPI.getQnaList(
        page,
        limit,
        Object.keys(filter).length ? filter : undefined
      );
      if (responseData && responseData.result && responseData.result.object) {
        setInquiries(responseData.result.object.rows);
        setTotalItems(responseData.result.object.count);
        setTotalPages(Math.ceil(responseData.result.object.count / limit) || 1);
      }
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters.state, filters.type]);

  const loadStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const responseData = await qnaAPI.getQnaStats();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load inquiry stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleSetLimit = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

  const applyFilters = (next: InquiryFilterValues) => {
    setPage(1);
    setFilters(next);
  };

  const answerInquiry = async (id: string, payload: IUpdateQnaPayload) => {
    setIsSaving(true);
    try {
      const responseData = await qnaAPI.updateQna(id, payload);
      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('답변이 저장되었습니다.', DialogMessageIcon.success, () => {
          loadInquiries();
          loadStats();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to answer inquiry:', error);
      showMessageIcon('답변 저장에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteInquiry = (inquiry: IQna) => {
    showConfirmMessageIcon(
      `'${inquiry.title}' 문의를 삭제하시겠습니까?`,
      DialogMessageIcon.alert,
      async () => {
        try {
          await qnaAPI.deleteQna(inquiry.id);
          showMessageIcon('문의가 삭제되었습니다.', DialogMessageIcon.success, () => {
            loadInquiries();
            loadStats();
          });
        } catch (error) {
          console.error('Failed to delete inquiry:', error);
          showMessageIcon('문의 삭제에 실패했습니다.', DialogMessageIcon.alert);
        }
      }
    );
  };

  return {
    inquiries,
    isLoading,
    isSaving,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    totalPages,
    totalItems,
    filters,
    applyFilters,
    stats,
    isStatsLoading,
    answerInquiry,
    deleteInquiry,
    reload: loadInquiries,
  };
};
