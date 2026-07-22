'use client';

import React, { useEffect, useState } from 'react';
import type {
  IAppVersionConfigValue,
  IAppVersionPlatform,
} from 'src/types/config/app_version_config';
import { Modal } from '../common/modal';

interface AppVersionEditModalProps {
  open: boolean;
  platform: IAppVersionPlatform | null;
  config: IAppVersionConfigValue;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (platform: IAppVersionPlatform, next: IAppVersionConfigValue) => void;
}

const platformLabels: Record<IAppVersionPlatform, string> = {
  ios: 'iOS',
  android: 'Android',
};

const emptyConfig: IAppVersionConfigValue = {
  latest_version: '',
  min_supported_version: '',
  force_update: 'INACTIVE',
  store_link: '',
  release_note: '',
  release_date: '',
};

export const AppVersionEditModal: React.FC<AppVersionEditModalProps> = ({
  open,
  platform,
  config,
  isSaving,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<IAppVersionConfigValue>(emptyConfig);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(config);
      setError('');
    }
  }, [open, config]);

  if (!open || !platform) return null;

  const handleSubmit = () => {
    if (!form.latest_version.trim() || !form.min_supported_version.trim()) {
      setError('최신 버전과 최신 지원 버전을 입력하세요.');
      return;
    }
    onSubmit(platform, {
      ...form,
      latest_version: form.latest_version.trim(),
      min_supported_version: form.min_supported_version.trim(),
      store_link: form.store_link.trim(),
      release_note: form.release_note.trim(),
      release_date: form.release_date || new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${platformLabels[platform]} 앱 버전 수정`}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? '등록 중...' : '등록'}
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div className="warn-box">
          <strong>주의:</strong> 강제 업데이트 활성화 시 최소버전 미만 사용자는 즉시 앱 접속이
          차단됩니다.
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="av-edit-platform">
              플랫폼
            </label>
            <select id="av-edit-platform" className="form-select" value={platform} disabled>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="av-edit-latest">
              최신 버전
            </label>
            <input
              id="av-edit-latest"
              className="form-input"
              placeholder="예: 1.4.3"
              value={form.latest_version}
              onChange={(e) => setForm((prev) => ({ ...prev, latest_version: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="av-edit-min">
              최신 지원 버전 (강제 업데이트 기준)
            </label>
            <input
              id="av-edit-min"
              className="form-input"
              placeholder="예: 1.3.0"
              value={form.min_supported_version}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, min_supported_version: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="av-edit-force">
              강제 업데이트
            </label>
            <select
              id="av-edit-force"
              className="form-select"
              value={form.force_update}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  force_update: e.target.value as IAppVersionConfigValue['force_update'],
                }))
              }
            >
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="av-edit-link">
            스토어 링크
          </label>
          <input
            id="av-edit-link"
            className="form-input"
            placeholder={
              platform === 'ios' ? 'apps.apple.com/...' : 'play.google.com/...'
            }
            value={form.store_link}
            onChange={(e) => setForm((prev) => ({ ...prev, store_link: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="av-edit-date">
            배포일
          </label>
          <input
            id="av-edit-date"
            className="form-input"
            type="date"
            value={form.release_date}
            onChange={(e) => setForm((prev) => ({ ...prev, release_date: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="av-edit-note">
            배포 노트
          </label>
          <textarea
            id="av-edit-note"
            className="form-input"
            placeholder="예: 포스트백 오류 수정, UI 개선"
            value={form.release_note}
            onChange={(e) => setForm((prev) => ({ ...prev, release_note: e.target.value }))}
          />
        </div>
        {error && (
          <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '-4px' }}>
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};
