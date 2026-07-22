'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { AppVersionEditModal } from 'src/components/app-version/app-version-edit-modal';
import { AppVersionPlatformCard } from 'src/components/app-version/app-version-platform-card';
import { InfoBox } from 'src/components/common/info-box';
import { useAppVersion } from 'src/sections/app-version/hooks/use-app-version';
import type {
  IAppVersionConfigValue,
  IAppVersionPlatform,
} from 'src/types/config/app_version_config';

const platformLabels: Record<IAppVersionPlatform, string> = {
  ios: 'iOS',
  android: 'Android',
};

export const AppVersionSection: React.FC = () => {
  const { configs, isLoading, savingPlatform, saveConfig } = useAppVersion();
  const [editPlatform, setEditPlatform] = useState<IAppVersionPlatform | null>(null);

  const handleSave = async (platform: IAppVersionPlatform, next: IAppVersionConfigValue) => {
    const ok = await saveConfig(platform, next);
    if (ok) {
      setEditPlatform(null);
      toast.success(`${platformLabels[platform]} 버전이 등록되었습니다.`);
    } else {
      toast.error(`${platformLabels[platform]} 버전 등록에 실패했습니다.`);
    }
  };

  return (
    <div className="section active" id="sec-appver">
      <InfoBox>
        <strong>강제 업데이트 게이트</strong> — &apos;최신 지원 버전&apos; 미만 사용자는 앱 진입
        시 강제 업데이트로 차단합니다(결함·보안 패치 시 구버전 차단 필수).
      </InfoBox>
      <InfoBox type="warning">
        <strong>주의</strong> — 강제 업데이트 활성화 시 최신버전 미만 사용자는 즉시 앱 접속이
        차단됩니다.
      </InfoBox>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <div className="card-grid">
          <AppVersionPlatformCard
            title="iOS"
            config={configs.ios}
            onEdit={() => setEditPlatform('ios')}
          />
          <AppVersionPlatformCard
            title="Android"
            config={configs.android}
            onEdit={() => setEditPlatform('android')}
          />
        </div>
      )}

      <AppVersionEditModal
        open={editPlatform !== null}
        platform={editPlatform}
        config={editPlatform ? configs[editPlatform] : configs.ios}
        isSaving={savingPlatform === editPlatform}
        onClose={() => setEditPlatform(null)}
        onSubmit={handleSave}
      />
    </div>
  );
};
