import React from 'react';
import type { Banner} from './banner-card';
import { BannerCard } from './banner-card';

interface BannerGridProps {
  banners: Banner[];
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
  onStatusToggle?: (banner: Banner) => void;
  showActions?: boolean;
  className?: string;
}

export const BannerGrid: React.FC<BannerGridProps> = ({
  banners,
  onEdit,
  onDelete,
  onStatusToggle,
  showActions = true,
  className = '',
}) => {
  if (banners.length === 0) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-2)',
          fontSize: '14px',
        }}
      >
        등록된 배너가 없습니다.
      </div>
    );
  }

  return (
    <div className={`banner-grid ${className}`}>
      {banners.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
          showActions={showActions}
        />
      ))}
    </div>
  );
};
