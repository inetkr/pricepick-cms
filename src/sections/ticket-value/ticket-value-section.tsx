'use client';

import React from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { TicketValueImpactCard } from 'src/components/ticket-value/ticket-value-impact-card';
import { TicketValueTableCard } from 'src/components/ticket-value/ticket-value-table-card';
import { useConversionRates } from 'src/sections/point-policy/hooks/use-conversion-rates';
import { usePointPolicy } from 'src/sections/point-policy/hooks/use-point-policy';
import { useTicketValue } from 'src/sections/ticket-value/hooks/use-ticket-value';

export const TicketValueSection: React.FC = () => {
  const {
    values,
    savedValues,
    isLoading,
    isTicketDirty,
    savingKind,
    ticketChanges,
    eventChanges,
    updateValue,
    saveValue,
  } = useTicketValue();
  const { config: pointPolicyConfig } = usePointPolicy();
  const pointsPerWon = pointPolicyConfig.exchange_rate.point / pointPolicyConfig.exchange_rate.won;
  const { conversionRates } = useConversionRates();

  if (isLoading) {
    return (
      <div className="section active">
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="section active">
      <InfoBox type="info">
        티켓 1장의 <strong>원화 환산가치</strong>를 정합니다. 이 값이 룰렛 잭팟 판정·포인트 교환
        비율의 기준이 됩니다. 저장하면 앱이 실제로 이 값을 읽어 씁니다.
      </InfoBox>

      <TicketValueTableCard
        title="티켓 가치"
        subtitle="티켓 1장 = 원화 얼마로 볼 것인지 (0 이상 정수)"
        grade="TICKET"
        value={values.ticket}
        savedValue={savedValues.ticket}
        changes={ticketChanges}
        onChange={(v) => updateValue('ticket', v)}
        isSaving={savingKind === 'ticket'}
        onSave={() => saveValue('ticket')}
      />

      <TicketValueTableCard
        title="이벤트 티켓 가치"
        subtitle="이벤트 티켓은 티켓과 쓰임이 달라 가치를 별개로 정합니다 · 티켓 값을 바꿔도 따라 움직이지 않습니다"
        grade="EVENT_TICKET"
        value={values.event}
        savedValue={savedValues.event}
        changes={eventChanges}
        onChange={(v) => updateValue('event', v)}
        isSaving={savingKind === 'event'}
        onSave={() => saveValue('event')}
      />

      <TicketValueImpactCard
        values={values}
        savedValues={savedValues}
        isDirty={isTicketDirty}
        pointsPerWon={pointsPerWon}
        conversionRates={conversionRates}
      />
    </div>
  );
};
