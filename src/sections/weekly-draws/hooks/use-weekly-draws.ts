import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { weeklyDrawAPI } from 'src/api';
import type {
  DrawRoundStatus,
  IDrawPrizeTier,
  IDrawRound,
  IGiftStatus,
} from 'src/types/weekly-draws/weekly-draw';

const DEFAULT_LIMIT = 10;

function useRoundList(status: DrawRoundStatus) {
  const [rounds, setRounds] = useState<IDrawRound[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await weeklyDrawAPI.getRounds(page, limit, status);
      setRounds(response.result.object.rows);
      setTotalItems(response.result.object.count);
      setTotalPages(Math.max(1, Math.ceil(response.result.object.count / limit)));
    } catch (error) {
      console.error(`Failed to load ${status} rounds:`, error);
      toast.error('추첨 회차를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [status, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSetLimit = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

  return { rounds, page, setPage, limit, setLimit: handleSetLimit, totalItems, totalPages, isLoading, reload: load };
}

export const useWeeklyDraws = () => {
  const ongoing = useRoundList('ONGOING');
  const upcoming = useRoundList('UPCOMING');
  const ended = useRoundList('ENDED');

  const [template, setTemplate] = useState<IDrawPrizeTier[]>([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(true);

  const loadTemplate = useCallback(async () => {
    setIsTemplateLoading(true);
    try {
      const response = await weeklyDrawAPI.getDefaultTemplate();
      setTemplate(response.result.object.value?.tiers ?? []);
    } catch (error) {
      console.error('Failed to load prize draw default template:', error);
      toast.error('기본 경품 구성 템플릿을 불러오지 못했습니다.');
    } finally {
      setIsTemplateLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const reloadAll = useCallback(() => {
    ongoing.reload();
    upcoming.reload();
    ended.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTemplate = useCallback(async (tiers: IDrawPrizeTier[]) => {
    try {
      const response = await weeklyDrawAPI.setDefaultTemplate(tiers);
      setTemplate(response.result.object.value?.tiers ?? tiers);
      toast.success('기본 경품 구성 템플릿이 저장되었습니다.');
      return true;
    } catch (error) {
      console.error('Failed to save prize draw default template:', error);
      toast.error('템플릿 저장에 실패했습니다.');
      return false;
    }
  }, []);

  const updateRoundTiers = useCallback(
    async (roundId: string, tiers: IDrawPrizeTier[]) => {
      try {
        await weeklyDrawAPI.updateRoundTiers(roundId, tiers);
        toast.success('경품 구성이 저장되었습니다.');
        reloadAll();
        return true;
      } catch (error) {
        console.error('Failed to update round tiers:', error);
        toast.error('경품 구성 저장에 실패했습니다.');
        return false;
      }
    },
    [reloadAll]
  );

  const getRoundEntries = useCallback(async (roundId: string, page: number, limit: number) => {
    try {
      const response = await weeklyDrawAPI.getRoundEntries(roundId, page, limit);
      return response.result.object;
    } catch (error) {
      console.error('Failed to load round entries:', error);
      toast.error('응모자 목록을 불러오지 못했습니다.');
      return { count: 0, rows: [] };
    }
  }, []);

  const updateEntriesGiftStatus = useCallback(
    async (roundId: string, entries: { id: string; gift_status: IGiftStatus; gift_note?: string }[]) => {
      try {
        await weeklyDrawAPI.updateEntriesGiftStatus(roundId, entries);
        toast.success('지급 상태가 저장되었습니다.');
        reloadAll();
        return true;
      } catch (error) {
        console.error('Failed to update entries gift status:', error);
        toast.error('지급 상태 저장에 실패했습니다.');
        return false;
      }
    },
    [reloadAll]
  );

  return {
    ongoing,
    upcoming,
    ended,
    template,
    isTemplateLoading,
    saveTemplate,
    updateRoundTiers,
    getRoundEntries,
    updateEntriesGiftStatus,
  };
};
