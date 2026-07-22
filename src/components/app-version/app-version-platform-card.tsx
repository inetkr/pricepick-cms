import React from 'react';
import type { IAppVersionConfigValue } from 'src/types/config/app_version_config';
import { PolicyItem } from '../common/policy-item';

interface AppVersionPlatformCardProps {
  title: string;
  config: IAppVersionConfigValue;
  onEdit: () => void;
}

export const AppVersionPlatformCard: React.FC<AppVersionPlatformCardProps> = ({
  title,
  config,
  onEdit,
}) => {
  const isForceUpdateActive = config.force_update === 'ACTIVE';
  const hasLatestVersion = Boolean(config.latest_version);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
          수정
        </button>
      </div>
      <div>
        <PolicyItem
          label="최신 버전"
          value={hasLatestVersion ? config.latest_version : '—'}
          description={config.release_date ? `${config.release_date} 배포` : '배포 이력 없음'}
        />
        <PolicyItem
          label="최신 지원 버전"
          value={config.min_supported_version || '—'}
          description="강제 업데이트 기준"
        />
        <PolicyItem
          label="강제 업데이트"
          value={
            <span className={`badge ${isForceUpdateActive ? 'badge-green' : 'badge-gray'}`}>
              {isForceUpdateActive ? '활성' : '비활성'}
            </span>
          }
        />
        <PolicyItem
          label="스토어 링크"
          value={
            config.store_link ? (
              <a
                href={config.store_link}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '12px', color: 'var(--info)', wordBreak: 'break-all' }}
              >
                {config.store_link}
              </a>
            ) : (
              '—'
            )
          }
        />
        {config.release_note && <PolicyItem label="배포 노트" value={config.release_note} />}
      </div>
    </div>
  );
};
