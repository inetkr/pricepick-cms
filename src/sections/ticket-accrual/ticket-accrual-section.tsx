'use client';

import React, { useState } from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { TicketAccrualAddMallModal } from 'src/components/ticket-accrual/ticket-accrual-add-mall-modal';
import { TicketAccrualCatalogMallTable } from 'src/components/ticket-accrual/ticket-accrual-catalog-mall-table';
import { TicketAccrualLogoModal } from 'src/components/ticket-accrual/ticket-accrual-logo-modal';
import { TicketAccrualMallDetailModal } from 'src/components/ticket-accrual/ticket-accrual-mall-detail-modal';
import { TicketAccrualPrimaryMallTable } from 'src/components/ticket-accrual/ticket-accrual-primary-mall-table';
import { TicketAccrualSimulatorModal } from 'src/components/ticket-accrual/ticket-accrual-simulator-modal';
import { useTicketAccrual } from 'src/sections/ticket-accrual/hooks/use-ticket-accrual';
import type { IAffiliateMall } from 'src/types/config/ticket_accrual_config';
import { DEFAULT_ACCRUAL_RATIO } from 'src/utils/ticket-accrual';

export const TicketAccrualSection: React.FC = () => {
  const {
    primaryMalls,
    savedPrimaryMalls,
    catalogMalls,
    savedCatalogMalls,
    totalCatalogCount,
    ticketValue,
    isLoading,
    isSavingPrimary,
    isSavingCatalog,
    isSearchingCatalog,
    searchCatalogMalls,
    primaryDirtyIds,
    catalogDirtyIds,
    categories,
    filters,
    setFilters,
    selectMode,
    selectedIds,
    toggleSelectMode,
    toggleSelect,
    toggleSelectAllVisible,
    updateMallField,
    updateMallLogo,
    setApprovalStatus,
    toggleApplied,
    addMall,
    bulkApplyRate,
    bulkSetApplied,
    savePrimaryMalls,
    saveCatalogMalls,
  } = useTicketAccrual();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [simulatorMall, setSimulatorMall] = useState<IAffiliateMall | null>(null);
  const [detailMall, setDetailMall] = useState<IAffiliateMall | null>(null);
  const [logoModalMall, setLogoModalMall] = useState<IAffiliateMall | null>(null);

  if (isLoading) {
    return (
      <div className="section active">
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  const allVisibleSelected =
    catalogMalls.length > 0 && catalogMalls.every((m) => selectedIds.has(m.id));

  return (
    <div className="section active">
      <InfoBox type="info">
        제휴몰별 수수료와 사용자에게 돌려줄 적립률을 정합니다(계약이 바뀌면 수수료도 여기서 바로
        반영). 등급 환산은 큰 단위부터 채우는 기존 방식 그대로입니다. 쿠팡은 대표 제휴몰로 항상 별도
        표시됩니다. 적립률 기본값은 수수료의 {DEFAULT_ACCRUAL_RATIO}%이며, 나머지{' '}
        {100 - DEFAULT_ACCRUAL_RATIO}%가 우리 수익입니다.
      </InfoBox>

      <TicketAccrualPrimaryMallTable
        malls={primaryMalls}
        savedMalls={savedPrimaryMalls}
        onChangeField={updateMallField}
        onOpenSimulator={setSimulatorMall}
        onEditLogo={setLogoModalMall}
        dirtyCount={primaryDirtyIds.size}
        headerActions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={savePrimaryMalls}
            disabled={isSavingPrimary}
          >
            {isSavingPrimary ? '저장 중...' : '저장'}
          </button>
        }
      />

      <TicketAccrualCatalogMallTable
        malls={catalogMalls}
        savedMalls={savedCatalogMalls}
        totalCount={totalCatalogCount}
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        onSearch={searchCatalogMalls}
        isSearching={isSearchingCatalog}
        onChangeField={updateMallField}
        onOpenSimulator={setSimulatorMall}
        onOpenDetail={setDetailMall}
        onEditLogo={setLogoModalMall}
        onSetApprovalStatus={setApprovalStatus}
        onOpenAddMall={() => setIsAddOpen(true)}
        selectMode={selectMode}
        selectedIds={selectedIds}
        allVisibleSelected={allVisibleSelected}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAllVisible}
        onToggleSelectMode={toggleSelectMode}
        onToggleApplied={toggleApplied}
        onBulkApplyRate={bulkApplyRate}
        onBulkSetApplied={bulkSetApplied}
        isSaving={isSavingCatalog}
        onSave={saveCatalogMalls}
        dirtyCount={catalogDirtyIds.size}
        emptyMessage={
          filters.category || filters.approvalStatus || filters.applied
            ? '조건에 맞는 제휴몰이 없습니다.'
            : '등록된 제휴몰이 없습니다. "제휴몰 추가"로 등록하세요.'
        }
      />

      <TicketAccrualAddMallModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={addMall} />
      <TicketAccrualSimulatorModal
        mall={simulatorMall}
        ticketValue={ticketValue}
        onClose={() => setSimulatorMall(null)}
      />
      <TicketAccrualMallDetailModal mall={detailMall} onClose={() => setDetailMall(null)} />
      <TicketAccrualLogoModal
        mall={logoModalMall}
        onApply={updateMallLogo}
        onClose={() => setLogoModalMall(null)}
      />
    </div>
  );
};
