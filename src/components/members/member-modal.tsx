'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { IAccountStatus, IAdminTicketType } from 'src/types/common';
import type { IUser } from 'src/types/users/user';
import { MemberReceivedNotifications } from './member-received-notifications';
import { MemberStatusHistory } from './member-status-history';

// 서버(update_status)의 사유 최대 길이
const STATUS_REASON_MAX_LENGTH = 500;

interface MemberModalProps {
  isOpen: boolean;
  member: IUser | null;
  onClose: () => void;
  // 저장이 끝나면 성공 여부를 돌려준다 — 실패하면 모달을 닫지 않고 입력값을 그대로 둔다
  onSave?: (member: IUser, statusReason: string) => Promise<boolean>;
  onTicketGrant?: (data: {
    user_identifier: string; // 닉네임 또는 UID
    action: 'ADMIN_ADD' | 'ADMIN_SUB';
    ticket_type: IAdminTicketType;
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

// 티켓 단일화 — 등급 없이 티켓·이벤트 티켓 두 가지만 지급/회수한다
const TICKET_GRADE_OPTIONS: { value: IAdminTicketType; label: string }[] = [
  { value: 'TICKET', label: '티켓' },
  { value: 'EVENT_TICKET', label: '이벤트 티켓' },
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
  const [ticketGrade, setTicketGrade] = useState<IAdminTicketType>('TICKET');
  // 수량은 빈 칸으로 시작한다 — 「수량」 안내 문구가 보이도록
  const [ticketQty, setTicketQty] = useState('');
  const [ticketReason, setTicketReason] = useState('');
  // 상태를 바꿀 때 함께 보내는 사유 — update_status API에서 필수
  const [statusReason, setStatusReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData(member);
      setTicketGrade('TICKET');
      setTicketQty('');
      setTicketReason('');
      setStatusReason('');
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const isDeletedMember = member.account_status === 'DELETE';
  const isSuspendedMember = member.account_status === 'BLOCK';
  const canEdit = isEditable && !isDeletedMember;
  const canEditTickets = canEdit && !isSuspendedMember;

  const handleStatusChange = (newStatus: IAccountStatus) => {
    if (!canEdit) return;
    setFormData({ ...formData, account_status: newStatus });
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;
    const statusChanged = formData.account_status !== member.account_status;
    if (statusChanged && !statusReason.trim()) {
      toast.error('상태를 바꿀 때는 사유를 입력해 주세요.');
      return;
    }
    setIsSaving(true);
    try {
      const ok = await onSave(formData as IUser, statusReason);
      if (ok) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // 지급·차감 모두 사유가 있어야 보낸다 — 사유는 티켓 내역의 설명으로 남는다
  const handleTicketSubmit = (action: 'ADMIN_ADD' | 'ADMIN_SUB') => {
    const amount = Math.floor(Number(ticketQty));
    const reason = ticketReason.trim();
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('수량을 입력해 주세요.');
      return;
    }
    if (!reason) {
      toast.error('사유를 입력해 주세요.');
      return;
    }
    if (onTicketGrant && member) {
      onTicketGrant({
        user_identifier: member.id,
        action,
        ticket_type: ticketGrade,
        amount,
        description: reason,
      });
    }
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div
        className="modal"
        style={{
          minWidth: '500px',
          width: 'auto',
        }}
      >
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
          {isDeletedMember && (
            <div className="warn-box">탈퇴한 회원입니다. 정보를 수정할 수 없습니다.</div>
          )}
          {isSuspendedMember && (
            <div className="amber-box">차단된 회원입니다. 닉네임과 상태만 변경할 수 있습니다.</div>
          )}
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
                disabled={!canEdit}
              />
            </div>
            <div className="form-group">
              <div className="form-label">연동 계정</div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}
              >
                {member.kakao_info ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '5px',
                        background: '#FEE500',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      K
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
                      {member.kakao_info?.email || '(카카오 로그인ID 미등록)'}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>게스트(비연동)</span>
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
                disabled={!canEdit}
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
                value={member.kakao_info ? '카카오 연동' : '게스트'}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="m-doc-id">
                식별 아이디
              </label>
              <input
                className="form-input"
                id="m-doc-id"
                disabled
                value={member.identified_id}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
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
                  {member.pending_ticket > 0 && (
                    <>
                      <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>전환예정</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-2)' }}>
                        티켓 +{member.pending_ticket}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {/* 티켓 단일화 — 등급 없이 티켓 하나만 적는다 */}
              <div
                id="m-ticket-wrap"
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
                  티켓
                </span>
                <span
                  id="m-ticket-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: 'var(--bronze)' }}
                >
                  {member.ticket_total ?? 0}
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
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#c084fc' }}>
                  이벤트 티켓
                </span>
                <span
                  id="m-event-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: '#c084fc' }}
                >
                  {member.event_ticket_total ?? 0}
                </span>
              </div>
              {/* total_points는 문자열("200")로 온다 */}
              <div
                id="m-point-wrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#4f46e5' }}>포인트</span>
                <span
                  id="m-point-count"
                  style={{ fontSize: '15px', fontWeight: 800, color: '#4f46e5' }}
                >
                  {(Number(member.total_points) || 0).toLocaleString()}P
                </span>
              </div>
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text3)' }}>
              랜덤 티켓: 구매 후 전환 대기일 수가 지나면 티켓으로 전환. 취소 시 자동 환수.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="member-status-reason">
              상태 변경 이력
            </label>
            <input
              id="member-status-reason"
              className="form-input"
              placeholder="상태를 바꿀 때 사유 (필수)"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              maxLength={STATUS_REASON_MAX_LENGTH}
              disabled={!canEdit}
            />
            <MemberStatusHistory userId={member.id} />
          </div>

          <MemberReceivedNotifications userId={member.id} />

          {canEditTickets && (
            <div className="form-group">
              <label className="form-label" htmlFor="member-ticket-grade">
                티켓 수동 지급 · 차감
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  id="member-ticket-grade"
                  className="form-select"
                  style={{ width: '120px' }}
                  value={ticketGrade}
                  onChange={(e) => setTicketGrade(e.target.value as IAdminTicketType)}
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
                  onChange={(e) => setTicketQty(e.target.value)}
                  min={1}
                />
                <input
                  className="form-input"
                  placeholder="사유 (필수)"
                  style={{ width: '100px' }}
                  value={ticketReason}
                  onChange={(e) => setTicketReason(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleTicketSubmit('ADMIN_ADD')}
                >
                  지급
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleTicketSubmit('ADMIN_SUB')}
                >
                  차감
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
          {canEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
