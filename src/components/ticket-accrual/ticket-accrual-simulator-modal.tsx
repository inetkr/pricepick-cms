'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components/common/modal';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';
import type { ITicketValueConfigValue } from 'src/types/config/ticket_value_config';
import { calcGreedyBreakdown } from 'src/utils/ticket-accrual';

interface TicketAccrualSimulatorModalProps {
  mall: IAffiliateMall | null;
  ticketValue: ITicketValueConfigValue;
  onClose: () => void;
}

const QUICK_AMOUNTS = [50000, 100000, 300000, 500000];

export const TicketAccrualSimulatorModal: React.FC<TicketAccrualSimulatorModalProps> = ({
  mall,
  ticketValue,
  onClose,
}) => {
  const [amount, setAmount] = useState(100000);

  useEffect(() => {
    if (mall) setAmount(100000);
  }, [mall]);

  if (!mall) return null;

  const revenue = Math.floor((amount * mall.feeRate) / 100);
  const budget = Math.floor((amount * mall.accrualRate) / 100);
  const breakdown = calcGreedyBreakdown(budget, ticketValue);
  const margin = revenue - breakdown.reward;
  const marginPct =
    revenue > 0 ? Math.round(((margin / revenue) * 100 + Number.EPSILON) * 10) / 10 : 0;
  const barFillPct = revenue > 0 ? Math.min(100, (breakdown.reward / revenue) * 100) : 0;

  return (
    <Modal
      open={!!mall}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEscape={false}
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          적립 시뮬레이터
          <span className="badge badge-purple">{mall.name}</span>
        </span>
      }
      width="460px"
      footer={
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label" htmlFor="ta-sim-amount">
            구매 금액
          </label>
          <div className="ta-sim-amount-box">
            <input
              id="ta-sim-amount"
              type="text"
              inputMode="numeric"
              value={amount.toLocaleString()}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
                setAmount(digitsOnly ? Number(digitsOnly) : 0);
              }}
            />
            <span className="ta-sim-amount-unit">원</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', margin: '10px 0 18px' }}>
          {QUICK_AMOUNTS.map((v) => (
            <button
              key={v}
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                flex: 1,
                borderRadius: '999px',
                borderColor: amount === v ? 'var(--main)' : undefined,
                color: amount === v ? 'var(--main)' : undefined,
              }}
              onClick={() => setAmount(v)}
            >
              {(v / 10000).toLocaleString()}만
            </button>
          ))}
        </div>

        <div
          className="card"
          style={{ padding: '16px 18px', marginBottom: '12px', background: 'var(--surface-2)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>매출(수수료)</span>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>
              {revenue.toLocaleString()}원{' '}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-3)' }}>
                ({mall.feeRate}%)
              </span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginTop: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>적립 비용(지급액)</span>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>
              {breakdown.reward.toLocaleString()}원{' '}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-3)' }}>
                ({mall.accrualRate}%)
              </span>
            </span>
          </div>
          <div className="ta-sim-bar">
            <div className="ta-sim-bar-fill" style={{ width: `${barFillPct}%` }} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>티켓 구성</span>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>
              {breakdown.gold === 0 && breakdown.silver === 0 && breakdown.bronze === 0 ? (
                <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>지급 티켓 없음</span>
              ) : (
                <>
                  {breakdown.gold > 0 && <span className="tk-gold">골드 {breakdown.gold}장</span>}{' '}
                  {breakdown.silver > 0 && (
                    <span className="tk-silver">실버 {breakdown.silver}장</span>
                  )}{' '}
                  {breakdown.bronze > 0 && (
                    <span className="tk-bronze">브론즈 {breakdown.bronze}장</span>
                  )}
                </>
              )}
            </span>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--main-soft)',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600 }}>수익(매출-적립)</span>
          <span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: margin < 0 ? 'var(--danger)' : 'var(--main)',
              }}
            >
              {margin.toLocaleString()}원
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                marginLeft: '4px',
                color: margin < 0 ? 'var(--danger)' : 'var(--main)',
              }}
            >
              ({marginPct}%)
            </span>
          </span>
        </div>
      </div>
    </Modal>
  );
};
