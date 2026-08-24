'use client';

import React from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { TicketValueEventTable } from 'src/components/ticket-value/ticket-value-event-table';
import { TicketValueGradeTable } from 'src/components/ticket-value/ticket-value-grade-table';
import { TicketValueImpactCard } from 'src/components/ticket-value/ticket-value-impact-card';
import { TicketValueRatioCard } from 'src/components/ticket-value/ticket-value-ratio-card';
import { useConversionRates } from 'src/sections/point-policy/hooks/use-conversion-rates';
import { usePointPolicy } from 'src/sections/point-policy/hooks/use-point-policy';
import { useTicketValue } from 'src/sections/ticket-value/hooks/use-ticket-value';

export const TicketValueSection: React.FC = () => {
  const {
    values,
    savedValues,
    roundedFrom,
    isLoading,
    isTierDirty,
    isSavingTier,
    isSavingEvent,
    tierChanges,
    eventChanges,
    updateGradeValue,
    updateEventValue,
    saveTierValues,
    saveEventValue,
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
        티켓 1장의 <strong>원화 환산가치</strong>를 정합니다. 이 값이 룰렛 잭팟 산정 방식·포인트 교환
        비율·등급 교환 비율의 기준이 됩니다. 저장하면 앱이 실제로 이 값을 읽어 씁니다.
      </InfoBox>

      <TicketValueGradeTable
        values={values}
        savedValues={savedValues}
        roundedFrom={roundedFrom}
        changes={tierChanges}
        onChange={updateGradeValue}
        isSaving={isSavingTier}
        onSave={saveTierValues}
      />

      <TicketValueEventTable
        value={values.event}
        savedValue={savedValues.event}
        changes={eventChanges}
        onChange={updateEventValue}
        isSaving={isSavingEvent}
        onSave={saveEventValue}
      />

      <TicketValueRatioCard values={values} />

      <TicketValueImpactCard
        values={values}
        savedValues={savedValues}
        isDirty={isTierDirty}
        pointsPerWon={pointsPerWon}
        conversionRates={conversionRates}
      />
    </div>
  );
};
