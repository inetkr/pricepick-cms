'use client';

import React from 'react';
import { StatCard } from 'src/components/common/stat-card';
import { InfoBox } from 'src/components/common/info-box';
import { RouletteSlotEditor } from 'src/components/roulette/roulette-slot-editor';
import { RouletteLogTable } from 'src/components/roulette/roulette-log-table';
import { useJackpotRoulette } from 'src/sections/jackpot-roulette/hooks/use-jackpot-roulette';
import { useRouletteLogs } from 'src/sections/roulette/hooks/use-roulette-logs';
import { POINTS_PER_WON } from 'src/utils/ticket-value';

export const JackpotRouletteSection: React.FC = () => {
  const {
    slots,
    stats,
    valueOverrides,
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
    dailySpinCap,
    setDailySpinCap,
    eventTicketDailyCap,
    setEventTicketDailyCap,
    eventTicketMonthlyCap,
    setEventTicketMonthlyCap,
    isLoadingLimits,
    isSavingLimits,
    saveLimits,
  } = useJackpotRoulette();

  // 티켓 환산가치는 티켓 가치 설정 화면 값을 그대로 따른다 — valueOverrides가 아직 로딩 전이면
  // 옛 값을 추측해 보여주지 않고 "—"로 비워 둔다(getSlotValue와 같은 기준).
  const fmtTicketValue = (v: number | undefined) =>
    v === undefined ? '—' : `${v.toLocaleString()}원`;

  const {
    logs,
    isLoading: isLoadingLogs,
    page: logPage,
    setPage: setLogPage,
    limit: logLimit,
    setLimit: setLogLimit,
    totalPages: logTotalPages,
    totalItems: logTotalItems,
  } = useRouletteLogs('LUCKY_SPIN_JACKPOT');

  const statusText = isLoading
    ? '설정을 불러오는 중…'
    : isSaving
      ? '저장 중…'
      : justSaved
        ? '저장 완료 · 앱에서 다음 진입 시 반영됩니다.'
        : hasSavedConfig
          ? '저장된 구성을 불러왔습니다 · 슬롯 6개.'
          : '기본값(예시) 표시 중 · 저장하면 이 설정이 앱에 적용됩니다.';

  // 확률·수량 유효성은 여기서 버튼을 막지 않고 saveConfig 내부에서 토스트로 안내한다 —
  // disabled로 클릭 자체를 막으면 그 안내 메시지가 절대 뜨지 않는다.
  const canSave = !isSaving && !isLoading;

  const limitsStatusText = isLoadingLimits
    ? '정책을 불러오는 중…'
    : isSavingLimits
      ? '저장 중…'
      : '저장된 제한 정책을 불러왔습니다.';

  return (
    <div className="section active" id="sec-jackpot-roulette">
      <InfoBox type="info">
        <strong>잭팟 룰렛 = 이벤트 티켓 1장으로 1회 돌리는 유료 룰렛</strong> — 매일 행운 룰렛과
        구조는 같고 보상 구성·확률만 다릅니다. 슬롯은 6개 고정입니다. 슬롯별 보상 내용과 당첨 확률을
        운영자가 직접 수정하며, 확률 합계가 100%가 아니면 저장되지 않습니다. 악용 방지 제한 (하루
        참여 상한 · 이벤트 티켓 일/월 획득 상한)은 아래에서 조정합니다.
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
          tableId="jkr-table"
          slots={slots}
          onChange={updateSlot}
          probabilitySum={probabilitySum}
          isProbabilityValid={isProbabilityValid}
          totalExpectedValue={totalExpectedValue}
          valueOverrides={valueOverrides}
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
          가치 환산 기준 — 포인트 {POINTS_PER_WON}P = 1원 · 이벤트 티켓{' '}
          {fmtTicketValue(valueOverrides?.EVENT_TICKET)} · 브론즈 티켓{' '}
          {fmtTicketValue(valueOverrides?.BRONZE_TICKET)} · 실버 티켓{' '}
          {fmtTicketValue(valueOverrides?.SILVER_TICKET)} · 골드 티켓{' '}
          {fmtTicketValue(valueOverrides?.GOLD_TICKET)}. 기대값 기여 = 가치 × 확률.
        </div>
        <div style={{ padding: '0 16px 16px', fontSize: '12px', color: 'var(--text-3)' }}>
          여기서 저장한 슬롯 구성·보상·확률과 아래 참여 제한 정책을 데모 앱 잭팟 룰렛 화면(홈 하단
          잭팟 배너로 진입)이 그대로 읽어 적용합니다. 실행 로그·월 집계도 앱 실행 기록 실집계입니다.
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">참여 제한 정책</div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={saveLimits}
            disabled={isSavingLimits || isLoadingLimits}
          >
            {isSavingLimits ? '저장 중...' : isLoadingLimits ? '불러오는 중...' : '저장'}
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="jkr-daily-cap">
              하루 최대 참여 횟수
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="jkr-daily-cap"
                className="form-input"
                type="number"
                min={1}
                step={1}
                value={dailySpinCap}
                onChange={(e) => setDailySpinCap(Math.max(1, Number(e.target.value) || 1))}
                style={{ maxWidth: '120px' }}
              />
              <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>회 / 1일</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>
              매크로로 무제한 돌리는 것을 막는 상한입니다.
            </div>
          </div>
          <InfoBox type="info">
            구매로 발급된 티켓은 등급 티켓·이벤트 티켓 모두 승인 대기 상태로 발급되고, 카카오 연동
            D+7 / 미연동 D+30 경과 또는 쿠팡 구매 확정 시 승인됩니다. 승인 전에는 잭팟 룰렛에 쓸 수
            없으므로 &ldquo;돌리고 환불&rdquo; 악용은 티켓 단계에서 이미 차단됩니다. 별도 설정 항목을 두지
            않습니다.
          </InfoBox>
          <div className="form-group">
            <label className="form-label" htmlFor="jkr-daily-ticket-cap">
              이벤트 티켓 일 획득 상한
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="jkr-daily-ticket-cap"
                className="form-input"
                type="number"
                min={1}
                step={1}
                value={eventTicketDailyCap}
                onChange={(e) => setEventTicketDailyCap(Math.max(1, Number(e.target.value) || 1))}
                style={{ maxWidth: '120px' }}
              />
              <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>장 / 1일</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>
              회원 1명이 하루에 받을 수 있는 이벤트 티켓 총량입니다. 적립 정책의 하루 5건 한도와
              같은 기준입니다.
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="jkr-monthly-cap">
              이벤트 티켓 월 획득 상한
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="jkr-monthly-cap"
                className="form-input"
                type="number"
                min={1}
                step={1}
                value={eventTicketMonthlyCap}
                onChange={(e) => setEventTicketMonthlyCap(Math.max(1, Number(e.target.value) || 1))}
                style={{ maxWidth: '120px' }}
              />
              <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>장 / 월</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>
              현행 정책 그대로 30장. 회원 1명이 한 달에 모을 수 있는 이벤트 티켓 총량입니다.
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '12px 16px',
            fontSize: '12px',
            color: 'var(--text-3)',
            borderTop: '1px solid var(--border)',
          }}
        >
          {limitsStatusText}
        </div>
      </div>

      <RouletteLogTable
        tableId="jkr-log-table"
        rouletteTypeLabel="잭팟 룰렛"
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
