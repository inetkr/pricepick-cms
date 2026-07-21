import React from 'react';
import type { IPointPolicyConfigValue } from 'src/types/config/point_policy_config';
import { PolicyItem } from '../common/policy-item';

interface PointPolicyCardProps {
  config: IPointPolicyConfigValue;
  onEdit?: () => void;
}

const expiryLabels: Record<IPointPolicyConfigValue['expiry_policy'], string> = {
  ONE_YEAR: '적립일로부터 1년',
  SIX_MONTHS: '적립일로부터 6개월',
  NO_EXPIRY: '만료 없음',
};

const directionLabels: Record<IPointPolicyConfigValue['conversion_direction'], string> = {
  BIDIRECTIONAL: '포인트 ↔ 티켓 양방향 교환',
  ONE_WAY_POINT_TO_TICKET: '포인트 → 티켓 단방향 교환',
};

const formatScheduledAt = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PointPolicyCard: React.FC<PointPolicyCardProps> = ({ config, onEdit }) => {
  return (
    <div className="card" style={{ marginTop: '16px' }}>
      <div className="card-header">
        <div className="card-title">적립·만료 정책</div>
        {onEdit && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
            수정
          </button>
        )}
      </div>
      <div>
        <PolicyItem
          label="기준 환율"
          value={`${config.exchange_rate.point}P = ${config.exchange_rate.won}원`}
        />
        <PolicyItem
          label="만료 기간"
          value={expiryLabels[config.expiry_policy] || config.expiry_policy}
          description="선입선출(FIFO) 소멸. 매일 04:00 만료 배치 실행"
        />
        <PolicyItem
          label="일일 적립 한도"
          value={
            config.daily_accumulation_limit == null
              ? '없음'
              : `${config.daily_accumulation_limit.toLocaleString()}P`
          }
        />
        <PolicyItem
          label="교환 방향"
          value={directionLabels[config.conversion_direction] || config.conversion_direction}
          description="어느 방향으로 바꿔도 보유 가치는 동일"
        />
        <PolicyItem label="주 적립 경로" value="출석체크 (일 100P)" />
        <PolicyItem
          label="적용 시점"
          value={config.apply_timing === 'SCHEDULED' ? '예약 적용' : '즉시 적용'}
          description={
            config.apply_timing === 'SCHEDULED' && config.scheduled_at
              ? `${formatScheduledAt(config.scheduled_at)}부터 적용 예정`
              : undefined
          }
        />
      </div>
    </div>
  );
};
