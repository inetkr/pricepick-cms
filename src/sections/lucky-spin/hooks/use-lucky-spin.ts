import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ticketAPI } from 'src/api';
import { useDialogMessage } from 'src/context/dialog-message-context';
import { ILuckySpinConfigSlot } from 'src/types/tickets/lucky_spin';


export const useLuckySpin = () => {
  const [slots, setSlots] = useState<ILuckySpinConfigSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const { showMessageIcon } = useDialogMessage();

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await ticketAPI.getLuckySpinConfig();
      const spinConfigObject = responseData?.result?.object;
      if (spinConfigObject && spinConfigObject.slots.length === 6) {
        setSlots(spinConfigObject.slots);
        setHasSavedConfig(true);
      }
    } catch (error) {
      console.error('Failed to load lucky spin config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateSlot = useCallback((index: number, patch: Partial<ILuckySpinConfigSlot>) => {
    setSlots((prev) => prev.map((segment, i) => (i === index ? { ...segment, ...patch } : segment)));
    setJustSaved(false);
  }, []);

  const saveConfig = useCallback(async () => {
    setIsSaving(true);
    try {
      await ticketAPI.updateLuckySpinConfig(slots);
      setHasSavedConfig(true);
      setJustSaved(true);
      toast.success('행운룰렛 설정이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save lucky spin config:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [slots]);

  return { slots, isLoading, isSaving, hasSavedConfig, justSaved, updateSlot, saveConfig };
};
