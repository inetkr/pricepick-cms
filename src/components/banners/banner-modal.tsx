'use client';

import React, { useState, useEffect } from 'react';

interface BannerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BannerFormData) => void;
  initialData?: BannerFormData;
  title?: string;
}

export interface BannerFormData {
  id?: string | number;
  title: string;
  background: string;
  link: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

const COLOR_PRESETS = [
  'linear-gradient(135deg,#845EEE,#C6AFFF)',
  'linear-gradient(135deg,#FFD89B,#FF7EB3)',
  'linear-gradient(135deg,#1A1130,#4A3080)',
  'linear-gradient(135deg,#10B981,#06B6D4)',
  'linear-gradient(135deg,#F97316,#EF4444)',
];

export const BannerModal: React.FC<BannerModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  title = '배너 수정',
}) => {
  const [formData, setFormData] = useState<BannerFormData>(
    initialData || {
      title: '',
      background: COLOR_PRESETS[0],
      link: '',
      startDate: '',
      endDate: '',
      status: 'active',
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (field: keyof BannerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, background: color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleStatusToggle = () => {
    handleChange('status', formData.status === 'active' ? 'inactive' : 'active');
  };

  return (
    <div
      className="modal-overlay open"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) handleClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button type="button" className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="banner-title">
                배너 제목
              </label>
              <input
                id="banner-title"
                className="form-input"
                placeholder="배너 제목"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-label">배경 컬러</div>
              <div className="color-presets">
                {COLOR_PRESETS.map((color) => (
                  <div
                    key={color}
                    role="button"
                    tabIndex={0}
                    aria-label={`색상 선택 ${color}`}
                    className={`color-dot ${formData.background === color ? 'sel' : ''}`}
                    style={{ background: color }}
                    onClick={() => handleColorSelect(color)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleColorSelect(color);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="banner-link">
                랜딩 링크
              </label>
              <input
                id="banner-link"
                className="form-input"
                placeholder="/benefits/draw"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="banner-start-date">
                  시작일
                </label>
                <input
                  id="banner-start-date"
                  className="form-input"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="banner-end-date">
                  종료일
                </label>
                <input
                  id="banner-end-date"
                  className="form-input"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">노출 상태</div>
              <div className="toggle-row" style={{ marginTop: '6px' }}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="노출 상태 전환"
                  className={`toggle ${formData.status === 'active' ? 'on' : ''}`}
                  onClick={handleStatusToggle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleStatusToggle();
                  }}
                />
                <span className="toggle-label">
                  {formData.status === 'active' ? '노출 중' : '비노출'}
                </span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={handleClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
