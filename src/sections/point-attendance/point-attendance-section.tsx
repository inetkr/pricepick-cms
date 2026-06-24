'use client';

import React, { useState } from 'react';
import { toast } from 'sonner'; // hoặc dùng thư viện toast khác
import { InfoBox } from 'src/components/common/info-box';
import { AttendancePolicyCard } from 'src/components/point-attendance/point-attendance-policy-card';
import { AttendanceSettingsCard } from 'src/components/point-attendance/point-attendance-settings-card';
import { PointAttendanceStats } from 'src/components/point-attendance/point-attendance-stats';

export const PointAttendanceSection: React.FC = () => {
  const [settings, setSettings] = useState({
    dailyPoints: 100,
    affiliate: '쿠팡 단독',
    bonus: '5일 연속 → 이벤트 티켓 1장',
    resetTime: '00:00',
  });

  const handleSaveSettings = (data: any) => {
    // TODO: call API to save settings
    console.log('Saving settings:', data);
    // Cập nhật policy card
    setSettings({
      dailyPoints: data.dailyPoints,
      affiliate: '쿠팡 단독',
      bonus: '5일 연속 → 이벤트 티켓 1장',
      resetTime: data.resetTime,
    });
    toast.success('출석체크 설정이 저장되었습니다.');
  };

  return (
    <div className="section active">
      <InfoBox>
        <strong>출석체크 = 제휴몰 방문 후 복귀 시 적립</strong> — 회원이 연결 제휴몰을 방문하고
        앱으로 복귀하면 일일 포인트가 지급됩니다. (폴센트형 UX) · 5일 연속 달성 시 이벤트 티켓 1장
        추가 지급.
      </InfoBox>

      <PointAttendanceStats
        todayMembers={9420}
        todayPoints={942000}
        streakCount={1204}
        conversionRate={81.3}
      />

      <div className="card-grid">
        <AttendanceSettingsCard
          initialSettings={{
            dailyPoints: 100,
            affiliate: 'coupang',
            bonusType: 'event_ticket',
            attendanceCondition: 'visit_return',
            resetTime: '00:00',
          }}
          onSave={handleSaveSettings}
        />
        <AttendancePolicyCard policy={settings} />
      </div>
    </div>
  );
};
