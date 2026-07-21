'use client';

import React, { useState } from 'react';
import { ANNOUNCEMENT_TYPE_OPTIONS } from 'src/constants/announcement';
import type { IAnnouncementType } from 'src/types/announcement';

interface AnnouncementFormCardProps {
  isSaving: boolean;
  onSubmit: (data: {
    title: string;
    content: string;
    type: IAnnouncementType;
    isPublished: boolean;
  }) => Promise<boolean>;
}

export const AnnouncementFormCard: React.FC<AnnouncementFormCardProps> = ({
  isSaving,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IAnnouncementType>('NORMAL');
  const [content, setContent] = useState('');

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !isSaving;

  const handleSubmit = async (isPublished: boolean) => {
    if (!canSubmit) return;
    const ok = await onSubmit({ title: title.trim(), content: content.trim(), type, isPublished });
    if (ok) {
      setTitle('');
      setType('NORMAL');
      setContent('');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div className="card-header">
        <div className="card-title">공지 작성</div>
      </div>
      <div style={{ padding: '18px' }}>
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label" htmlFor="announcement-title">
              제목
            </label>
            <input
              id="announcement-title"
              className="form-input"
              placeholder="공지 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="announcement-type">
              분류
            </label>
            <select
              id="announcement-type"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value as IAnnouncementType)}
            >
              {ANNOUNCEMENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="announcement-content">
            내용
          </label>
          <textarea
            id="announcement-content"
            className="form-input"
            style={{ minHeight: '140px', resize: 'vertical' }}
            placeholder="공지 본문 (앱 마이 > 공지사항에 게시됩니다)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={!canSubmit}
            onClick={() => handleSubmit(false)}
          >
            임시저장
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canSubmit}
            onClick={() => handleSubmit(true)}
          >
            게시
          </button>
        </div>
      </div>
    </div>
  );
};
