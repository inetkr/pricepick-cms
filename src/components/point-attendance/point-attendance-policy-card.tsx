import React from 'react';
import type {
  IAttendanceConfigValue,
  IAttendanceRecognitionConditionOption,
} from 'src/types/config/attendance_config';
import { PolicyItem } from '../common/policy-item';

interface AttendancePolicyCardProps {
  config: IAttendanceConfigValue;
  recognitionConditionOptions: IAttendanceRecognitionConditionOption[];
}

const linkedStoreLabels: Record<string, string> = {
  COUPANG: '쿠팡 단독',
  COUPANG_11ST: '쿠팡 + 11번가',
  ALL: '전체 제휴몰',
};

export const AttendancePolicyCard: React.FC<AttendancePolicyCardProps> = ({
  config,
  recognitionConditionOptions,
}) => {
  // 출석 인정 조건 라벨은 백엔드(recognition_condition_options)에서 관리한다
  const conditionLabel =
    recognitionConditionOptions.find((option) => option.code === config.recognition_condition)
      ?.label || config.recognition_condition;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">현재 적용 정책</div>
      </div>
      <div>
        <PolicyItem
          label="일일 지급"
          value={`${config.daily_points}P (${(config.daily_points / 10).toLocaleString()}원 상당)`}
          description={`1일 1회, ${conditionLabel}`}
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
