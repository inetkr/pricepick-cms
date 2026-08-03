import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ticketAPI } from 'src/api';
import type { ILuckySpinStats, IRouletteSlot } from 'src/types/tickets/roulette';
import {
  DEFAULT_DAILY_ROULETTE_SLOTS,
  getProbabilitySum,
  getSlotsSignature,
  getTotalExpectedValue,
  mapApiSlotsToRouletteSlots,
  mapRouletteSlotsToApiSlots,
} from 'src/utils/roulette';

const DEFAULT_STATS: ILuckySpinStats = {
  total_spins_this_month: 0,
  total_won_value_this_month: 0,
  expected_value_per_spin: 0,
};

export const useDailyLuckyRoulette = () => {
  const [slots, setSlots] = useState<IRouletteSlot[]>(DEFAULT_DAILY_ROULETTE_SLOTS);
  const [savedSlots, setSavedSlots] = useState<IRouletteSlot[]>(DEFAULT_DAILY_ROULETTE_SLOTS);
  const [defaultSlots, setDefaultSlots] = useState<IRouletteSlot[]>(DEFAULT_DAILY_ROULETTE_SLOTS);
  const [stats, setStats] = useState<ILuckySpinStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const probabilitySum = useMemo(() => getProbabilitySum(slots), [slots]);
  const totalExpectedValue = useMemo(() => getTotalExpectedValue(slots), [slots]);
  const isProbabilityValid = Math.abs(probabilitySum - 100) < 0.001;
  const hasInvalidQty = slots.some((s) => s.type !== 'MISS' && s.qty <= 0);
  const isDirty = useMemo(
    () => getSlotsSignature(slots) !== getSlotsSignature(savedSlots),
    [slots, savedSlots]
  );

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await ticketAPI.getLuckySpinConfig();
      const configObject = responseData?.result?.object;
      if (configObject?.configured && configObject.slots.length === 6) {
        const loadedSlots = mapApiSlotsToRouletteSlots(configObject.slots);
        setSlots(loadedSlots);
        setSavedSlots(loadedSlots);
        setHasSavedConfig(true);
      }
      if (configObject?.default_slots && configObject.default_slots.length === 6) {
        setDefaultSlots(mapApiSlotsToRouletteSlots(configObject.default_slots));
      }
    } catch (error) {
      console.error('Failed to load daily lucky roulette config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const responseData = await ticketAPI.getLuckySpinStats();
      const statsObject = responseData?.result?.object;
      if (statsObject) {
        setStats(statsObject);
      }
    } catch (error) {
      console.error('Failed to load daily lucky roulette stats:', error);
    }
  }, []);

  useEffect(() => {
    loadConfig();
    loadStats();
  }, [loadConfig, loadStats]);

  const updateSlot = useCallback((index: number, patch: Partial<IRouletteSlot>) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
    setJustSaved(false);
  }, []);

  const resetToDefault = useCallback(() => {
    setSlots(defaultSlots.map((s) => ({ ...s })));
    setJustSaved(false);
    toast.success('기본값(6슬롯)으로 복원했습니다.');
  }, [defaultSlots]);

  const saveConfig = useCallback(async () => {
    if (!isProbabilityValid) {
      toast.error('확률 합계가 100%가 아니라 저장하지 않았습니다.');
      return;
    }
    if (hasInvalidQty) {
      toast.error('수량이 0인 슬롯이 있어 저장하지 않았습니다.');
      return;
    }
    setIsSaving(true);
    try {
      await ticketAPI.updateLuckySpinConfig(mapRouletteSlotsToApiSlots(slots));
      setSavedSlots(slots);
      setHasSavedConfig(true);
      setJustSaved(true);
      toast.success('매일 행운 룰렛 설정이 저장되었습니다.');
      loadStats();
    } catch (error) {
      console.error('Failed to save daily lucky roulette config:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [isProbabilityValid, hasInvalidQty, slots, loadStats]);

  return {
    slots,
    stats,
    isLoading,
    isSaving,
    hasSavedConfig,
    justSaved,
    probabilitySum,
    totalExpectedValue,
    isProbabilityValid,
    hasInvalidQty,
    isDirty,
    updateSlot,
    resetToDefault,
    saveConfig,
  };
};
