'use client';

import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { InfoBox } from 'src/components/common/info-box';
import type { Column } from 'src/components/common/table';
import { Table } from 'src/components/common/table';
import type { IDrawEntry, IDrawRound, IGiftStatus } from 'src/types/weekly-draws/weekly-draw';
import { formatDrawRoundLabel } from 'src/utils/weekly-draw';

const ENTRIES_PAGE_SIZE = 20;
const SCROLL_LOAD_THRESHOLD = 80;

interface WeeklyDrawEntrantsModalProps {
  open: boolean;
  round: IDrawRound | null;
  onClose: () => void;
  fetchEntries: (
    roundId: string,
    page: number,
    limit: number
  ) => Promise<{ count: number; rows: IDrawEntry[] }>;
  onSavePayouts: (
    roundId: string,
    entries: { id: string; gift_status: IGiftStatus; gift_note?: string }[]
  ) => Promise<unknown>;
}

type GiftDraft = { gift_status: IGiftStatus; gift_note: string };

const draftsFromRows = (rows: IDrawEntry[]): Record<string, GiftDraft> => {
  const drafts: Record<string, GiftDraft> = {};
  rows.forEach((e) => {
    drafts[e.id] = { gift_status: e.gift_status, gift_note: e.gift_note ?? '' };
  });
  return drafts;
};

export const WeeklyDrawEntrantsModal: React.FC<WeeklyDrawEntrantsModalProps> = ({
  open,
  round,
  onClose,
  fetchEntries,
  onSavePayouts,
}) => {
  const [entries, setEntries] = useState<IDrawEntry[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadedPage, setLoadedPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, GiftDraft>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const roundId = round?.id;
  const hasMore = entries.length < totalItems;

  // 배경(main) 스크롤을 잠가야 마우스 휠이 항상 모달 카드 쪽으로만 전달된다.
  // 잠그지 않으면 카드 바깥 여백 위에서 휠을 굴렸을 때 뒤쪽 페이지가 스크롤되어
  // 무한 스크롤 로딩이 전혀 트리거되지 않는 것처럼 보인다.
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open || !roundId) return;
    setEntries([]);
    setTotalItems(0);
    setLoadedPage(0);
    setDrafts({});
    setIsLoading(true);
    fetchEntries(roundId, 1, ENTRIES_PAGE_SIZE)
      .then(({ count, rows }) => {
        setEntries(rows);
        setTotalItems(count);
        setLoadedPage(1);
        setDrafts(draftsFromRows(rows));
      })
      .finally(() => setIsLoading(false));
  }, [open, roundId, fetchEntries]);

  if (!open || !round) return null;

  const handleLoadMore = () => {
    if (!roundId || isLoading || isLoadingMore || !hasMore) return;
    const nextPage = loadedPage + 1;
    setIsLoadingMore(true);
    fetchEntries(roundId, nextPage, ENTRIES_PAGE_SIZE)
      .then(({ rows }) => {
        setEntries((prev) => [...prev, ...rows]);
        setDrafts((prev) => ({ ...draftsFromRows(rows), ...prev }));
        setLoadedPage(nextPage);
      })
      .finally(() => setIsLoadingMore(false));
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_LOAD_THRESHOLD) {
      handleLoadMore();
    }
  };

  const handleSave = async () => {
    const changes = entries
      .map((e) => {
        const draft = drafts[e.id];
        if (!draft) return null;
        if (draft.gift_status === e.gift_status && draft.gift_note === (e.gift_note ?? '')) {
          return null;
        }
        return { id: e.id, gift_status: draft.gift_status, gift_note: draft.gift_note };
      })
      .filter((c): c is { id: string; gift_status: IGiftStatus; gift_note: string } => c !== null);

    if (changes.length === 0) {
      onClose();
      return;
    }
    setIsSaving(true);
    try {
      await onSavePayouts(round.id, changes);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<IDrawEntry>[] = [
    {
      key: 'nickname',
      label: '닉네임 / 카카오 계정',
      align: 'left',
      width: '24%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.user?.nickname ?? '—'}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>
            {row.user?.kakao_info?.email ?? (row.user?.kakao_id ? row.user.kakao_id : '미연동')}
          </div>
        </div>
      ),
    },
    {
      key: 'entered_at',
      label: '응모일시',
      width: '16%',
      render: (row) => {
        const d = new Date(row.entered_at);
        const dateStr = Number.isNaN(d.getTime())
          ? row.entered_at
          : `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
        const timeStr = Number.isNaN(d.getTime())
          ? ''
          : `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700 }}>{dateStr}</div>
            <div style={{ color: 'var(--text-3)', fontSize: '11px' }}>{timeStr}</div>
          </div>
        );
      },
    },
    {
      key: 'payout',
      label: '당첨 경품 지급',
      align: 'left',
      width: '40%',
      render: (row) => {
        if (!row.is_winner) return <span style={{ color: 'var(--text-3)' }}>—</span>;
        const draft = drafts[row.id] ?? {
          gift_status: row.gift_status,
          gift_note: row.gift_note ?? '',
        };
        const sent = draft.gift_status === 'SENT';
        return (
          <div>
            <div style={{ marginBottom: '4px' }}>
              <span className="badge badge-purple">
                당첨 · <span>{row.won_tier}등</span>
              </span>{' '}
              <button
                type="button"
                className={`badge ${sent ? 'badge-green' : 'badge-amber'}`}
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() =>
                  setDrafts((prev) => ({
                    ...prev,
                    [row.id]: { ...draft, gift_status: sent ? 'PENDING' : 'SENT' },
                  }))
                }
              >
                {sent ? '지급 완료' : '지급 대기'}
              </button>
            </div>
            <input
              className="form-input"
              style={{ marginTop: '4px', fontSize: '12px', padding: '5px 8px', height: '40px' }}
              placeholder="메모(기프티콘 발송일·송장번호 등)"
              value={draft.gift_note}
              onChange={(e) =>
                setDrafts((prev) => ({
                  ...prev,
                  [row.id]: { ...draft, gift_note: e.target.value },
                }))
              }
            />
          </div>
        );
      },
    },
    {
      key: 'won_tier',
      label: '당첨 등수',
      width: '20%',
      render: (row) =>
        row.is_winner && row.won_tier ? (
          <span className="badge badge-purple">{row.won_tier}등</span>
        ) : (
          <span style={{ color: 'var(--text-3)' }}>—</span>
        ),
    },
  ];

  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        inset: 0,
        zIndex: 210,
        background: 'rgba(0, 0, 0, .45)',
      }}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) =>
        e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ') && onClose()
      }
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="card"
        style={{
          maxWidth: '780px',
          margin: '4vh auto',
          maxHeight: '92vh',
          overflow: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="card-header">
          <div className="card-title">응모자 리스트 — {formatDrawRoundLabel(round)}</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕ 닫기
          </button>
        </div>
        <div style={{ padding: '18px' }}>
          <InfoBox type="info">
            기간: {round.week_start_date} ~ {round.week_end_date} · 응모건수{' '}
            {round.entry_count.toLocaleString()}건
          </InfoBox>
          <div style={{ fontSize: '11.5px', color: 'var(--text-3)', margin: '8px 2px 2px' }}>
            회차 종료시 자동으로 추첨됩니다 · 응모 건 단위 무작위 · 1인 1회 당첨
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '10px 0',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span className={`badge ${round.drawn_at ? 'badge-green' : 'badge-gray'}`}>
              {round.drawn_at ? '당첨자 확정' : '미확정'}
            </span>
            {round.status === 'ENDED' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                  취소
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </div>
            )}
          </div>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
              로딩 중...
            </div>
          ) : (
            <Table
              data={entries}
              columns={columns}
              keyExtractor={(row) => row.id}
              emptyMessage="응모 내역이 없습니다."
            />
          )}
          {isLoadingMore && (
            <div style={{ textAlign: 'center', padding: '14px' }}>
              <CircularProgress size={22} thickness={4} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
