import React from 'react';
import { PolicyItem } from '../common/policy-item';

interface PointPolicy {
  exchangeRate: string;
  expiryPeriod: string;
  dailyLimit: string;
  exchangeDirection: string;
  mainEarningPath: string;
}

interface PointPolicyCardProps {
  policy: PointPolicy;
  onEdit?: () => void;
}

export const PointPolicyCard: React.FC<PointPolicyCardProps> = ({ policy, onEdit }) => {
  return (
    <div className="card" style={{ marginTop: '16px' }}>
      <div className="card-header">
        <div className="card-title">적립·만료 정책</div>
        {/* {onEdit && (
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>
            수정
          </button>
        )} */}
      </div>
      <div>
        <PolicyItem label="기준 환율" value={policy.exchangeRate} />
        <PolicyItem
          label="만료 기간"
          value={policy.expiryPeriod}
          description="선입선출(FIFO) 소멸. 매일 04:00 만료 배치 실행"
        />
        <PolicyItem label="일일 적립 한도" value={policy.dailyLimit} />
        <PolicyItem
          label="교환 방향"
          value={policy.exchangeDirection}
          description="어느 방향으로 바꿔도 보유 가치는 동일"
        />
        <PolicyItem label="주 적립 경로" value={policy.mainEarningPath} />
      </div>
    </div>
  );
};
