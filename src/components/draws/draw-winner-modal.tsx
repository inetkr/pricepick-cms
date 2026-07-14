'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from 'src/components/common/modal';
import { formatDateTime } from 'src/sections/draws/utils';
import type { IDraw, IDrawMode, IDrawPrize } from 'src/types/draws/draw';

export type DrawProcessInput = {
  winners: IDrawPrize[];
  draw_mode: IDrawMode;
  announce_at: string;
  notify_winners: boolean;
};

interface DrawWinnerModalProps {
  open: boolean;
  draw: IDraw | null;
  readOnly?: boolean;
  onClose: () => void;
  onSubmit: (data: DrawProcessInput) => void;
}

const defaultAnnounceAt = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export const DrawWinnerModal: React.FC<DrawWinnerModalProps> = ({
  open,
  draw,
  readOnly = false,
  onClose,
  onSubmit,
}) => {
  const [drawMode, setDrawMode] = useState<IDrawMode>('RANDOM');
  const [announceAt, setAnnounceAt] = useState(defaultAnnounceAt());
  const [notify, setNotify] = useState(true);
  const [winnerRows, setWinnerRows] = useState<IDrawPrize[]>([]);

  useEffect(() => {
    if (!draw) return;
    const source = draw.winners ?? draw.prizes;
    setWinnerRows(source.map((prize) => ({ ...prize })));
    setDrawMode(draw.draw_mode ?? 'RANDOM');
    setAnnounceAt(draw.announce_at ? draw.announce_at.slice(0, 16) : defaultAnnounceAt());
    setNotify(draw.notify_winners ?? true);
  }, [draw]);

  if (!draw) return null;

  const updateWinnerCount = (index: number, count: number) => {
    setWinnerRows((prev) => prev.map((row, i) => (i === index ? { ...row, winner_count: count } : row)));
  };

  const handleSubmit = () => {
    if (!announceAt) {
      toast.error('발표 일시를 입력하세요.');
      return;
    }
    if (winnerRows.some((row) => row.winner_count < 0)) {
      toast.error('당첨자 수는 0 이상이어야 합니다.');
      return;
    }
    onSubmit({ winners: winnerRows, draw_mode: drawMode, announce_at: announceAt, notify_winners: notify });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${readOnly ? '추첨 결과' : '당첨 처리'} — ${draw.round_name}`}
      width="500px"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {readOnly ? '닫기' : '취소'}
          </button>
          {!readOnly && (
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              추첨 실행
            </button>
          )}
        </>
      }
    >
      <div className="modal-body">
        <div className="info-box">
          선택한 추첨 회차의 경품 · 참여 티켓 · 마감 정보가 표시됩니다.
          {readOnly && draw.drawn_at && <> 추첨 실행일: {formatDateTime(draw.drawn_at)}</>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="draw-mode">
            추첨 방식
          </label>
          <select
            id="draw-mode"
            className="form-select"
            value={drawMode}
            onChange={(e) => setDrawMode(e.target.value as IDrawMode)}
            disabled={readOnly}
          >
            <option value="RANDOM">시스템 랜덤 추첨</option>
            <option value="MANUAL">수동 지정</option>
          </select>
        </div>

        <div className="form-group">
          <div className="form-label" style={{ marginBottom: '8px' }}>
            등수별 당첨자 확정
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1fr 90px',
              gap: '8px',
              marginBottom: '6px',
              padding: '0 2px',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>등수</span>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>경품</span>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>당첨자 수</span>
          </div>
          {winnerRows.map((row, index) => (
            <div
              key={row.rank}
              style={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr 90px',
                gap: '8px',
                marginBottom: '8px',
                alignItems: 'center',
              }}
            >
              <span className="badge badge-amber" style={{ justifySelf: 'start' }}>
                {row.rank}
              </span>
              <span style={{ fontSize: '13px' }}>{row.name}</span>
              <input
                className="form-input"
                type="number"
                min={0}
                value={row.winner_count}
                readOnly={readOnly}
                onChange={(e) => updateWinnerCount(index, parseInt(e.target.value, 10) || 0)}
                style={{ fontSize: '13px', textAlign: 'center' }}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="draw-announce-at">
            발표 일시
          </label>
          <input
            id="draw-announce-at"
            className="form-input"
            type="datetime-local"
            value={announceAt}
            onChange={(e) => setAnnounceAt(e.target.value)}
            disabled={readOnly}
          />
        </div>

        <div className="form-group">
          <div className="form-label">당첨 알림 발송</div>
          <div className="toggle-row" style={{ marginTop: '6px' }}>
            <div
              role="button"
              tabIndex={0}
              aria-label="당첨 알림 발송 전환"
              className={`toggle ${notify ? 'on' : ''}`}
              onClick={() => !readOnly && setNotify((v) => !v)}
              onKeyDown={(e) => {
                if (!readOnly && (e.key === 'Enter' || e.key === ' ')) setNotify((v) => !v);
              }}
            />
            <span className="toggle-label">당첨자에게 푸시 발송</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
