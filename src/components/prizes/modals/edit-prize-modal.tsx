'use client';

import React, { useState } from 'react';
import { Modal } from 'src/components/common/modal';

interface PrizeConfig {
  level1Name: string;
  level1Prob: number;
  level1Daily: number;
  level2Name: string;
  level2Prob: number;
  level2Daily: number;
  level3Name: string;
}

interface EditPrizeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PrizeConfig) => void;
  initialData?: PrizeConfig;
}

export const EditPrizeModal: React.FC<EditPrizeModalProps> = ({
  open,
  onClose,
  onSave,
  initialData = {
    level1Name: '스타벅스 아메리카노 (Tall)',
    level1Prob: 5,
    level1Daily: 10,
    level2Name: '편의점 아이스크림 교환권',
    level2Prob: 15,
    level2Daily: 30,
    level3Name: '꽝 (재도전 기회)',
  },
}) => {
  const [formData, setFormData] = useState<PrizeConfig>(initialData);

  const handleChange = (field: keyof PrizeConfig, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const totalProb = (formData.level1Prob || 0) + (formData.level2Prob || 0);
  const remainingProb = Math.max(0, 100 - totalProb);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="경품 설정 수정"
      width="500px"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            저장
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div className="info-box">
          1등 + 2등 + 3등 확률 합계 = <strong>100%</strong>
          <br />
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
            현재 합계: {totalProb}% (3등: {remainingProb}%)
          </span>
        </div>

        {/* 1등 */}
        <div style={{ marginBottom: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prize-level1-name">
              1등 경품
            </label>
            <input
              id="prize-level1-name"
              className="form-input"
              type="text"
              value={formData.level1Name}
              onChange={(e) => handleChange('level1Name', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="prize-level1-prob">
                1등 확률 (%)
              </label>
              <input
                id="prize-level1-prob"
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={formData.level1Prob}
                onChange={(e) => handleChange('level1Prob', parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prize-level1-daily">
                1일 최대
              </label>
              <input
                id="prize-level1-daily"
                className="form-input"
                type="number"
                min="0"
                value={formData.level1Daily}
                onChange={(e) => handleChange('level1Daily', parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
        </div>

        {/* 2등 */}
        <div style={{ marginBottom: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prize-level2-name">
              2등 경품
            </label>
            <input
              id="prize-level2-name"
              className="form-input"
              type="text"
              value={formData.level2Name}
              onChange={(e) => handleChange('level2Name', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="prize-level2-prob">
                2등 확률 (%)
              </label>
              <input
                id="prize-level2-prob"
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={formData.level2Prob}
                onChange={(e) => handleChange('level2Prob', parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prize-level2-daily">
                1일 최대
              </label>
              <input
                id="prize-level2-daily"
                className="form-input"
                type="number"
                min="0"
                value={formData.level2Daily}
                onChange={(e) => handleChange('level2Daily', parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
        </div>

        {/* 3등 */}
        <div className="form-group">
          <label className="form-label" htmlFor="prize-level3-name">
            3등 경품
          </label>
          <input
            id="prize-level3-name"
            className="form-input"
            type="text"
            value={formData.level3Name}
            onChange={(e) => handleChange('level3Name', e.target.value)}
          />
          {/* <div className="form-hint">자동 계산: {remainingProb}% (나머지 확률)</div> */}
        </div>
      </div>
    </Modal>
  );
};
