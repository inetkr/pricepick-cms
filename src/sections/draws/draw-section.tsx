'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { InfoBox } from 'src/components/common/info-box';
import type { PaginationProps } from 'src/components/common/pagination';
import type { DrawCreateInput } from 'src/components/draws/draw-create-modal';
import { DrawCreateModal } from 'src/components/draws/draw-create-modal';
import { DrawTable } from 'src/components/draws/draw-table';
import type { DrawProcessInput } from 'src/components/draws/draw-winner-modal';
import { DrawWinnerModal } from 'src/components/draws/draw-winner-modal';
import { useDraws } from 'src/sections/draws/hooks/use-draw';
import type { IDraw } from 'src/types/draws/draw';

export const DrawsSection: React.FC = () => {
  const { draws, page, setPage, totalPages, totalItems, pendingCount, createDraw, processDraw } =
    useDraws();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [winnerTarget, setWinnerTarget] = useState<IDraw | null>(null);
  const [isWinnerReadOnly, setWinnerReadOnly] = useState(false);

  const handleCreate = (data: DrawCreateInput) => {
    createDraw(data);
    toast.success(`'${data.round_name}' 회차가 등록되었습니다.`);
  };

  const handleProcess = (data: DrawProcessInput) => {
    if (!winnerTarget) return;
    processDraw(winnerTarget.id, data);
    toast.success(`'${winnerTarget.round_name}' 당첨 처리가 완료되었습니다.`);
  };

  const openProcessModal = (draw: IDraw) => {
    setWinnerReadOnly(false);
    setWinnerTarget(draw);
  };

  const openResultModal = (draw: IDraw) => {
    setWinnerReadOnly(true);
    setWinnerTarget(draw);
  };

  const paginationProps: PaginationProps = {
    currentPage: page,
    totalPages,
    onPageChange: setPage,
    totalItems,
  };

  return (
    <div className="section active" id="sec-draws">
      <InfoBox>
        <strong>좌측 메뉴 배지</strong> = 관리자 처리 대기 추첨 건수입니다. 마감됐으나 아직
        &apos;당첨 처리&apos;를 하지 않은 회차 수를 나타내며
        {pendingCount > 0 ? ` 현재 ${pendingCount}건이 대기 중입니다.` : ' 현재 대기 중인 회차는 없습니다.'}{' '}
        해당 회차의 당첨 처리를 완료하면 카운트가 줄고, 0이 되면 배지가 사라집니다.
      </InfoBox>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">추첨 회차 목록</div>
            <div className="card-sub">추첨 방식: 매주 월요일 자동 발표 (수동/자동 선택 가능)</div>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
            + 회차 등록
          </button>
        </div>
        <DrawTable
          data={draws}
          pagination={paginationProps}
          onProcess={openProcessModal}
          onViewResult={openResultModal}
        />
      </div>

      <DrawCreateModal open={isCreateOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />

      <DrawWinnerModal
        open={!!winnerTarget}
        draw={winnerTarget}
        readOnly={isWinnerReadOnly}
        onClose={() => setWinnerTarget(null)}
        onSubmit={handleProcess}
      />
    </div>
  );
};
