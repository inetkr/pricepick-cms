'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '../common/modal';
import type { IAnnouncement } from 'src/types/announcement';

interface AnnouncementEditModalProps {
  isOpen: boolean;
  announcement: IAnnouncement | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (id: string, data: { title: string; content: string }) => void;
}

export const AnnouncementEditModal: React.FC<AnnouncementEditModalProps> = ({
  isOpen,
  announcement,
  isSaving,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
    }
  }, [announcement]);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !isSaving;

  const handleSubmit = () => {
    if (!announcement || !canSubmit) return;
    onSave(announcement.id, { title: title.trim(), content: content.trim() });
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
          <button type="button" className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
            {isSaving ? '저장 중...' : '저장'}
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
          <label className="form-label" htmlFor="announcement-edit-content">
            내용
          </label>
          <textarea
            id="announcement-edit-content"
            className="form-input"
            style={{ minHeight: '160px', resize: 'vertical' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
