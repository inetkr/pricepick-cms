import React from 'react';
import type { IAttendanceConfigValue } from 'src/types/config/attendance_config';
import { PolicyItem } from '../common/policy-item';

interface AttendancePolicyCardProps {
  config: IAttendanceConfigValue;
}

const linkedStoreLabels: Record<string, string> = {
  COUPANG: '쿠팡 단독',
  COUPANG_11ST: '쿠팡 + 11번가',
  ALL: '전체 제휴몰',
};

const conditionLabels: Record<string, string> = {
  RETURN_FROM_STORE: '제휴몰 방문 후 앱 복귀',
  MANUAL_CHECKIN: '앱 진입만으로 인정',
};

export const AttendancePolicyCard: React.FC<AttendancePolicyCardProps> = ({ config }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">현재 적용 정책</div>
      </div>
      <div>
        <PolicyItem
          label="일일 지급"
          value={`${config.daily_points}P (${(config.daily_points / 10).toLocaleString()}원 상당)`}
          description={`1일 1회, ${conditionLabels[config.recognition_condition] || config.recognition_condition} 시 지급`}
        />
        <PolicyItem
          label="연결 제휴몰"
          value={linkedStoreLabels[config.linked_store] || config.linked_store}
          description="브릿지 경유 방문 추적"
        />
        <PolicyItem
          label="연속 보너스"
          value={`5일 연속 → 이벤트 티켓 ${config.streak_reward_event_ticket_amount}장`}
        />
        <PolicyItem label="초기화" value={`매일 ${config.reset_time} 자동 초기화`} />
      </div>
    </div>
  );
};
