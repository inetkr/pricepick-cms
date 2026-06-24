'use client';

import React, { useState, useEffect } from 'react';

export interface NoticeFormData {
  id?: number;
  title: string;
  category: string;
  content: string;
  isPublished: boolean;
  isPinned: boolean;
  isDraft?: boolean;
}

interface NoticeFormProps {
  initialData?: NoticeFormData;
  onSubmit?: (data: NoticeFormData) => void;
  onDraft?: (data: NoticeFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const categoryOptions = [
  { value: 'general', label: '일반' },
  { value: 'maintenance', label: '서비스 점검' },
  { value: 'update', label: '업데이트' },
  { value: 'policy', label: '정책 변경' },
  { value: 'event', label: '이벤트' },
];

export const NoticeForm: React.FC<NoticeFormProps> = ({
  initialData,
  onSubmit,
  onDraft,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    category: 'general',
    content: '',
    isPublished: true,
    isPinned: false,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isPublished: initialData.isPublished ?? true,
        isPinned: initialData.isPinned ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof NoticeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleDraft = () => {
    onDraft?.({ ...formData, isPublished: false, isDraft: true });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{isEditing ? '공지 수정' : '공지 작성'}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '18px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '14px',
              marginBottom: '14px',
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '11px',
                  color: 'var(--text-2)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '.4px',
                }}
              >
                제목
              </label>
              <input
                className="search-box"
                style={{ width: '100%' }}
                placeholder="공지 제목"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '11px',
                  color: 'var(--text-2)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '.4px',
                }}
              >
                분류
              </label>
              <select
                className="filter-sel"
                style={{ width: '100%' }}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontSize: '11px',
                color: 'var(--text-2)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '.4px',
              }}
            >
              내용
            </label>
            <textarea
              className="terms-editor"
              style={{ minHeight: '110px' }}
              placeholder="공지 본문 (앱 마이 > 공지사항에 게시됩니다)"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <label
              style={{
                fontSize: '12px',
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
              />
              등록 즉시 앱에 노출
            </label>
            <label
              style={{
                fontSize: '12px',
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => handleChange('isPinned', e.target.checked)}
              />
              상단 고정
            </label>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleDraft}>
                임시저장
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
                취소
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? '수정' : '게시'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
