import React from 'react';

export interface Banner {
  id: string | number;
  title: string;
  description?: string;
  background: string;
  period: string;
  link: string;
  status: 'active' | 'inactive';
  // Thêm các trường khác nếu cần
}

interface BannerCardProps {
  banner: Banner;
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
  onStatusToggle?: (banner: Banner) => void;
  showActions?: boolean;
}

const statusMap = {
  active: { label: '노출 중', className: 'badge-green' },
  inactive: { label: '비노출', className: 'badge-gray' },
};

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  onEdit,
  onDelete,
  onStatusToggle,
  showActions = true,
}) => {
  const status = statusMap[banner.status];

  return (
    <div className="banner-card">
      <div className="banner-preview" style={{ background: banner.background }}>
        {banner.title}
      </div>
      <div className="banner-info">
        <div className="banner-name">{banner.title}</div>
        <div className="banner-meta">
          {banner.period} &nbsp;·&nbsp; {banner.link}
        </div>
        <div className="banner-meta" style={{ marginTop: '4px' }}>
          <span className={`badge ${status.className}`}>{status.label}</span>
        </div>
        {showActions && (
          <div className="banner-actions">
            {onEdit && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(banner)}>
                수정
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(banner)}
              >
                삭제
              </button>
            )}
            {onStatusToggle && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onStatusToggle(banner)}
              >
                {banner.status === 'active' ? '숨기기' : '노출'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
