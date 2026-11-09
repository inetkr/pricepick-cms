'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { userAPI } from 'src/api';
import { NOTIFICATION_INDIVIDUAL_MAX_USERS } from 'src/constants/notification';
import { useDebounce } from 'src/hooks/use-debounce';
import type { IUser } from 'src/types/users/user';
import { Modal } from '../common/modal';
import { Pagination } from '../common/pagination';

// 선택 개별 발송 대상 선택 — 고른 회원에게만 즉시 발송하고(예약 불가), 발송 기록에는 「개별 발송」으로 남는다.
// 목록·검색 모두 회원 목록 API(get_list_cms)를 쓴다 — 회원 검색 API(admin/search)는 수신 동의(user_setting)를
// 내려주지 않아, 받지 못할 회원을 미리 막을 수 없다.

// 서버는 수신 설정이 있고 marketing_consent가 NONE이 아닌 회원에게만 보낸다 — 나머지는 미처리(수신 거부)로 남는다
const canReceive = (user: IUser) =>
  !!user.user_setting && user.user_setting.marketing_consent !== 'NONE';

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

  // 정상 회원을 최근 가입순으로 — 검색어가 있으면 닉네임·아이디·식별 아이디로 좁힌다
  useEffect(() => {
    if (!open) return undefined;
    const trimmed = debouncedKeyword.trim();

    let cancelled = false;
    setIsSearching(true);
    userAPI
      .getUserList(
        page,
        pageSize,
        { account_status: 'NORMAL', ...(trimmed ? { search: trimmed } : {}) },
        { withLoading: false }
      )
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
    if (!canReceive(user)) return;
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
      // 마케팅 수신 거부 회원은 보내도 미처리로 끝나므로 고를 수 없게 막는다
      const off = !on && !canReceive(user);
      return (
        <div
          key={user.id}
          className={`ni-pick-row${on ? ' on' : ''}${off ? ' off' : ''}`}
          title={off ? '마케팅 수신 거부 회원이라 선택할 수 없습니다.' : undefined}
        >
          <UserLine nickname={user.nickname} identifiedId={user.identified_id} />
          <button
            type="button"
            className={`btn btn-sm ${on ? 'btn-danger' : 'btn-ghost'}`}
            disabled={off}
            onClick={() => handleToggle(user)}
          >
            {on ? '해제' : off ? '수신 거부' : '선택'}
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
