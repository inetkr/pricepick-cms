'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from 'src/components/common/modal';
import { DrawPrizeRowsEditor } from 'src/components/draws/draw-prize-rows-editor';
import type { IDrawPrize } from 'src/types/draws/draw';

export type DrawCreateInput = {
  round_name: string;
  start_date: string;
  end_date: string;
  prizes: IDrawPrize[];
};

interface DrawCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DrawCreateInput) => void;
}

const DEFAULT_PRIZES: IDrawPrize[] = [
  { rank: '1등', name: '', winner_count: 1 },
  { rank: '2등', name: '', winner_count: 3 },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export const DrawCreateModal: React.FC<DrawCreateModalProps> = ({ open, onClose, onSubmit }) => {
  const [roundName, setRoundName] = useState('');
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState('');
  const [prizes, setPrizes] = useState<IDrawPrize[]>(DEFAULT_PRIZES);

  const resetForm = () => {
    setRoundName('');
    setStartDate(todayStr());
    setEndDate('');
    setPrizes(DEFAULT_PRIZES);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!roundName.trim()) {
      toast.error('회차명을 입력하세요.');
      return;
    }
    if (!endDate) {
      toast.error('마감일을 입력하세요.');
      return;
    }
    if (endDate < startDate) {
      toast.error('마감일은 시작일 이후여야 합니다.');
      return;
    }
    if (prizes.some((p) => !p.name.trim())) {
      toast.error('경품명을 모두 입력하세요.');
      return;
    }

    onSubmit({ round_name: roundName.trim(), start_date: startDate, end_date: endDate, prizes });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="새 추첨 회차 등록"
      width="580px"
      footer={
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          회차 등록
        </button>
      }
    >
      <div className="modal-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="draw-round-name">
              회차명
            </label>
            <input
              id="draw-round-name"
              className="form-input"
              placeholder="예: 13회차 경품 추첨"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="draw-total-tickets">
              총 참여 티켓 소모
            </label>
            <input
              id="draw-total-tickets"
              className="form-input"
              value="0"
              readOnly
              style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="draw-start-date">
              시작일
            </label>
            <input
              id="draw-start-date"
              className="form-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="draw-end-date">
              마감일
            </label>
            <input
              id="draw-end-date"
              className="form-input"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <DrawPrizeRowsEditor prizes={prizes} onChange={setPrizes} />
        </div>
      </div>
    </Modal>
  );
};
