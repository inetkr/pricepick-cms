// src/components/point-attendance/AttendancePolicyCard.tsx
import React from 'react';
import { PolicyItem } from '../common/policy-item';

interface AttendancePolicy {
  dailyPoints: number;
  affiliate: string;
  bonus: string;
  resetTime: string;
}

interface AttendancePolicyCardProps {
  policy: AttendancePolicy;
}

export const AttendancePolicyCard: React.FC<AttendancePolicyCardProps> = ({ policy }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">현재 적용 정책</div>
      </div>
      <div>
        <PolicyItem
          label="일일 지급"
          value={`${policy.dailyPoints}P (${policy.dailyPoints / 10}원 상당)`}
          description="1일 1회, 제휴몰 방문 후 복귀 시 지급"
        />
        <PolicyItem
          label="연결 제휴몰"
          value={policy.affiliate}
          description="브릿지 경유 방문 추적"
        />
        <PolicyItem label="연속 보너스" value={policy.bonus} />
        <PolicyItem label="초기화" value={`매일 ${policy.resetTime} 자동 초기화`} />
      </div>
    </div>
  );
};
