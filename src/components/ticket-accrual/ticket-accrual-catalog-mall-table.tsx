import React, { useMemo, useState } from 'react';
import type { Column } from 'src/components/common/table';
import { Table } from 'src/components/common/table';
import {
  AccrualRateCell,
  FeeRateCell,
  LogoCell,
  MarginCell,
  SimulatorButtonCell,
} from 'src/components/ticket-accrual/ticket-accrual-rate-cells';
import type { TicketAccrualFilters } from 'src/sections/ticket-accrual/hooks/use-ticket-accrual';
import type {
  IAffiliateMall,
  IAffiliateMallApprovalStatus,
} from 'src/types/config/ticket_accrual_config';

const APPROVAL_LABEL: Record<IAffiliateMallApprovalStatus, string> = {
  APPROVED: '승인',
  PENDING: '승인대기',
  REJECTED: '거부',
  NOT_APPLIED: '미신청',
};

// select의 테두리·글자색을 상태별로 맞춰, 드롭다운을 접어 놓은 상태에서도 승인/대기/거부
// 여부가 한눈에 보이게 한다(배경색은 쓰지 않는다).
const APPROVAL_COLOR: Record<IAffiliateMallApprovalStatus, string> = {
  APPROVED: 'var(--success)',
  PENDING: 'var(--amber)',
  REJECTED: 'var(--danger)',
  NOT_APPLIED: 'var(--text-3)',
};

const APPROVAL_SELECT_HEIGHT = 32;
const APPROVAL_SELECT_LINE_HEIGHT = APPROVAL_SELECT_HEIGHT - 2; // 위아래 1px 테두리를 뺀 콘텐츠 높이 — 선택값이 안 잘리도록 세로 중앙 정렬을 강제한다

const APPROVAL_FILTER_OPTIONS: { value: IAffiliateMallApprovalStatus | ''; label: string }[] = [
  { value: '', label: 'LP상태 전체' },
  { value: 'APPROVED', label: '승인' },
  { value: 'PENDING', label: '승인대기' },
  { value: 'REJECTED', label: '거부' },
  { value: 'NOT_APPLIED', label: '미신청' },
];

const APPLIED_FILTER_OPTIONS: { value: TicketAccrualFilters['applied']; label: string }[] = [
  { value: '', label: '적용 전체' },
  { value: 'true', label: '적용' },
  { value: 'false', label: '미적용' },
];

interface TicketAccrualCatalogMallTableProps {
  // 필터가 적용된, 화면에 실제로 표시되는 목록
  malls: IAffiliateMall[];
  // 마지막 저장 시점 스냅샷 — 링크프라이스 상태 select가 저장 전 값과 달라졌는지 판단하는
  // 기준이다(필드 단위로 바뀐 셀만 강조하기 위해 행 전체 dirty 여부와 별도로 둔다).
  savedMalls: IAffiliateMall[];
  // 필터 이전 카탈로그 전체 건수 — 하단 "총 N개(표시 M개)" 안내에 쓰인다
  totalCount: number;
  filters: TicketAccrualFilters;
  onFiltersChange: (filters: TicketAccrualFilters) => void;
  // 카테고리 필터 select 옵션 — GET /merchant/admin/categories 로 조회한 값을 그대로 쓴다.
  categories: string[];
  // select만 바꿔서는 아무 일도 안 일어난다 — "검색" 버튼을 눌러야 그 시점의 filters로 서버에서
  // 다시 조회한다.
  onSearch: () => void;
  isSearching: boolean;
  onChangeField: (id: string, patch: Partial<Pick<IAffiliateMall, 'feeRate' | 'accrualRate'>>) => void;
  onOpenSimulator: (mall: IAffiliateMall) => void;
  onOpenDetail: (mall: IAffiliateMall) => void;
  onEditLogo: (mall: IAffiliateMall) => void;
  onSetApprovalStatus: (id: string, status: IAffiliateMallApprovalStatus) => void;
  onOpenAddMall: () => void;
  selectMode: boolean;
  selectedIds: Set<string>;
  allVisibleSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectMode: () => void;
  onToggleApplied: (id: string) => void;
  onBulkApplyRate: (rate: number) => void;
  onBulkSetApplied: (applied: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  // 저장하지 않은 변경 건수 — 이 테이블(제휴몰·링크프라이스)만의 값이다. 대표 제휴몰 쪽 변경은
  // 포함하지 않으므로, 경고 배너도 이 카드 안에서만 뜬다.
  dirtyCount: number;
  emptyMessage: string;
}

// merchant_source=LINKPRICE 카탈로그 전용 테이블 — 승인 상태·적용 토글·일괄 선택이 필요해
// 대표 제휴몰 테이블과 별도 컴포넌트로 둔다. 검색·필터·선택/일괄조정 도구는 카드 헤더에
// 제목과 나란히 둔다(별도 toolbar 줄 없음).
export const TicketAccrualCatalogMallTable: React.FC<TicketAccrualCatalogMallTableProps> = ({
  malls,
  savedMalls,
  totalCount,
  filters,
  onFiltersChange,
  categories,
  onSearch,
  isSearching,
  onChangeField,
  onOpenSimulator,
  onOpenDetail,
  onEditLogo,
  onSetApprovalStatus,
  onOpenAddMall,
  selectMode,
  selectedIds,
  allVisibleSelected,
  onToggleSelect,
  onToggleSelectAll,
  onToggleSelectMode,
  onToggleApplied,
  onBulkApplyRate,
  onBulkSetApplied,
  isSaving,
  onSave,
  dirtyCount,
  emptyMessage,
}) => {
  const [bulkRate, setBulkRate] = useState(60);

  const savedApprovalById = useMemo(
    () => new Map(savedMalls.map((m) => [m.id, m.approvalStatus])),
    [savedMalls]
  );

  const columns: Column<IAffiliateMall>[] = [];

  if (selectMode) {
    columns.push({
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={(e) => onToggleSelectAll(e.target.checked)}
          title="보이는 몰 전체 선택"
          aria-label="보이는 몰 전체 선택"
        />
      ),
      width: '40px',
      render: (m) => (
        <input
          type="checkbox"
          checked={selectedIds.has(m.id)}
          onChange={() => onToggleSelect(m.id)}
          aria-label={`${m.name} 선택`}
        />
      ),
    });
  }

  columns.push({
    key: 'logo',
    label: '로고',
    align: 'center',
    width: '70px',
    render: (m) => <LogoCell mall={m} onEdit={onEditLogo} />,
  });

  columns.push({
    key: 'name',
    label: '제휴몰',
    align: 'center',
    render: (m) => (
      <button type="button" className="ta-name-link" onClick={() => onOpenDetail(m)}>
        {m.name}
      </button>
    ),
  });

  columns.push({
    key: 'approvalStatus',
    label: '링크프라이스 상태',
    render: (m) => {
      const savedStatus = savedApprovalById.get(m.id);
      const changed = savedStatus !== undefined && savedStatus !== m.approvalStatus;
      return (
      <select
        className="form-select"
        style={{
          height: `${APPROVAL_SELECT_HEIGHT}px`,
          lineHeight: `${APPROVAL_SELECT_LINE_HEIGHT}px`,
          padding: '0 8px',
          fontSize: '12px',
          fontWeight: 700,
          maxWidth: '110px',
          borderColor: APPROVAL_COLOR[m.approvalStatus],
          color: APPROVAL_COLOR[m.approvalStatus],
          boxShadow: changed ? '0 0 0 2px var(--warning)' : 'none',
        }}
        value={m.approvalStatus}
        onChange={(e) => onSetApprovalStatus(m.id, e.target.value as IAffiliateMallApprovalStatus)}
      >
        {(Object.keys(APPROVAL_LABEL) as IAffiliateMallApprovalStatus[]).map((status) => (
          <option key={status} value={status}>
            {APPROVAL_LABEL[status]}
          </option>
        ))}
      </select>
      );
    },
  });

  columns.push({
    key: 'feeRate',
    label: '수수료',
    render: (m) => (
      <FeeRateCell mall={m} onChange={(id, feeRate) => onChangeField(id, { feeRate })} />
    ),
  });

  columns.push({
    key: 'accrualRate',
    label: '적립률',
    render: (m) => (
      <AccrualRateCell mall={m} onChange={(id, accrualRate) => onChangeField(id, { accrualRate })} />
    ),
  });

  columns.push({ key: 'margin', label: '마진', render: (m) => <MarginCell mall={m} /> });

  columns.push({
    key: 'simulator',
    label: '시뮬레이터',
    render: (m) => <SimulatorButtonCell mall={m} onOpen={onOpenSimulator} />,
  });

  columns.push({
    key: 'applied',
    label: '적용',
    render: (m) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          className={`toggle ${m.applied ? 'on' : ''}`}
          onClick={() => onToggleApplied(m.id)}
          role="button"
          tabIndex={0}
          aria-label={`${m.name} 적용 ${m.applied ? '끄기' : '켜기'}`}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleApplied(m.id)}
        />
      </div>
    ),
  });

  // 미적용(비활성) 몰은 행 전체를 흐리게 표시하고, 적용으로 되돌리면 즉시 원래 색으로 돌아온다
  const getRowClassName = (m: IAffiliateMall) => (!m.applied ? 'ta-row-dim' : '');

  return (
    <div className="card">
      <div
        className="card-header"
        style={{ flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="card-title">제휴몰 (링크프라이스)</div>
          <select
            className="filter-sel"
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
          >
            <option value="">카테고리 전체</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="filter-sel"
            value={filters.approvalStatus}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                approvalStatus: e.target.value as IAffiliateMallApprovalStatus | '',
              })
            }
            title="링크프라이스 상태로 거르기"
          >
            {APPROVAL_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="filter-sel"
            value={filters.applied}
            onChange={(e) =>
              onFiltersChange({ ...filters, applied: e.target.value as TicketAccrualFilters['applied'] })
            }
          >
            {APPLIED_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-primary btn-sm" onClick={onSearch} disabled={isSearching}>
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {!selectMode ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onToggleSelectMode}
              title="여러 몰을 골라 체크한 뒤 일괄 조정하세요."
            >
              선택
            </button>
          ) : (
            <>
              <span className="badge badge-purple">{selectedIds.size}개 선택</span>
              <input
                className="form-input"
                type="number"
                min={0}
                max={100}
                step={1}
                value={bulkRate}
                style={{ width: '55px', height: '32px', textAlign: 'right' }}
                onChange={(e) => setBulkRate(Number(e.target.value))}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>%</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onBulkApplyRate(bulkRate)}>
                적립률 {bulkRate}% 적용
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onBulkSetApplied(true)}>
                적용으로
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onBulkSetApplied(false)}>
                미적용으로
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onToggleSelectMode}>
                취소
              </button>
            </>
          )}
          <span style={{ width: '1px', height: '22px', background: 'var(--border)' }} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={onOpenAddMall}>
            제휴몰 추가
          </button>
          <span style={{ width: '1px', height: '22px', background: 'var(--border)' }} />
          <button type="button" className="btn btn-primary btn-sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
      {dirtyCount > 0 && (
        <div
          style={{
            background: 'var(--warning-soft)',
            border: '1px solid var(--warning)',
            borderRadius: 'var(--r-md)',
            margin: '14px 20px',
            padding: '10px 16px',
            fontSize: '13px',
            color: 'var(--warning)',
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          저장하지 않은 변경 {dirtyCount}개 몰 — 저장 버튼을 눌러야 적용됩니다.
        </div>
      )}
      <div
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          fontSize: '11.5px',
          color: 'var(--text-3)',
        }}
      >
        <span>이 목록의 원본 자료</span>
        <a
          className="btn btn-ghost btn-sm"
          href="https://pricepick.vercel.app/devqa/linkprice-merchants-20260811.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          📄 HTML로 보기
        </a>
        <a
          className="btn btn-ghost btn-sm"
          href="https://pricepick.vercel.app/devqa/files/Linkprice_DetailMerchantList_20260811.xlsx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          ⬇️ 엑셀 다운로드
        </a>
      </div>
      <div className="ta-scroll-table" style={{ maxHeight: '640px', overflowY: 'auto', overflowX: 'auto' }}>
        <Table
          data={malls}
          columns={columns}
          keyExtractor={(m) => m.id}
          emptyMessage={emptyMessage}
          rowClassName={getRowClassName}
        />
      </div>
      <div
        style={{
          padding: '12px 18px',
          fontSize: '12px',
          color: 'var(--text-3)',
          borderTop: '1px solid var(--border)',
        }}
      >
        저장된 값 기준 · 총 {totalCount.toLocaleString()}개(표시 {malls.length.toLocaleString()}개)
      </div>
    </div>
  );
};
