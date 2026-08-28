import React from 'react';
import { PolicyItem } from 'src/components/common/policy-item';
import type { ITicketValueConfigValue } from 'src/types/config/ticket_value_config';
import type { IConversionRateItem, IConversionRates } from 'src/types/points/conversion_rate';
import { convertTicketToPoint } from 'src/utils/ticket-value';

interface TicketValueImpactCardProps {
  values: ITicketValueConfigValue;
  savedValues: ITicketValueConfigValue;
  isDirty: boolean;
  pointsPerWon: number;
  conversionRates: IConversionRates | null;
}

const gradeLabels: Record<IConversionRateItem['ticket_type'], string> = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
};

const gradeOrder: IConversionRateItem['ticket_type'][] = ['BRONZE', 'SILVER', 'GOLD'];

const simLineStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--main-hover, var(--main))',
  margin: '0 18px 12px',
  padding: '8px 10px',
  background: 'var(--main-soft)',
  borderRadius: 'var(--r-sm)',
  lineHeight: 1.5,
};

// 여기서 계산하는 값은 전부 미리보기용 텍스트다 — 실제 룰렛·포인트·적립 정책 값은 각자 화면에서
// 별도로 저장하며, 이 카드가 저장한다고 해서 자동으로 바뀌지 않는다.
export const TicketValueImpactCard: React.FC<TicketValueImpactCardProps> = ({
  values,
  savedValues,
  isDirty,
  pointsPerWon,
  conversionRates,
}) => {
  const exchangeRatioText = conversionRates
    ? [...conversionRates.rates]
        .sort((a, b) => gradeOrder.indexOf(a.ticket_type) - gradeOrder.indexOf(b.ticket_type))
        .map((rate) => `${gradeLabels[rate.ticket_type]} ${rate.point_amount.toLocaleString()}P`)
        .join(' / ')
    : '—';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">영향 범위 안내</div>
          <div className="card-sub">티켓 가치를 바꾸면 아래 항목들도 같이 조정해야 합니다</div>
        </div>
        <span className="badge badge-amber">안내만 · 자동 반영 없음</span>
      </div>
      <div className="amber-box" style={{ margin: '14px 18px 0' }}>
        이 화면은 <strong>티켓 환산가치만</strong> 다룹니다. 아래 항목은{' '}
        <strong>각자 담당 화면에서 별도로</strong> 수정해야 하며, 여기서 값을 바꿔도 자동으로 바뀌지
        않습니다.
      </div>
      <PolicyItem
        label="매일 선물 상자 열기 보상 구성"
        value={
          <>
            보상 슬롯별 티켓 종류·수량{' '}
            <span className="badge badge-gray" style={{ marginLeft: '8px' }}>
              티켓 · 보상 &gt; 매일 선물 상자 열기
            </span>
          </>
        }
        description="선물 상자 보상 슬롯은 운영자가 CMS에서 직접 정하는 값입니다(자동 계산 대상 아님). 티켓 가치를 바꾸면 슬롯 구성도 다시 정해야 합니다."
      />
      <PolicyItem
        label="랜덤 선물 상자 열기 보상 구성"
        value={
          <>
            당첨 보상·확률 테이블{' '}
            <span className="badge badge-gray" style={{ marginLeft: '8px' }}>
              티켓 · 보상 &gt; 랜덤 선물 상자 열기
            </span>
          </>
        }
        description="랜덤 선물 상자 보상 슬롯도 운영자가 CMS에서 직접 정하는 값입니다(자동 계산 대상 아님). 티켓 가치를 바꾸면 슬롯 구성도 다시 정해야 합니다."
      />
      <PolicyItem
        label="포인트 → 티켓 교환 비율"
        value={
          <>
            {exchangeRatioText}
            <span className="badge badge-gray" style={{ marginLeft: '8px' }}>
              포인트 관리 &gt; 포인트 정책
            </span>
          </>
        }
        description={`현재 비율은 브론즈 ${pointsPerWon}원 기준(${pointsPerWon}P = 1원)으로 잡혀 있습니다. 티켓 가치가 바뀌면 포인트 환산도 어긋납니다.`}
      />
      {isDirty && (
        <div style={{ ...simLineStyle, marginBottom: '14px' }}>
          브론즈 {convertTicketToPoint(savedValues.bronze, pointsPerWon).toLocaleString()}P →{' '}
          <strong>{convertTicketToPoint(values.bronze, pointsPerWon).toLocaleString()}P</strong>
          {' · '}실버 {convertTicketToPoint(savedValues.silver, pointsPerWon).toLocaleString()}P →{' '}
          <strong>{convertTicketToPoint(values.silver, pointsPerWon).toLocaleString()}P</strong>
          {' · '}골드 {convertTicketToPoint(savedValues.gold, pointsPerWon).toLocaleString()}P →{' '}
          <strong>{convertTicketToPoint(values.gold, pointsPerWon).toLocaleString()}P</strong>
          {` (${pointsPerWon}P = 1원 고정)`}
        </div>
      )}
      <PolicyItem
        label="등급별 적립 기준"
        value={
          <>
            구매금액 × 제휴몰별 적립률{' '}
            <span className="badge badge-gray" style={{ marginLeft: '8px' }}>
              티켓 · 보상 &gt; 티켓 적립 설정
            </span>
          </>
        }
        description="적립액은 구매금액과 제휴몰별 적립률로 정해집니다. 티켓 가치를 바꾸면 같은 적립액이 몇 장으로 지급되는지가 달라집니다. 최소 구매 금액 문턱은 없습니다."
      />
    </div>
  );
};
