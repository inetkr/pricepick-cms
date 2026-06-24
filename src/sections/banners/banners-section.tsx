'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Banner } from 'src/components/banners/banner-card';
import { BannerGrid } from 'src/components/banners/banner-grid';
import { BannerFormData, BannerModal } from 'src/components/banners/banner-modal';

// Mock data từ file gốc
const mockBanners: Banner[] = [
  {
    id: 1,
    title: '이번 주 추첨 참여하기',
    background: 'linear-gradient(135deg,#845EEE,#C6AFFF)',
    period: '05/05 ~ 05/12',
    link: '/benefits/draw',
    status: 'active',
  },
  {
    id: 2,
    title: '신규 가입 티켓 3장 증정',
    background: 'linear-gradient(135deg,#FFD89B,#FF7EB3)',
    period: '상시',
    link: '/onboarding',
    status: 'active',
  },
  {
    id: 3,
    title: '골드 등급 전용 이벤트',
    background: 'linear-gradient(135deg,#1A1130,#4A3080)',
    period: '05/01 ~ 05/31',
    link: '/benefits/grade',
    status: 'inactive',
  },
];

export const BannersSection: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);

  const handleAddBanner = () => {
    setEditingBanner(undefined);
    setIsModalOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDeleteBanner = (banner: Banner) => {
    if (confirm(`${banner.title} 배너를 삭제하시겠습니까?`)) {
      setBanners((prev) => prev.filter((b) => b.id !== banner.id));
      toast.success('배너가 삭제되었습니다.');
    }
  };

  const handleStatusToggle = (banner: Banner) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
      )
    );
    toast.success('배너 상태가 변경되었습니다.');
  };

  const handleSaveBanner = (data: BannerFormData) => {
    if (editingBanner) {
      // Edit
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                title: data.title,
                background: data.background,
                link: data.link,
                period: `${data.startDate} ~ ${data.endDate}`,
                status: data.status,
              }
            : b
        )
      );
      toast.success('배너가 수정되었습니다.');
    } else {
      // Add new
      const newBanner: Banner = {
        id: Date.now(),
        title: data.title,
        background: data.background,
        link: data.link,
        period: `${data.startDate} ~ ${data.endDate}`,
        status: data.status,
      };
      setBanners((prev) => [...prev, newBanner]);
      toast.success('배너가 추가되었습니다.');
    }
    setIsModalOpen(false);
  };

  const getInitialFormData = (): BannerFormData | undefined => {
    if (editingBanner) {
      const [startDate, endDate] = editingBanner.period.split(' ~ ');
      return {
        id: editingBanner.id,
        title: editingBanner.title,
        background: editingBanner.background,
        link: editingBanner.link,
        startDate: startDate || '',
        endDate: endDate || '',
        status: editingBanner.status,
      };
    }
    return undefined;
  };

  return (
    <div className="section active">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">배너 관리</div>
            <div className="card-sub">
              홈 상단 슬라이드 · 현재 {banners.filter((b) => b.status === 'active').length}개 노출
            </div>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAddBanner}>
            + 배너 추가
          </button>
        </div>
        <BannerGrid
          banners={banners}
          onEdit={handleEditBanner}
          onDelete={handleDeleteBanner}
          onStatusToggle={handleStatusToggle}
        />
      </div>

      <BannerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBanner}
        initialData={getInitialFormData()}
        title={editingBanner ? '배너 수정' : '배너 추가'}
      />
    </div>
  );
};
