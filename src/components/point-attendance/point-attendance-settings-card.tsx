'use client';

import React, { useEffect, useState } from 'react';
import type { IAttendanceConfigValue } from 'src/types/config/attendance_config';
import { FormInput } from '../common/form-input';
import { FormSelect } from '../common/form-select';

interface AttendanceSettingsCardProps {
  config: IAttendanceConfigValue;
  isSaving?: boolean;
  onSave: (config: IAttendanceConfigValue) => void;
}

const linkedStoreOptions = [
  { value: 'COUPANG', label: '쿠팡 (단독)' },
  { value: 'COUPANG_11ST', label: '쿠팡 + 11번가' },
  { value: 'ALL', label: '전체 제휴몰' },
];

const streakBonusOptions = [
  { value: '1', label: '이벤트 티켓 1장' },
  { value: '2', label: '이벤트 티켓 2장' },
];

const conditionOptions = [
  { value: 'RETURN_FROM_STORE', label: '제휴몰 방문 후 복귀 시 지급' },
  { value: 'MANUAL_CHECKIN', label: '앱 진입만으로 인정' },
];

export const AttendanceSettingsCard: React.FC<AttendanceSettingsCardProps> = ({
  config,
  isSaving = false,
  onSave,
}) => {
  const [form, setForm] = useState<IAttendanceConfigValue>(config);

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
    onSave(form);
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
            value={form.linked_store}
            onChange={(e) => handleChange('linked_store', e.target.value)}
            hint="현재 쿠팡 전용. 회원은 쿠팡 방문 후 복귀해야 출석이 인정됩니다."
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
