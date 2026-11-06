'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { userAPI } from 'src/api';
import { NOTIFICATION_INDIVIDUAL_MAX_USERS } from 'src/constants/notification';
import { useDebounce } from 'src/hooks/use-debounce';
import type { IUser } from 'src/types/users/user';
import { Modal } from '../common/modal';
import { Pagination } from '../common/pagination';

// 선택 개별 발송 대상 선택 — 기존 회원 검색을 그대로 쓴다.
// 고른 회원에게만 즉시 발송하고(예약 불가), 발송 기록에는 「개별 발송」으로 남는다.

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

type IPickUser = { id: string; nickname: string; identified_id: string | null };

interface NotificationIndividualSendModalProps {
  open: boolean;
  title: string;
  content: string;
  isSending: boolean;
  onClose: () => void;
  onSend: (userIds: string[]) => Promise<boolean>;
}

const UserLine: React.FC<{ nickname: string; identifiedId: string | null }> = ({
  nickname,
  identifiedId,
}) => (
  <>
    <span className="ni-pick-name">{nickname || '(닉네임 없음)'}</span>
    <span className="ni-pick-id">{identifiedId || '-'}</span>
  </>
);

export const NotificationIndividualSendModal: React.FC<NotificationIndividualSendModalProps> = ({
  open,
  title,
  content,
  isSending,
  onClose,
  onSend,
}) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [results, setResults] = useState<IUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [picked, setPicked] = useState<IPickUser[]>([]);
  const debouncedKeyword = useDebounce(keyword, 400);

  useEffect(() => {
    if (open) {
      setKeyword('');
      setPage(1);
      setPageSize(DEFAULT_PAGE_SIZE);
      setResults([]);
      setTotalItems(0);
      setPicked([]);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  // 검색어가 없으면 정상 회원 전체를 최근 가입순으로 보여 준다 — 회원 검색 API는 빈 검색어에 빈 목록을 준다
  useEffect(() => {
    if (!open) return undefined;
    const trimmed = debouncedKeyword.trim();

    let cancelled = false;
    setIsSearching(true);
    const request = trimmed
      ? userAPI.searchUserByKeyword(trimmed, page, pageSize)
      : userAPI.getUserList(page, pageSize, { account_status: 'NORMAL' });
    request
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
  }, [open, debouncedKeyword, page, pageSize]);

  const isPicked = (id: string) => picked.some((u) => u.id === id);

  const handleDrop = (id: string) => {
    setPicked((prev) => prev.filter((u) => u.id !== id));
  };

  // 검색 결과에서 한 번 더 누르면 선택이 풀린다
  const handleToggle = (user: IUser) => {
    if (isPicked(user.id)) {
      handleDrop(user.id);
      return;
    }
    if (picked.length >= NOTIFICATION_INDIVIDUAL_MAX_USERS) {
      toast.error(`한 번에 최대 ${NOTIFICATION_INDIVIDUAL_MAX_USERS}명까지 선택할 수 있습니다.`);
      return;
    }
    setPicked((prev) => [
      ...prev,
      { id: user.id, nickname: user.nickname, identified_id: user.identified_id },
    ]);
  };

  const handleSend = async () => {
    if (!picked.length || isSending) return;
    const ok = await onSend(picked.map((u) => u.id));
    if (ok) onClose();
  };

  const handlePageSizeChange = (size: number) => {
    setPage(1);
    setPageSize(size);
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const renderResults = () => {
    if (isSearching && !results.length) {
      return <div className="ni-pick-empty">검색 중...</div>;
    }
    if (!results.length) {
      return <div className="ni-pick-empty">검색 결과가 없습니다.</div>;
    }
    return results.map((user) => {
      const on = isPicked(user.id);
      return (
        <div key={user.id} className={`ni-pick-row${on ? ' on' : ''}`}>
          <UserLine nickname={user.nickname} identifiedId={user.identified_id} />
          <button
            type="button"
            className={`btn btn-sm ${on ? 'btn-danger' : 'btn-ghost'}`}
            onClick={() => handleToggle(user)}
          >
            {on ? '해제' : '선택'}
          </button>
        </div>
      );
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          선택 개별 발송 대상 선택
          <div className="ni-modal-sub">
            선택한 회원에게만 즉시 발송합니다. 발송 기록에는 <strong>『개별 발송』</strong>으로
            남습니다.
          </div>
        </>
      }
      width="960px"
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
        <div className="ni-pick-grid">
          <div className="ni-pick-col">
            <div className="form-group">
              <label className="form-label" htmlFor="noti-individual-q">
                회원 검색
              </label>
              <input
                id="noti-individual-q"
                className="search-box"
                style={{ width: '100%' }}
                placeholder="닉네임 또는 식별 아이디"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="form-label">검색 결과</div>
            <div className="ni-pick-box">
              <div className="ni-pick-list" style={{ height: '440px' }}>
                {renderResults()}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onItemsPerPageChange={handlePageSizeChange}
                sizeOptions={PAGE_SIZE_OPTIONS}
                showSizeChanger
                showTotal
              />
            </div>
          </div>

          <div className="ni-pick-col">
            <div className="form-group">
              <div className="form-label">발송 내용</div>
              <div className="ni-pick-preview">
                <div className="ni-pick-preview-title">{title || '(제목 없음)'}</div>
                {content || '(내용 없음)'}
              </div>
            </div>
            <div className="form-label">
              선택한 회원
              {picked.length > 0 && (
                <span style={{ color: 'var(--text-3)' }}> · {picked.length.toLocaleString()}명</span>
              )}
            </div>
            <div className="ni-pick-box" style={{ flex: 1, minHeight: 0 }}>
              <div className="ni-pick-list" style={{ flex: 1 }}>
                {picked.length ? (
                  picked.map((user) => (
                    <div key={user.id} className="ni-pick-row">
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
                  <div className="ni-pick-empty">선택한 회원이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
