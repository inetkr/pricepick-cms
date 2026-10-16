import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ticketAPI } from 'src/api';
import type {
  ITicketValueConfigValue,
  ITicketValueKind,
} from 'src/types/config/ticket_value_config';
import {
  DEFAULT_TICKET_VALUE,
  fromApiTicketValue,
  isValidTicketValue,
  toApiTicketValue,
} from 'src/utils/ticket-value';

const KIND_LABEL: Record<ITicketValueKind, string> = {
  ticket: '티켓',
  event: '이벤트 티켓',
};

const SAVED_MESSAGE: Record<ITicketValueKind, string> = {
  ticket: '티켓 가치가 저장되었습니다.',
  event: '이벤트 티켓 가치가 저장되었습니다.',
};

export type TicketValueChange = {
  kind: ITicketValueKind;
  label: string;
  from: number;
  to: number;
};

export const useTicketValue = () => {
  const [values, setValues] = useState<ITicketValueConfigValue>(DEFAULT_TICKET_VALUE);
  const [savedValues, setSavedValues] = useState<ITicketValueConfigValue>(DEFAULT_TICKET_VALUE);
  const [isLoading, setIsLoading] = useState(true);
  // 티켓 가치와 이벤트 티켓 가치는 서로 다른 카드에서 각자 저장 버튼을 누르므로,
  // 저장 중 상태도 따로 관리한다 — 한쪽을 저장한다고 다른 쪽 버튼까지 잠기면 안 된다.
  const [savingKind, setSavingKind] = useState<ITicketValueKind | null>(null);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await ticketAPI.getTicketValueConfig();
      const apiValues = responseData?.result?.object?.values;
      if (apiValues && typeof apiValues.TICKET === 'number') {
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

  const updateValue = useCallback((kind: ITicketValueKind, rawValue: number) => {
    setValues((prev) => ({ ...prev, [kind]: rawValue }));
  }, []);

  const changesOf = useCallback(
    (kind: ITicketValueKind): TicketValueChange[] =>
      values[kind] === savedValues[kind]
        ? []
        : [{ kind, label: KIND_LABEL[kind], from: savedValues[kind], to: values[kind] }],
    [values, savedValues]
  );

  const ticketChanges = useMemo(() => changesOf('ticket'), [changesOf]);
  const eventChanges = useMemo(() => changesOf('event'), [changesOf]);
  const isTicketDirty = ticketChanges.length > 0;

  // 한 종류만 저장한다 — 서버 API는 TICKET/EVENT_TICKET을 한 번에 받으므로, 다른 종류는 아직
  // 저장하지 않은 입력값이 아니라 마지막 저장값(savedValues)을 그대로 실어 보내
  // 다른 카드의 미저장 변경이 함께 반영되지 않게 한다.
  const saveValue = useCallback(
    async (kind: ITicketValueKind) => {
      if (!isValidTicketValue(values[kind])) {
        toast.error('입력값을 확인하세요. 0 이상의 정수만 입력할 수 있습니다.');
        return;
      }
      if (values[kind] === savedValues[kind]) {
        toast.error('변경된 값이 없습니다.');
        return;
      }
      setSavingKind(kind);
      try {
        await ticketAPI.updateTicketValueConfig(
          toApiTicketValue({ ...savedValues, [kind]: values[kind] })
        );
        setSavedValues((prev) => ({ ...prev, [kind]: values[kind] }));
        toast.success(SAVED_MESSAGE[kind]);
      } catch (error) {
        console.error('Failed to save ticket value config:', error);
        toast.error('저장에 실패했습니다.');
      } finally {
        setSavingKind(null);
      }
    },
    [savedValues, values]
  );

  return {
    values,
    savedValues,
    isLoading,
    isTicketDirty,
    savingKind,
    ticketChanges,
    eventChanges,
    updateValue,
    saveValue,
  };
};
