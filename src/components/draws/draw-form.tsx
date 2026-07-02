'use client';

import React, { useState } from 'react';

interface PrizeRow {
  rank: string;
  name: string;
  winnerCount: number;
}

interface DrawFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export const DrawForm: React.FC<DrawFormProps> = ({ onSubmit, onCancel }) => {
  const [roundName, setRoundName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizes, setPrizes] = useState<PrizeRow[]>([
    { rank: '1등', name: '', winnerCount: 1 },
    { rank: '2등', name: '', winnerCount: 3 },
  ]);

  const addPrizeRow = () => {
    const rankLabels = ['1등', '2등', '3등', '4등', '5등'];
    const newRank = rankLabels[prizes.length] || `${prizes.length + 1}등`;
    setPrizes([...prizes, { rank: newRank, name: '', winnerCount: 1 }]);
  };

  const removePrizeRow = (index: number) => {
    if (prizes.length <= 1) return;
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const updatePrize = (index: number, field: keyof PrizeRow, value: any) => {
    const updated = [...prizes];
    updated[index] = { ...updated[index], [field]: value };
    setPrizes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      roundName,
      startDate,
      endDate,
      prizes,
    });
  };

  return (
    <div className="card" id="draw-create-card">
      <div className="card-header">
        <div className="card-title">새 추첨 회차 등록</div>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '18px' }}>
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
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="draw-total-tickets">
              총 참여 티켓 소모
            </label>
            <input
              id="draw-total-tickets"
              className="form-input"
              placeholder="자동 계산"
              readOnly
              style={{ background: 'var(--bg-sub)', color: 'var(--text-sub)' }}
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
              required
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
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 등수별 경품 구성 */}
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div className="form-label" style={{ margin: 0 }}>
              등수별 경품 구성
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addPrizeRow}>
              + 등수 추가
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 36px',
              gap: '8px',
              marginBottom: '6px',
              padding: '0 4px',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>등수</span>
            <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>경품명</span>
            <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>당첨자 수</span>
            <span />
          </div>
          {prizes.map((prize, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 100px 36px',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <select
                className="form-select"
                style={{ fontSize: '13px' }}
                value={prize.rank}
                onChange={(e) => updatePrize(index, 'rank', e.target.value)}
              >
                <option>1등</option>
                <option>2등</option>
                <option>3등</option>
                <option>4등</option>
                <option>5등</option>
              </select>
              <input
                className="form-input"
                style={{ fontSize: '13px' }}
                placeholder="예: 에어팟 프로 2세대"
                value={prize.name}
                onChange={(e) => updatePrize(index, 'name', e.target.value)}
                required
              />
              <input
                className="form-input"
                style={{ fontSize: '13px', textAlign: 'center' }}
                type="number"
                value={prize.winnerCount}
                min={1}
                onChange={(e) =>
                  updatePrize(index, 'winnerCount', parseInt(e.target.value, 10) || 1)
                }
                required
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ padding: 0, width: '36px', color: 'var(--danger)' }}
                onClick={() => removePrizeRow(index)}
                disabled={prizes.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button type="submit" className="btn btn-primary">
            회차 등록
          </button>
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
