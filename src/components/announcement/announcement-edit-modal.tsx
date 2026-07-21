'use client';

import React, { useEffect, useState } from 'react';
import { ANNOUNCEMENT_TYPE_OPTIONS } from 'src/constants/announcement';
import { Modal } from '../common/modal';
import type { IAnnouncement, IAnnouncementType } from 'src/types/announcement';

interface AnnouncementEditModalProps {
  isOpen: boolean;
  announcement: IAnnouncement | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    data: { title: string; content: string; type: IAnnouncementType; is_published: boolean }
  ) => void;
}

export const AnnouncementEditModal: React.FC<AnnouncementEditModalProps> = ({
  isOpen,
  announcement,
  isSaving,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IAnnouncementType>('NORMAL');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setType(announcement.type);
      setContent(announcement.content);
    }
  }, [announcement]);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !isSaving;

  const handleSubmit = (is_published: boolean) => {
    if (!announcement || !canSubmit) return;
    onSave(announcement.id, { title: title.trim(), content: content.trim(), type, is_published });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="공지 수정"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
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
            {isSaving ? '저장 중...' : '게시'}
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label" htmlFor="announcement-edit-title">
            제목
          </label>
          <input
            id="announcement-edit-title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="announcement-edit-type">
            분류
          </label>
          <select
            id="announcement-edit-type"
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
        <div className="form-group">
          <label className="form-label" htmlFor="announcement-edit-content">
            내용
          </label>
          <textarea
            id="announcement-edit-content"
            className="terms-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
