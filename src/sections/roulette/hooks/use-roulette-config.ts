import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { IRouletteSlot } from 'src/types/tickets/roulette';
import { getProbabilitySum, getTotalExpectedValue } from 'src/utils/roulette';

// 슬롯은 6개 고정이며 보상 유형·수량·확률만 수정한다(추가·삭제 불가).
// 백엔드 API가 아직 슬롯별 확률을 지원하지 않아 저장은 화면 상태로만 유지한다.
// (API 연동은 백엔드 계약 확정 후 별도 진행)
export const useRouletteConfig = (defaultSlots: IRouletteSlot[], savedLabel: string) => {
  const [slots, setSlots] = useState<IRouletteSlot[]>(defaultSlots);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const probabilitySum = useMemo(() => getProbabilitySum(slots), [slots]);
  const totalExpectedValue = useMemo(() => getTotalExpectedValue(slots), [slots]);
  const isProbabilityValid = Math.abs(probabilitySum - 100) < 0.001;
  const hasInvalidQty = slots.some((s) => s.type !== 'MISS' && s.qty <= 0);

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
      // TODO: 백엔드가 슬롯별 확률·가변 슬롯 개수를 지원하면 실제 저장 API로 교체
      await new Promise((resolve) => setTimeout(resolve, 300));
      setHasSavedConfig(true);
      setJustSaved(true);
      toast.success(`${savedLabel} 설정이 저장되었습니다.`);
    } finally {
      setIsSaving(false);
    }
  }, [isProbabilityValid, hasInvalidQty, savedLabel]);

  return {
    slots,
    isSaving,
    hasSavedConfig,
    justSaved,
    probabilitySum,
    totalExpectedValue,
    isProbabilityValid,
    hasInvalidQty,
    updateSlot,
    resetToDefault,
    saveConfig,
  };
};
