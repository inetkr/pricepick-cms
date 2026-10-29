'use client';

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { userAPI } from 'src/api';
import type { IBlockDuration, IUserStatusHistory } from 'src/types/users/user_status_history';

// 회원 상세의 「상태 변경 이력」 목록 — 최신순. 사유 입력칸은 회원 상세 모달이 가진다.

interface MemberStatusHistoryProps {
  userId: string;
}

// 이력에서는 BLOCK을 「차단」으로 적는다
const STATUS_LABEL: Record<string, string> = {
  NORMAL: '정상',
  BLOCK: '차단',
  DELETE: '탈퇴',
};

export const BLOCK_DURATION_LABEL: Record<IBlockDuration, string> = {
  PERMANENT: '영구',
  DAYS_7: '7일',
  DAYS_30: '30일',
};

const renderStatus = (status: string | null) => (status ? (STATUS_LABEL[status] ?? status) : '-');

// 차단으로 바뀐 줄에는 기간을 붙인다 — 예: 「(7일 · ~2026/11/05)」, 「(영구)」
const renderBlockDuration = (row: IUserStatusHistory) => {
  if (row.to_status !== 'BLOCK' || !row.block_duration) return null;
  const label = BLOCK_DURATION_LABEL[row.block_duration] ?? row.block_duration;
  const until = row.blocked_until ? dayjs(row.blocked_until) : null;
  return ` (${label}${until?.isValid() ? ` · ~${until.format('YYYY/MM/DD')}` : ''})`;
};

const messageStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'center',
  color: 'var(--text-3)',
  fontSize: '12px',
};

const renderChangedAt = (createdAt: string) => {
  const date = dayjs(createdAt);
  return date.isValid() ? date.format('YYYY/MM/DD HH:mm:ss') : '-';
};

// 누가 바꿨는지 — 관리자는 이름(없으면 아이디), 회원 본인 탈퇴는 「회원 본인」
const renderChangedBy = (row: IUserStatusHistory) => {
  if (row.changed_by === 'SELF') return '회원 본인';
  return row.employee?.fullname || row.employee?.username || '관리자';
};

export const MemberStatusHistory: React.FC<MemberStatusHistoryProps> = ({ userId }) => {
  const [rows, setRows] = useState<IUserStatusHistory[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    userAPI
      .getStatusHistory(userId)
      .then((res) => {
        if (cancelled) return;
        setRows(res?.result?.object?.rows || []);
        setStatus('done');
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const renderContent = () => {
    if (status === 'loading') return <div style={messageStyle}>불러오는 중...</div>;
    if (status === 'error') return <div style={messageStyle}>불러오지 못했습니다.</div>;
    if (!rows.length) return <div style={messageStyle}>상태 변경 이력이 없습니다.</div>;
    // 왼쪽: 「정상 → 차단」 / 사유, 오른쪽: 변경한 사람 / 변경 시각
    return rows.map((row) => (
      <div
        key={row.id}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '10px 12px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
            {renderStatus(row.from_status)} → {renderStatus(row.to_status)}
            {renderBlockDuration(row)}
          </div>
          {row.reason && (
            <div
              style={{
                marginTop: '2px',
                fontSize: '12px',
                color: 'var(--text-3)',
                wordBreak: 'break-word',
              }}
            >
              {row.reason}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
            {renderChangedBy(row)}
          </div>
          <div style={{ marginTop: '2px', fontSize: '12px', color: 'var(--text-3)' }}>
            {renderChangedAt(row.created_at)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div
      style={{
        marginTop: '8px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      {renderContent()}
    </div>
  );
};
