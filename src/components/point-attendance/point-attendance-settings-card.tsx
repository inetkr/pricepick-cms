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

// 연결 제휴몰은 현재 쿠팡 하나뿐이다 — 고르는 칸은 두되 선택지는 쿠팡만 있다
const LINKED_STORE = 'COUPANG';
const linkedStoreOptions = [{ value: LINKED_STORE, label: '쿠팡' }];

// 연속 보너스는 「보너스 포인트」 하나뿐이다. 서버 설정에는 아직 보너스 종류를 고르는 값이 없어
// 이 칸은 표시만 하고, 저장할 때 streak_reward_event_ticket_amount는 받은 값을 그대로 돌려보낸다.
const STREAK_BONUS_POINT = 'BONUS_POINT';
const streakBonusOptions = [{ value: STREAK_BONUS_POINT, label: '보너스 포인트' }];

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

          <FormSelect
            label="연결 제휴몰"
            options={linkedStoreOptions}
            value={LINKED_STORE}
            onChange={() => undefined}
            hint="현재 쿠팡 전용. 회원은 쿠팡 방문 후 복귀해야 출석이 인정됩니다."
          />

          <FormSelect
            label={`${form.streak_milestone_days ?? 5}일 연속 보너스`}
            options={streakBonusOptions}
            value={STREAK_BONUS_POINT}
            onChange={() => undefined}
            style={{ maxWidth: '200px' }}
          />

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
