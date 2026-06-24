'use client';

import React, { useState } from 'react';
import { FormInput } from '../common/form-input';
import { FormSelect } from '../common/form-select';

interface AttendanceSettings {
  dailyPoints: number;
  affiliate: string;
  bonusType: 'event_ticket' | 'event_ticket_2' | 'bonus_points';
  attendanceCondition: 'visit_return' | 'app_open';
  resetTime: string;
}

interface AttendanceSettingsCardProps {
  initialSettings?: AttendanceSettings;
  onSave?: (settings: AttendanceSettings) => void;
}

const affiliateOptions = [
  { value: 'coupang', label: '쿠팡 (단독)' },
  { value: 'coupang_11st', label: '쿠팡 + 11번가' },
  { value: 'all', label: '전체 제휴몰' },
];

const bonusOptions = [
  { value: 'event_ticket', label: '이벤트 티켓 1장' },
  { value: 'event_ticket_2', label: '이벤트 티켓 2장' },
  { value: 'bonus_points', label: '보너스 포인트' },
];

const conditionOptions = [
  { value: 'visit_return', label: '제휴몰 방문 후 앱 복귀' },
  { value: 'app_open', label: '앱 진입만으로 인정' },
];

export const AttendanceSettingsCard: React.FC<AttendanceSettingsCardProps> = ({
  initialSettings = {
    dailyPoints: 100,
    affiliate: 'coupang',
    bonusType: 'event_ticket',
    attendanceCondition: 'visit_return',
    resetTime: '00:00',
  },
  onSave,
}) => {
  const [settings, setSettings] = useState<AttendanceSettings>(initialSettings);

  const handleChange = <K extends keyof AttendanceSettings>(
    key: K,
    value: AttendanceSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(settings);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">지급 설정</div>
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          저장
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FormInput
              label="일일 지급 포인트"
              type="number"
              value={settings.dailyPoints}
              onChange={(e) => handleChange('dailyPoints', parseInt(e.target.value) || 0)}
              style={{ maxWidth: '140px' }}
            />
            <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>P / 1일 1회</span>
          </div>

          <FormSelect
            label="연결 제휴몰"
            options={affiliateOptions}
            value={settings.affiliate}
            onChange={(e) => handleChange('affiliate', e.target.value)}
            hint="현재 쿠팡 전용. 회원은 쿠팡 방문 후 복귀해야 출석이 인정됩니다."
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FormSelect
              label="5일 연속 보너스"
              options={bonusOptions}
              value={settings.bonusType}
              onChange={(e) => handleChange('bonusType', e.target.value as any)}
              style={{ maxWidth: '200px' }}
            />
          </div>

          <FormSelect
            label="출석 인정 조건"
            options={conditionOptions}
            value={settings.attendanceCondition}
            onChange={(e) => handleChange('attendanceCondition', e.target.value as any)}
          />

          <FormInput
            label="초기화 시각"
            type="time"
            value={settings.resetTime}
            onChange={(e) => handleChange('resetTime', e.target.value)}
            style={{ maxWidth: '140px' }}
          />
        </form>
      </div>
    </div>
  );
};
