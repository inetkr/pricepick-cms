import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ticketAPI } from 'src/api';
import type { ILuckySpinStats, IRouletteSlot } from 'src/types/tickets/roulette';
import type { RouletteValueOverrides } from 'src/utils/roulette';
import {
  DEFAULT_JACKPOT_ROULETTE_SLOTS,
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

const DEFAULT_DAILY_SPIN_CAP = 10;
const DEFAULT_EVENT_TICKET_DAILY_CAP = 5;
const DEFAULT_EVENT_TICKET_MONTHLY_CAP = 30;

// 구매로 발급된 티켓(등급 티켓·이벤트 티켓 모두)은 승인 대기 상태로 발급되고 카카오 연동 D+7 /
// 미연동 D+30 경과 또는 구매 확정 시 승인되므로, "돌리고 환불" 악용은 티켓 승인 단계에서 이미
// 차단된다 — 별도 설정 항목을 두지 않는다.
export const useJackpotRoulette = () => {
  const [slots, setSlots] = useState<IRouletteSlot[]>(DEFAULT_JACKPOT_ROULETTE_SLOTS);
  const [savedSlots, setSavedSlots] = useState<IRouletteSlot[]>(DEFAULT_JACKPOT_ROULETTE_SLOTS);
  const [defaultSlots, setDefaultSlots] = useState<IRouletteSlot[]>(DEFAULT_JACKPOT_ROULETTE_SLOTS);
  const [stats, setStats] = useState<ILuckySpinStats>(DEFAULT_STATS);
  const [valueOverrides, setValueOverrides] = useState<RouletteValueOverrides>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const [dailySpinCap, setDailySpinCap] = useState(DEFAULT_DAILY_SPIN_CAP);
  const [eventTicketDailyCap, setEventTicketDailyCap] = useState(DEFAULT_EVENT_TICKET_DAILY_CAP);
  const [eventTicketMonthlyCap, setEventTicketMonthlyCap] = useState(
    DEFAULT_EVENT_TICKET_MONTHLY_CAP
  );
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  const [isSavingLimits, setIsSavingLimits] = useState(false);

  const probabilitySum = useMemo(() => getProbabilitySum(slots), [slots]);
  const totalExpectedValue = useMemo(
    () => getTotalExpectedValue(slots, valueOverrides),
    [slots, valueOverrides]
  );
  const isProbabilityValid = Math.abs(probabilitySum - 100) < 0.001;
  const hasInvalidQty = slots.some((s) => s.type !== 'MISS' && s.qty <= 0);
  const isDirty = useMemo(
    () => getSlotsSignature(slots) !== getSlotsSignature(savedSlots),
    [slots, savedSlots]
  );

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await ticketAPI.getLuckySpinJackpotConfig();
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
      console.error('Failed to load jackpot roulette config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const responseData = await ticketAPI.getLuckySpinJackpotStats();
      const statsObject = responseData?.result?.object;
      if (statsObject) {
        setStats(statsObject);
      }
    } catch (error) {
      console.error('Failed to load jackpot roulette stats:', error);
    }
  }, []);

  // 슬롯 가치·기댓값 계산에 쓰는 실제 티켓 환산가치 — 티켓 가치 설정 화면에서 바뀌면 여기도
  // 반영되도록 매번 최신값을 불러온다.
  const loadTicketValueConfig = useCallback(async () => {
    try {
      const responseData = await ticketAPI.getTicketValueConfig();
      const values = responseData?.result?.object?.values;
      if (values) {
        setValueOverrides({
          BRONZE_TICKET: values.BRONZE,
          SILVER_TICKET: values.SILVER,
          GOLD_TICKET: values.GOLD,
          EVENT_TICKET: values.EVENT,
        });
      }
    } catch (error) {
      console.error('Failed to load ticket value config for roulette:', error);
    }
  }, []);

  const loadPolicy = useCallback(async () => {
    setIsLoadingLimits(true);
    try {
      const responseData = await ticketAPI.getLuckySpinJackpotPolicy();
      const policyObject = responseData?.result?.object;
      if (policyObject) {
        setDailySpinCap(policyObject.daily_limit);
        setEventTicketDailyCap(policyObject.event_ticket_daily_cap);
        setEventTicketMonthlyCap(policyObject.event_ticket_monthly_cap);
      }
    } catch (error) {
      console.error('Failed to load jackpot roulette policy:', error);
    } finally {
      setIsLoadingLimits(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
    loadTicketValueConfig();
    loadStats();
    loadPolicy();
  }, [loadConfig, loadTicketValueConfig, loadStats, loadPolicy]);

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
      await ticketAPI.updateLuckySpinJackpotConfig(mapRouletteSlotsToApiSlots(slots));
      setSavedSlots(slots);
      setHasSavedConfig(true);
      setJustSaved(true);
      toast.success('잭팟 룰렛 설정이 저장되었습니다.');
      loadStats();
    } catch (error) {
      console.error('Failed to save jackpot roulette config:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [isProbabilityValid, hasInvalidQty, slots, loadStats]);

  const saveLimits = useCallback(async () => {
    if (dailySpinCap < 1 || eventTicketDailyCap < 1 || eventTicketMonthlyCap < 1) {
      toast.error('참여 상한은 1 이상이어야 합니다.');
      return;
    }
    if (eventTicketDailyCap > eventTicketMonthlyCap) {
      toast.error('일 한도가 월 한도보다 클 수 없습니다.');
      return;
    }
    setIsSavingLimits(true);
    try {
      await ticketAPI.updateLuckySpinJackpotPolicy({
        daily_limit: dailySpinCap,
        event_ticket_daily_cap: eventTicketDailyCap,
        event_ticket_monthly_cap: eventTicketMonthlyCap,
      });
      toast.success('잭팟 룰렛 참여 제한 정책이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save jackpot roulette policy:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSavingLimits(false);
    }
  }, [dailySpinCap, eventTicketDailyCap, eventTicketMonthlyCap]);

  return {
    slots,
    stats,
    valueOverrides,
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
    dailySpinCap,
    setDailySpinCap,
    eventTicketDailyCap,
    setEventTicketDailyCap,
    eventTicketMonthlyCap,
    setEventTicketMonthlyCap,
    isLoadingLimits,
    isSavingLimits,
    saveLimits,
  };
};
