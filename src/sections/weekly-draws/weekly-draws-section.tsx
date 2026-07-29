'use client';

import React, { useState } from 'react';
import { WeeklyDrawEntrantsModal } from 'src/components/weekly-draws/weekly-draw-entrants-modal';
import { WeeklyDrawRoundModal } from 'src/components/weekly-draws/weekly-draw-round-modal';
import { WeeklyDrawRoundTable } from 'src/components/weekly-draws/weekly-draw-round-table';
import { WeeklyDrawTemplateModal } from 'src/components/weekly-draws/weekly-draw-template-modal';
import { useWeeklyDraws } from 'src/sections/weekly-draws/hooks/use-weekly-draws';

export const WeeklyDrawsSection: React.FC = () => {
  const {
    ongoing,
    upcoming,
    ended,
    template,
    saveTemplate,
    updateRoundTiers,
    getRoundEntries,
    updateEntriesGiftStatus,
  } = useWeeklyDraws();

  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [entrantsRoundId, setEntrantsRoundId] = useState<string | null>(null);

  const allRounds = [...ongoing.rounds, ...upcoming.rounds, ...ended.rounds];
  const entrantsRound = allRounds.find((r) => r.id === entrantsRoundId) ?? null;
  const editingRound = allRounds.find((r) => r.id === editingRoundId) ?? null;

  return (
    <div className="section active" id="sec-weekly-draws">
      <div className="card">
        <div className="card-header">
          <div className="card-title">회차 등록 안내</div>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text)',
              lineHeight: 1.7,
              wordBreak: 'keep-all',
            }}
          >
            회차는 매주 자동으로 등록되고, 마감과 동시에 당첨자도 자동 추첨됩니다 (매주
            월요일~일요일 마감 · 회차명은 마감일 기준 자동 부여)
          </div>
          <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsTemplateOpen(true)}
            >
              기본 경품 구성 템플릿 편집
            </button>
          </div>
        </div>
      </div>

      <WeeklyDrawRoundTable
        title="진행중인 주간 이벤트"
        description="추첨 방식: 매주 월요일 0시 시작 ~ 일요일 23:59:59 마감 (자동 생성)"
        rounds={ongoing.rounds}
        emptyMessage={ongoing.isLoading ? '불러오는 중...' : '진행 중인 회차가 없습니다.'}
        onViewEntrants={(round) => setEntrantsRoundId(round.id)}
        onEditPrizes={(round) => setEditingRoundId(round.id)}
      />
      <div style={{ marginTop: '14px' }}>
        <WeeklyDrawRoundTable
          title="진행예정 주간 이벤트"
          rounds={upcoming.rounds}
          emptyMessage={upcoming.isLoading ? '불러오는 중...' : '예정된 회차가 없습니다.'}
          showViewEntrants={false}
          onViewEntrants={(round) => setEntrantsRoundId(round.id)}
          onEditPrizes={(round) => setEditingRoundId(round.id)}
        />
      </div>
      <div style={{ marginTop: '14px' }}>
        <WeeklyDrawRoundTable
          title="종료된 주간 이벤트"
          rounds={ended.rounds}
          emptyMessage={ended.isLoading ? '불러오는 중...' : '종료된 회차가 없습니다.'}
          pagination={{
            currentPage: ended.page,
            totalPages: ended.totalPages,
            onPageChange: ended.setPage,
            totalItems: ended.totalItems,
            showTotal: true,
          }}
          showEditPrizes={false}
          onViewEntrants={(round) => setEntrantsRoundId(round.id)}
          onEditPrizes={(round) => setEditingRoundId(round.id)}
        />
      </div>

      <WeeklyDrawTemplateModal
        open={isTemplateOpen}
        template={template}
        onClose={() => setIsTemplateOpen(false)}
        onSave={saveTemplate}
      />

      <WeeklyDrawRoundModal
        open={!!editingRoundId}
        round={editingRound}
        onClose={() => setEditingRoundId(null)}
        onSubmit={updateRoundTiers}
      />

      <WeeklyDrawEntrantsModal
        open={!!entrantsRoundId}
        round={entrantsRound}
        onClose={() => setEntrantsRoundId(null)}
        fetchEntries={getRoundEntries}
        onSavePayouts={updateEntriesGiftStatus}
      />
    </div>
  );
};
