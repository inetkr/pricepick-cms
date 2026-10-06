'use client';

import React, { useEffect, useState } from 'react';
import { userAPI } from 'src/api';
import { useDebounce } from 'src/hooks/use-debounce';
import type { IUser } from 'src/types/users/user';
import type { INotificationTestUser } from 'src/types/notification';
import { Modal } from '../common/modal';
import { Pagination } from '../common/pagination';
import { InfoBox } from '../stats/info-box';

// DEVQA 23 · 알림 테스트 발송 대상 선택
// 기존 회원 검색을 그대로 쓴다 — 테스트 계정을 따로 등록하는 메뉴는 두지 않는다.
// 발송 내역에는 「테스트」 배지로 남아 실제 발송 건수와 섞이지 않는다.

const PAGE_SIZE = 8;

type ITestPickUser = INotificationTestUser & { identified_id: string | null };

interface NotificationTestSendModalProps {
  open: boolean;
  title: string;
  content: string;
  isSending: boolean;
  onClose: () => void;
  onSend: (users: INotificationTestUser[]) => Promise<boolean>;
}

const listRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '8px 10px',
  borderBottom: '1px solid var(--border)',
};

const listBoxStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)',
  height: '240px',
  overflowY: 'auto',
};

const emptyStyle: React.CSSProperties = {
  padding: '14px',
  textAlign: 'center',
  color: 'var(--text-3)',
  fontSize: '12px',
};

const UserLine: React.FC<{ nickname: string; identifiedId: string | null }> = ({
  nickname,
  identifiedId,
}) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontWeight: 600, fontSize: '12px' }}>{nickname || '(닉네임 없음)'}</div>
    <div
      style={{
        fontSize: '11px',
        color: 'var(--text-3)',
        fontFamily: 'monospace',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {identifiedId || '-'}
    </div>
  </div>
);

export const NotificationTestSendModal: React.FC<NotificationTestSendModalProps> = ({
  open,
  title,
  content,
  isSending,
  onClose,
  onSend,
}) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<IUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [picked, setPicked] = useState<ITestPickUser[]>([]);
  const debouncedKeyword = useDebounce(keyword, 400);

  useEffect(() => {
    if (open) {
      setKeyword('');
      setPage(1);
      setResults([]);
      setTotalItems(0);
      setPicked([]);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  useEffect(() => {
    if (!open) return undefined;
    const trimmed = debouncedKeyword.trim();
    if (!trimmed) {
      setResults([]);
      setTotalItems(0);
      return undefined;
    }

    let cancelled = false;
    setIsSearching(true);
    userAPI
      .searchUserByKeyword(trimmed, page, PAGE_SIZE)
      .then((res) => {
        if (cancelled) return;
        setResults(res.result.object.rows || []);
        setTotalItems(res.result.object.count || 0);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setTotalItems(0);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, debouncedKeyword, page]);

  const isPicked = (id: string) => picked.some((u) => u.id === id);

  const handlePick = (user: IUser) => {
    if (isPicked(user.id)) return;
    setPicked((prev) => [
      ...prev,
      { id: user.id, nickname: user.nickname, identified_id: user.identified_id },
    ]);
  };

  const handleDrop = (id: string) => {
    setPicked((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSend = async () => {
    if (!picked.length || isSending) return;
    const ok = await onSend(picked.map(({ id, nickname }) => ({ id, nickname })));
    if (ok) onClose();
  };

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const renderResults = () => {
    if (!debouncedKeyword.trim()) {
      return <div style={emptyStyle}>닉네임 또는 식별 아이디로 검색하세요.</div>;
    }
    if (isSearching && !results.length) {
      return <div style={emptyStyle}>검색 중...</div>;
    }
    if (!results.length) {
      return <div style={emptyStyle}>검색 결과가 없습니다.</div>;
    }
    return results.map((user) => {
      const on = isPicked(user.id);
      return (
        <div key={user.id} style={listRowStyle}>
          <UserLine nickname={user.nickname} identifiedId={user.identified_id} />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={on}
            onClick={() => handlePick(user)}
          >
            {on ? '선택됨' : '선택'}
          </button>
        </div>
      );
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="테스트 발송 대상 선택"
      width="760px"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            닫기
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!picked.length || isSending}
            onClick={handleSend}
          >
            {isSending ? '발송 중...' : '선택 회원에게 즉시 발송'}
          </button>
        </>
      }
    >
      <div className="modal-body">
        <InfoBox style={{ marginBottom: '12px' }}>
          선택한 회원에게만 즉시 발송합니다. 발송 내역에는 <strong>테스트</strong> 배지로 남아 실제
          발송 건수와 섞이지 않습니다.
        </InfoBox>

        <div className="form-group">
          <div className="form-label">발송 내용</div>
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)',
              padding: '10px 12px',
              fontSize: '12px',
              color: 'var(--text-2)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
              {title || '(제목 없음)'}
            </div>
            {content || '(내용 없음)'}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="noti-test-q">
            회원 검색
          </label>
          <input
            id="noti-test-q"
            className="search-box"
            style={{ width: '100%' }}
            placeholder="닉네임 또는 식별 아이디"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ minWidth: 0 }}>
            <div className="form-label">검색 결과</div>
            <div style={listBoxStyle}>{renderResults()}</div>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={PAGE_SIZE}
                onPageChange={setPage}
                showSizeChanger={false}
                showTotal={false}
                maxVisiblePages={5}
              />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="form-label">
              선택한 회원{' '}
              {picked.length > 0 && (
                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>· {picked.length}명</span>
              )}
            </div>
            <div style={listBoxStyle}>
              {picked.length ? (
                picked.map((user) => (
                  <div key={user.id} style={listRowStyle}>
                    <UserLine nickname={user.nickname} identifiedId={user.identified_id} />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDrop(user.id)}
                    >
                      해제
                    </button>
                  </div>
                ))
              ) : (
                <div style={emptyStyle}>선택한 회원이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
