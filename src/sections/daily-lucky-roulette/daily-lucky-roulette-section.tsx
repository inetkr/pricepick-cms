'use client';

import React from 'react';
import { StatCard } from 'src/components/common/stat-card';
import { InfoBox } from 'src/components/common/info-box';
import { RouletteSlotEditor } from 'src/components/roulette/roulette-slot-editor';
import { RouletteLogTable } from 'src/components/roulette/roulette-log-table';
import { useDailyLuckyRoulette } from 'src/sections/daily-lucky-roulette/hooks/use-daily-lucky-roulette';
import { useRouletteLogs } from 'src/sections/roulette/hooks/use-roulette-logs';

export const DailyLuckyRouletteSection: React.FC = () => {
  const {
    slots,
    stats,
    isLoading,
    isSaving,
    hasSavedConfig,
    justSaved,
    probabilitySum,
    totalExpectedValue,
    isProbabilityValid,
    isDirty,
    updateSlot,
    resetToDefault,
    saveConfig,
  } = useDailyLuckyRoulette();

  const {
    logs,
    isLoading: isLoadingLogs,
    page: logPage,
    setPage: setLogPage,
    limit: logLimit,
    setLimit: setLogLimit,
    totalPages: logTotalPages,
    totalItems: logTotalItems,
  } = useRouletteLogs('LUCKY_SPIN');

  const statusText = isLoading
    ? '설정을 불러오는 중…'
    : isSaving
      ? '저장 중…'
      : justSaved
        ? '저장 완료 · 앱에서 다음 진입 시 반영됩니다.'
        : hasSavedConfig
          ? '저장된 설정을 불러왔습니다.'
          : '기본값(예시) 표시 중 · 저장하면 이 설정이 앱에 적용됩니다.';

  // 확률·수량 유효성은 여기서 버튼을 막지 않고 saveConfig 내부에서 토스트로 안내한다 —
  // disabled로 클릭 자체를 막으면 그 안내 메시지가 절대 뜨지 않는다.
  const canSave = !isSaving && !isLoading;

  return (
    <div className="section active" id="sec-daily-lucky-roulette">
      <InfoBox type="info">
        <strong>매일 행운 룰렛 = 출석(쿠팡 구경하기) 시 1일 1회 무료 룰렛</strong> — 슬롯별 보상
        내용과 당첨 확률을 운영자가 직접 수정합니다. 확률 합계가 100%가 아니면 저장되지 않습니다.
        슬롯은 6개 고정이며 보상 유형·수량·확률만 수정합니다. 이벤트 티켓을 쓰는 유료 룰렛은{' '}
        <strong>잭팟 룰렛</strong> 메뉴에서 따로 관리합니다.
      </InfoBox>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          label="이번 달 룰렛 실행"
          value={isLoading ? '—' : `${stats.total_spins_this_month.toLocaleString()}회`}
          change={{ type: 'neutral', text: '실제 돌린 횟수 집계' }}
          color="purple"
        />
        <StatCard
          label="이번 달 지급 총액"
          value={isLoading ? '—' : `${stats.total_won_value_this_month.toLocaleString()}원`}
          change={{ type: 'neutral', text: '지급완료 건 원화 환산' }}
          color="green"
        />
        <StatCard
          label="1회 기댓값"
          value={
            isLoading
              ? '—'
              : `${totalExpectedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}원`
          }
          change={{
            type: 'neutral',
            text: isDirty ? (
              <>
                저장 전 미리보기 <span className="rlt-dirty-badge">미저장</span>
              </>
            ) : (
              '저장된 구성 기준'
            ),
          }}
          color="amber"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">슬롯 구성 · 당첨 확률</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={resetToDefault}>
              기본값 복원
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={saveConfig}
              disabled={!canSave}
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
        <RouletteSlotEditor
          tableId="rlt-table"
          slots={slots}
          onChange={updateSlot}
          probabilitySum={probabilitySum}
          isProbabilityValid={isProbabilityValid}
          totalExpectedValue={totalExpectedValue}
          showJackpotBadge
        />
        <div
          style={{
            padding: '12px 16px',
            fontSize: '12px',
            color: 'var(--text-3)',
            borderTop: '1px solid var(--border)',
          }}
        >
          {statusText}
        </div>
        <div style={{ padding: '0 16px 14px', fontSize: '12px', color: 'var(--text-3)' }}>
          가치 환산 기준 — 포인트 10P = 1원 · 이벤트 티켓 40원 · 브론즈 티켓 100원 · 실버 티켓
          1,000원 · 골드 티켓 2,000원. 기댓값 기여 = 가치 × 확률.
        </div>
      </div>

      <RouletteLogTable
        tableId="rlt-log-table"
        rouletteTypeLabel="매일 행운 룰렛"
        logs={logs}
        isLoading={isLoadingLogs}
        pagination={{
          currentPage: logPage,
          totalPages: logTotalPages,
          onPageChange: setLogPage,
          onItemsPerPageChange: setLogLimit,
          showSizeChanger: true,
          showTotal: true,
          totalItems: logTotalItems,
          itemsPerPage: logLimit,
        }}
      />
    </div>
  );
};
