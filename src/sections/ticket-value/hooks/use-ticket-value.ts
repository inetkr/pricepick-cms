import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ticketAPI } from 'src/api';
import type { ITicketValueConfigValue, ITicketValueGrade } from 'src/types/config/ticket_value_config';
import {
  DEFAULT_TICKET_VALUE,
  TICKET_VALUE_GRADES,
  fromApiTicketValue,
  isValidTicketValue,
  syncGradeValues,
  toApiTicketValue,
  type RoundedNotes,
} from 'src/utils/ticket-value';

const GRADE_LABEL: Record<ITicketValueGrade, string> = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
};

export type TicketValueChange = {
  grade: ITicketValueGrade | 'event';
  label: string;
  from: number;
  to: number;
};

export const useTicketValue = () => {
  const [values, setValues] = useState<ITicketValueConfigValue>(DEFAULT_TICKET_VALUE);
  const [savedValues, setSavedValues] = useState<ITicketValueConfigValue>(DEFAULT_TICKET_VALUE);
  const [roundedFrom, setRoundedFrom] = useState<RoundedNotes>({});
  const [isLoading, setIsLoading] = useState(true);
  // 등급별 환산가치와 이벤트 티켓 가치는 서로 다른 카드에서 각자 저장 버튼을 누르므로,
  // 저장 중 상태도 따로 관리한다 — 한쪽을 저장한다고 다른 쪽 버튼까지 잠기면 안 된다.
  const [isSavingTier, setIsSavingTier] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await ticketAPI.getTicketValueConfig();
      const apiValues = responseData?.result?.object?.values;
      if (apiValues && typeof apiValues.BRONZE === 'number') {
        const value = fromApiTicketValue(apiValues);
        setValues(value);
        setSavedValues(value);
      }
    } catch (error) {
      console.error('Failed to load ticket value config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateGradeValue = useCallback(
    (grade: ITicketValueGrade, rawValue: number) => {
      const { values: next, roundedFrom: rounded } = syncGradeValues(values, grade, rawValue);
      setRoundedFrom(rounded);
      setValues((prev) => ({ ...prev, ...next }));
    },
    [values]
  );

  const updateEventValue = useCallback((rawValue: number) => {
    setValues((prev) => ({ ...prev, event: rawValue }));
  }, []);

  const tierChanges = useMemo<TicketValueChange[]>(() => {
    const entries: TicketValueChange[] = [];
    TICKET_VALUE_GRADES.forEach((grade) => {
      if (values[grade] !== savedValues[grade]) {
        entries.push({ grade, label: GRADE_LABEL[grade], from: savedValues[grade], to: values[grade] });
      }
    });
    return entries;
  }, [values, savedValues]);

  const eventChanges = useMemo<TicketValueChange[]>(() => {
    if (values.event === savedValues.event) return [];
    return [{ grade: 'event', label: '이벤트 티켓', from: savedValues.event, to: values.event }];
  }, [values.event, savedValues.event]);

  const isTierDirty = tierChanges.length > 0;
  const isEventDirty = eventChanges.length > 0;
  const isDirty = isTierDirty || isEventDirty;

  const invalidTierFields = useMemo(
    () => TICKET_VALUE_GRADES.filter((grade) => !isValidTicketValue(values[grade])),
    [values]
  );
  const isEventInvalid = !isValidTicketValue(values.event);

  // 등급별 환산가치만 저장한다 — 서버 API는 BRONZE/SILVER/GOLD/EVENT를 한 번에 받으므로,
  // 이벤트 티켓 값은 아직 저장하지 않은 입력값(values.event)이 아니라 마지막 저장값
  // (savedValues.event)을 그대로 실어 보내 이벤트 카드의 미저장 변경이 함께 반영되지 않게 한다.
  const saveTierValues = useCallback(async () => {
    if (invalidTierFields.length > 0) {
      toast.error('입력값을 확인하세요. 0 이상의 정수만 입력할 수 있습니다.');
      return;
    }
    if (!isTierDirty) {
      toast.error('변경된 값이 없습니다.');
      return;
    }
    setIsSavingTier(true);
    try {
      await ticketAPI.updateTicketValueConfig(toApiTicketValue({ ...values, event: savedValues.event }));
      setSavedValues((prev) => ({ ...prev, bronze: values.bronze, silver: values.silver, gold: values.gold }));
      setRoundedFrom({});
      toast.success('등급별 환산가치가 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save ticket value config:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSavingTier(false);
    }
  }, [invalidTierFields, isTierDirty, savedValues.event, values]);

  // 이벤트 티켓 가치만 저장한다 — 등급별(브론즈/실버/골드) 값은 저장하지 않은 입력값이 아니라
  // 마지막 저장값(savedValues)을 그대로 실어 보내 등급 카드의 미저장 변경이 함께 반영되지 않게 한다.
  const saveEventValue = useCallback(async () => {
    if (isEventInvalid) {
      toast.error('입력값을 확인하세요. 0 이상의 정수만 입력할 수 있습니다.');
      return;
    }
    if (!isEventDirty) {
      toast.error('변경된 값이 없습니다.');
      return;
    }
    setIsSavingEvent(true);
    try {
      await ticketAPI.updateTicketValueConfig(toApiTicketValue({ ...savedValues, event: values.event }));
      setSavedValues((prev) => ({ ...prev, event: values.event }));
      toast.success('이벤트 티켓 가치가 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save ticket value config:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSavingEvent(false);
    }
  }, [isEventDirty, isEventInvalid, savedValues, values.event]);

  return {
    values,
    savedValues,
    roundedFrom,
    isLoading,
    isDirty,
    isTierDirty,
    isEventDirty,
    isSavingTier,
    isSavingEvent,
    tierChanges,
    eventChanges,
    invalidTierFields,
    isEventInvalid,
    updateGradeValue,
    updateEventValue,
    saveTierValues,
    saveEventValue,
  };
};
