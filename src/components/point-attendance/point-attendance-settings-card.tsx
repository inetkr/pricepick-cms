'use client';

import React, { useEffect, useState } from 'react';
import type {
  IAttendanceConfigValue,
  IAttendanceRecognitionConditionOption,
} from 'src/types/config/attendance_config';
import { FormInput } from '../common/form-input';
import { FormSelect } from '../common/form-select';

interface AttendanceSettingsCardProps {
  config: IAttendanceConfigValue;
  recognitionConditionOptions: IAttendanceRecognitionConditionOption[];
  isSaving?: boolean;
  onSave: (config: IAttendanceConfigValue) => void;
}

// 연결 제휴몰은 쿠팡 하나뿐이라 고르는 칸 없이 쿠팡으로 고정한다
const LINKED_STORE = 'COUPANG';

const streakBonusOptions = [
  { value: '1', label: '이벤트 티켓 1장' },
  { value: '2', label: '이벤트 티켓 2장' },
];

export const AttendanceSettingsCard: React.FC<AttendanceSettingsCardProps> = ({
  config,
  recognitionConditionOptions,
  isSaving = false,
  onSave,
}) => {
  const [form, setForm] = useState<IAttendanceConfigValue>(config);

  // 출석 인정 조건 목록은 ATTENDANCE_CONFIG의 recognition_condition_options 값을 그대로 사용한다
  const conditionOptions = recognitionConditionOptions.map((option) => ({
    value: option.code,
    label: option.label,
  }));

  useEffect(() => {
    setForm(config);
  }, [config]);

  const handleChange = <K extends keyof IAttendanceConfigValue>(
    key: K,
    value: IAttendanceConfigValue[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, linked_store: LINKED_STORE });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">지급 설정</div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FormInput
              label="일일 지급 포인트"
              type="number"
              value={form.daily_points}
              onChange={(e) => handleChange('daily_points', parseInt(e.target.value, 10) || 0)}
              style={{ maxWidth: '140px' }}
            />
            <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>P / 1일 1회</span>
          </div>

          <FormInput
            label="연결 제휴몰"
            value="쿠팡"
            disabled
            style={{ maxWidth: '200px' }}
            hint="쿠팡 전용. 회원은 쿠팡 방문 후 복귀해야 출석이 인정됩니다."
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FormSelect
              label="5일 연속 보너스"
              options={streakBonusOptions}
              value={String(form.streak_reward_event_ticket_amount)}
              onChange={(e) =>
                handleChange('streak_reward_event_ticket_amount', Number(e.target.value) as 1 | 2)
              }
              style={{ maxWidth: '200px' }}
            />
          </div>

          <FormSelect
            label="출석 인정 조건"
            options={conditionOptions}
            value={form.recognition_condition}
            onChange={(e) =>
              handleChange(
                'recognition_condition',
                e.target.value as IAttendanceConfigValue['recognition_condition']
              )
            }
          />

          <FormInput
            label="초기화 시각"
            type="time"
            value={form.reset_time}
            onChange={(e) => handleChange('reset_time', e.target.value)}
            style={{ maxWidth: '140px' }}
          />
        </form>
      </div>
    </div>
  );
};
