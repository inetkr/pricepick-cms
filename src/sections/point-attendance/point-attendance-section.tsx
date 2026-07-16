'use client';

import React from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { AttendancePolicyCard } from 'src/components/point-attendance/point-attendance-policy-card';
import { AttendanceSettingsCard } from 'src/components/point-attendance/point-attendance-settings-card';
import { PointAttendanceStats } from 'src/components/point-attendance/point-attendance-stats';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import { usePointAttendance } from 'src/sections/point-attendance/hooks/use-point-attendance';
import type { IAttendanceConfigValue } from 'src/types/config/attendance_config';

export const PointAttendanceSection: React.FC = () => {
  const { showMessageIcon } = useDialogMessage();
  const { config, isLoading, isSaving, saveConfig, stats, isStatsLoading } = usePointAttendance();

  const handleSaveSettings = async (data: IAttendanceConfigValue) => {
    const ok = await saveConfig(data);
    if (ok) {
      showMessageIcon('출석체크 설정이 저장되었습니다.', DialogMessageIcon.success);
    } else {
      showMessageIcon('출석체크 설정 저장에 실패했습니다.', DialogMessageIcon.alert);
    }
  };

  return (
    <div className="section active">
      <InfoBox>
        <strong>출석체크 = 제휴몰 방문 후 복귀 시 적립</strong> — 회원이 연결 제휴몰을 방문하고
        앱으로 복귀하면 일일 포인트가 지급됩니다. (헬스잇 UX) · 5일 연속 달성 시 이벤트 티켓 1장
        추가 지급.
      </InfoBox>

      <PointAttendanceStats stats={stats} isLoading={isStatsLoading} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <div className="card-grid">
          <AttendanceSettingsCard config={config} isSaving={isSaving} onSave={handleSaveSettings} />
          <AttendancePolicyCard config={config} />
        </div>
      )}
    </div>
  );
};
