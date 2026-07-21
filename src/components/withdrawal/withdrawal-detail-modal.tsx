'use client';

import React from 'react';
import type { IUser } from 'src/types/users/user';
import { formatDate } from 'src/utils/helper';

interface WithdrawalDetailModalProps {
  isOpen: boolean;
  member: IUser | null;
  onClose: () => void;
}

const formatDateTime = (date: string | null) => {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
    d.getSeconds()
  ).padStart(2, '0')}`;
  return `${formatDate(date, 'YYYY/MM/DD')} ${time}`;
};

export const WithdrawalDetailModal: React.FC<WithdrawalDetailModalProps> = ({
  isOpen,
  member,
  onClose,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal" style={{ minWidth: '500px', width: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">탈퇴 회원 상세</div>
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
              <label className="form-label" htmlFor="wd-nickname">
                닉네임
              </label>
              <input id="wd-nickname" className="form-input" value={member.nickname} disabled />
            </div>
            <div className="form-group">
              <div className="form-label">연동 계정(탈퇴 전)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
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
              <div className="form-label">상태</div>
              <div style={{ marginTop: '6px' }}>
                <span className="badge badge-gray">탈퇴 완료</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wd-join-type">
                가입 유형(탈퇴 전)
              </label>
              <input
                id="wd-join-type"
                className="form-input"
                value={member.kakao_id ? '카카오 연동' : '게스트 (미연동)'}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wd-doc-id">
                식별 아이디
              </label>
              <input
                id="wd-doc-id"
                className="form-input"
                disabled
                value={member.identified_id}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wd-deleted-at">
                탈퇴일시
              </label>
              <input
                id="wd-deleted-at"
                className="form-input"
                disabled
                value={formatDateTime(member.deleted_at)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">개인정보(PII) 처리</div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-2)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: '10px 12px',
                marginTop: '4px',
              }}
            >
              닉네임·카카오 정보는 탈퇴 즉시 스크랩되었습니다. 회원 레코드는 삭제되지 않고
              user_id로만 연결되어 거래·정산 기록 조회 목적으로 유지됩니다(재로그인·복구 불가).
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
