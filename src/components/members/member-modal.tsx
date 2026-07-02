'use client';

import React, { useState, useEffect } from 'react';
import type { IAccountStatus } from 'src/types/common';
import type { IUser } from 'src/types/users/user';

interface MemberModalProps {
  isOpen: boolean;
  member: IUser | null;
  onClose: () => void;
  onSave?: (member: IUser) => void;
  onTicketGrant?: (data: {
    user_identifier: string; // 닉네임 또는 UID
    action: 'ADMIN_ADD' | 'ADMIN_SUB';
    ticket_type: 'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD';
    amount: number;
    description: string;
  }) => void;
  isEditable?: boolean;
}

const MEMBER_STATUS_OPTIONS = [
  { value: 'NORMAL', label: '정상' },
  { value: 'BLOCK', label: '차단' },
  { value: 'DELETE', label: '탈퇴' },
];

const TICKET_GRADE_OPTIONS = [
  { value: 'BRONZE', label: '브론즈' },
  { value: 'SILVER', label: '실버' },
  { value: 'GOLD', label: '골드' },
  { value: 'EVENT', label: '이벤트' },
];

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onSave,
  onTicketGrant,
  isEditable = true,
}) => {
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [ticketGrade, setTicketGrade] = useState<'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD'>('BRONZE');
  const [ticketQty, setTicketQty] = useState(1);

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleStatusChange = (newStatus: IAccountStatus) => {
    setFormData({ ...formData, account_status: newStatus });
  };

  const handleSave = () => {
    if (onSave && formData) {
      onSave(formData as IUser);
    }
    onClose();
  };

  const handleTicketGrant = () => {
    if (onTicketGrant && member) {
      onTicketGrant({
        user_identifier: member.id,
        action: 'ADMIN_ADD',
        ticket_type: ticketGrade as 'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD',
        amount: ticketQty,
        description: '티켓 부여',
      });
    }
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">회원 상세</div>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="member-nickname">
                닉네임
              </label>
              <input
                id="member-nickname"
                className="form-input"
                value={formData.nickname || ''}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <div className="form-label">연동 계정</div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}
              >
                {member.kakao_info ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="member-type-kakao">카카오</span>
                    <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
                      {member.username}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#d97a17',
                        background: '#fdf1e3',
                        border: '1px solid #f3d2a0',
                        borderRadius: '10px',
                        padding: '1px 7px',
                      }}
                    >
                      게스트(미연동)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="member-status">
                상태
              </label>
              <select
                id="member-status"
                className="form-select"
                value={formData.account_status || 'NORMAL'}
                onChange={(e) => handleStatusChange(e.target.value as IAccountStatus)}
                disabled={!isEditable}
              >
                {MEMBER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="member-join-type">
                가입 유형
              </label>
              <input
                id="member-join-type"
                className="form-input"
                value={member.kakao_id ? '카카오 연동' : '게스트 (미연동)'}
                disabled
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">티켓 보유 현황</div>
            <div
              style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  id="m-random-wrap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 107, 85, 0.1)',
                    border: '1px solid rgba(255, 107, 85, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    opacity: 1,
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#C8200A' }}>
                    랜덤 티켓
                  </span>
                  <span
                    id="m-random-count"
                    style={{ fontSize: '15px', fontWeight: 800, color: '#C8200A' }}
                  >
                    {member.pending_random_tickets}
                  </span>
                </div>
                <div
                  id="m-conv-preview"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0px 4px' }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>전환예정 →</span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: 'rgba(205,127,50,.2)',
                      color: 'var(--bronze)',
                      border: '1px solid rgba(205,127,50,.35)',
                      borderRadius: '5px',
                      padding: '2px 7px',
                    }}
                  >
                    +1
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: 'rgba(192,192,192,.12)',
                      color: 'var(--silver)',
                      border: '1px solid rgba(192,192,192,.25)',
                      borderRadius: '5px',
                      padding: '2px 7px',
                    }}
                  >
                    +1
                  </span>
                </div>
              </div>

              <div
                id="m-bronze-wrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(205,127,50,.1)',
                  border: '1px solid rgba(205,127,50,.25)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  opacity: 1,
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--bronze)' }}>
                  브론즈
                </span>
                <span
                  id="m-bronze-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: 'var(--bronze)' }}
                >
                  {member.pending_bronze}
                </span>
              </div>

              <div
                id="m-silver-wrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(192,192,192,.1)',
                  border: '1px solid rgba(192,192,192,.3)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  opacity: 1,
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--silver)' }}>
                  실버
                </span>
                <span
                  id="m-silver-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: 'var(--silver)' }}
                >
                  {member.pending_silver}
                </span>
              </div>
              <div
                id="m-gold-wrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  opacity: 1,
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)' }}>
                  골드
                </span>
                <span
                  id="m-gold-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold)' }}
                >
                  {member.pending_gold}
                </span>
              </div>
              <div
                id="m-event-wrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(192, 132, 252, 0.1)',
                  border: '1px solid rgba(192, 132, 252, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  opacity: 1,
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#c084fc' }}>이벤트</span>
                <span
                  id="m-event-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: '#c084fc' }}
                >
                  {member.pending_event_tickets}
                </span>
              </div>
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text3)' }}>
              랜덤 티켓: 구매 후 연동 D+7 / 미연동 D+30 확정 시 등급 티켓으로 전환. 취소 시 자동
              환수.
            </div>
          </div>

          {isEditable && (
            <div className="form-group">
              <label className="form-label" htmlFor="member-ticket-grade">
                티켓 수동 지급
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  id="member-ticket-grade"
                  className="form-select"
                  style={{ width: '120px' }}
                  value={ticketGrade}
                  onChange={(e) =>
                    setTicketGrade(e.target.value as 'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD')
                  }
                >
                  {TICKET_GRADE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  className="form-input"
                  placeholder="수량"
                  type="number"
                  style={{ width: '100px' }}
                  value={ticketQty}
                  onChange={(e) => setTicketQty(Number(e.target.value))}
                  min={1}
                />
                <button type="button" className="btn btn-success" onClick={handleTicketGrant}>
                  지급
                </button>
              </div>
              <div className="form-hint">
                지급 이력은 티켓 내역에 &apos;관리자 지급&apos;으로 기록됩니다.
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            닫기
          </button>
          {isEditable && (
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
