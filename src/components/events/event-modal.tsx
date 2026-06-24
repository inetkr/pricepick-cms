'use client';

import React, { useState, useEffect } from 'react';

export interface EventFormData {
  title: string;
  type: string;
  ticketCount: number;
  target: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  title?: string;
}

const eventTypes = [
  { value: 'attendance', label: '출석 이벤트' },
  { value: 'welcome', label: '가입 보너스' },
  { value: 'grade', label: '등급 달성' },
  { value: 'manual', label: '직접 지급' },
];

const targetOptions = [
  { value: 'all', label: '전체 회원' },
  { value: 'new', label: '신규 가입자' },
  { value: 'bronze', label: '브론즈' },
  { value: 'silver', label: '실버' },
  { value: 'gold', label: '골드' },
];

export const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  onSave,
  initialData = {},
  title = '이벤트 수정',
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: 'attendance',
    ticketCount: 1,
    target: 'all',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    isActive: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">이벤트명</label>
              <input
                className="form-input"
                placeholder="이벤트명"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">유형</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {eventTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">지급 티켓 수</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="3"
                  value={formData.ticketCount}
                  onChange={(e) => handleChange('ticketCount', parseInt(e.target.value) || 0)}
                  min={1}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">대상</label>
                <select
                  className="form-select"
                  value={formData.target}
                  onChange={(e) => handleChange('target', e.target.value)}
                >
                  {targetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">시작일</label>
                <input
                  className="form-input"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">종료일</label>
                <input
                  className="form-input"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">활성화</label>
              <div className="toggle-row" style={{ marginTop: '6px' }}>
                <div
                  className={`toggle ${formData.isActive ? 'on' : ''}`}
                  onClick={() => handleChange('isActive', !formData.isActive)}
                />
                <span className="toggle-label">{formData.isActive ? '활성' : '비활성'}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
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
