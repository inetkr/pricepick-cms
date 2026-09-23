import React, { useMemo, useState } from 'react';
import type { Column } from 'src/components/common/table';
import { Table } from 'src/components/common/table';
import {
  AccrualRateCell,
  AppSupportCell,
  ApprovalBadgeCell,
  CommissionCell,
  LogoCell,
  LpConvertLabelCell,
  MarginCell,
  SimulatorButtonCell,
  WhenTransCell,
} from 'src/components/ticket-accrual/ticket-accrual-rate-cells';
import type { TicketAccrualFilters } from 'src/sections/ticket-accrual/hooks/use-ticket-accrual';
import type {
  IAffiliateMall,
  IAffiliateMallApprovalStatus,
} from 'src/types/config/ticket_accrual_config';
import { accrualRateCap } from 'src/utils/ticket-accrual';

const APPROVAL_FILTER_OPTIONS: { value: IAffiliateMallApprovalStatus | ''; label: string }[] = [
  { value: '', label: '링크프라이스 승인 상태 전체' },
  { value: 'APPROVED', label: '승인' },
  { value: 'PENDING', label: '승인대기' },
  { value: 'REJECTED', label: '거부' },
  { value: 'NOT_APPLIED', label: '미신청' },
];

const APPLIED_FILTER_OPTIONS: { value: TicketAccrualFilters['applied']; label: string }[] = [
  { value: '', label: '적용 상태 전체' },
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
  // 이 화면에서 운영자가 고치는 값은 적립률 하나다 — 커미션·승인 상태·등급 전환 시점은 모두
  // 링크프라이스가 정하는 값이라 읽기 전용이다.
  onChangeField: (id: string, patch: Partial<Pick<IAffiliateMall, 'accrualRate'>>) => void;
  onOpenSimulator: (mall: IAffiliateMall) => void;
  onOpenDetail: (mall: IAffiliateMall) => void;
  onEditLogo: (mall: IAffiliateMall) => void;
  onOpenAddMall: () => void;
  // 링크프라이스 광고주 조회 API를 지금 불러와 merchant_source=LINKPRICE 레코드를 갱신한다.
  onSyncLinkprice: () => void;
  isSyncingLinkprice: boolean;
  // 마지막 갱신 결과 한 줄 — 아직 한 번도 실행하지 않았으면 null(줄 자체를 그리지 않는다).
  linkpriceSyncMessage: string | null;
  linkpriceSyncStatus: 'ok' | 'bad' | null;
  // 마지막으로 링크프라이스에서 제휴몰 정보를 받아온 시각 — 목록 하단에 함께 적는다.
  linkpriceSyncedAt: string | null;
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
  onOpenAddMall,
  onSyncLinkprice,
  isSyncingLinkprice,
  linkpriceSyncMessage,
  linkpriceSyncStatus,
  linkpriceSyncedAt,
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

  const savedLogoById = useMemo(
    () => new Map(savedMalls.map((m) => [m.id, m.logoUrl])),
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
      width: '4%',
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
    width: '4%',
    render: (m) => {
      const savedLogoUrl = savedLogoById.get(m.id);
      const changed = savedLogoUrl !== undefined && savedLogoUrl !== m.logoUrl;
      return <LogoCell mall={m} onEdit={onEditLogo} changed={changed} />;
    },
  });

  columns.push({
    key: 'name',
    label: '제휴몰',
    align: 'center',
    width: '11%',
    render: (m) => (
      <button type="button" className="ta-name-link" onClick={() => onOpenDetail(m)}>
        {m.name}
      </button>
    ),
  });

  // 링크프라이스가 정해 내려주는 값이라 우리가 고치지 않는다 — 읽기 전용 배지다.
  columns.push({
    key: 'approvalStatus',
    label: '링크프라이스 승인 상태',
    width: '8%',
    render: (m) => <ApprovalBadgeCell mall={m} />,
  });

  // 링크프라이스 제휴몰이 우리에게 주는 값은 커미션(모바일) 하나이고 그것도 읽기 전용이다.
  // 이 화면에서 우리가 정하는 값은 적립률 하나뿐이라 수수료 입력칸은 대표 제휴몰에만 둔다.
  columns.push({
    key: 'feeRate',
    label: '커미션(모바일)',
    width: '8%',
    className: 'ta-tight',
    render: (m) => <CommissionCell mall={m} />,
  });

  columns.push({
    key: 'app',
    label: '앱(AOS·iOS)',
    width: '9%',
    className: 'ta-tight',
    render: (m) => <AppSupportCell mall={m} />,
  });

  columns.push({
    key: 'accrualRate',
    label: '적립률',
    width: '9%',
    render: (m) => (
      <AccrualRateCell
        mall={m}
        max={accrualRateCap(m.feeRate)}
        onChange={(id, accrualRate) => onChangeField(id, { accrualRate })}
      />
    ),
  });

  columns.push({
    key: 'margin',
    label: '수익',
    width: '7%',
    render: (m) => <MarginCell mall={m} />,
  });

  columns.push({
    key: 'whenTrans',
    label: '랜덤티켓 지급 시점',
    width: '15%',
    render: (m) => <WhenTransCell mall={m} />,
  });

  columns.push({
    key: 'convert',
    label: '등급 전환 시점',
    width: '9%',
    render: () => <LpConvertLabelCell />,
  });

  columns.push({
    key: 'simulator',
    label: '시뮬레이터',
    width: '9%',
    render: (m) => <SimulatorButtonCell mall={m} onOpen={onOpenSimulator} />,
  });

  columns.push({
    key: 'applied',
    label: '적용',
    width: '7%',
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
        style={{
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="card-title">제휴몰(링크프라이스)</div>
          <select
            className="form-input"
            style={{ width: '120px' }}
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
            className="form-input"
            style={{ width: '190px' }}
            value={filters.approvalStatus}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                approvalStatus: e.target.value as IAffiliateMallApprovalStatus | '',
              })
            }
            title="링크프라이스 승인 상태로 거르기"
          >
            {APPROVAL_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="form-input"
            style={{ width: '125px' }}
            value={filters.applied}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                applied: e.target.value as TicketAccrualFilters['applied'],
              })
            }
          >
            {APPLIED_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onSearch}
            disabled={isSearching}
          >
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {!selectMode ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onToggleSelectMode}
              title="눌러서 몰을 체크한 뒤 일괄 조작하세요."
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
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onBulkApplyRate(bulkRate)}
              >
                적립률 {bulkRate}% 적용
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onBulkSetApplied(true)}
              >
                적용으로
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onBulkSetApplied(false)}
              >
                미적용으로
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onToggleSelectMode}>
                취소
              </button>
            </>
          )}
          <span style={{ width: '1px', height: '22px', background: 'var(--border)' }} />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onSyncLinkprice}
            disabled={isSyncingLinkprice}
            title="링크프라이스 광고주 조회 API를 지금 불러 제휴몰 정보를 갱신합니다."
          >
            {isSyncingLinkprice ? '갱신 중...' : '링크프라이스 업데이트'}
          </button>
          <span style={{ width: '1px', height: '22px', background: 'var(--border)' }} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={onOpenAddMall}>
            제휴몰 추가
          </button>
          <span style={{ width: '1px', height: '22px', background: 'var(--border)' }} />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
      {linkpriceSyncMessage && (
        <div
          style={{
            padding: '7px 20px',
            borderBottom: '1px solid var(--border)',
            fontSize: '11.5px',
            color: linkpriceSyncStatus === 'ok' ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {linkpriceSyncMessage}
        </div>
      )}
      {dirtyCount > 0 && (
        <div
          style={{
            background: 'var(--warning-soft)',
            border: '1px solid var(--warning)',
            borderRadius: 'var(--r-md)',
            margin: '0 0 14px',
            padding: '10px 16px',
            fontSize: '12px',
            color: 'var(--warning)',
            fontWeight: 700,
          }}
        >
          저장하지 않은 변경 {dirtyCount}건 — 저장 버튼을 눌러야 적용됩니다
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
          HTML로 보기
        </a>
        <a
          className="btn btn-ghost btn-sm"
          href="https://pricepick.vercel.app/devqa/files/Linkprice_DetailMerchantList_20260811.xlsx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          엑셀 내려받기
        </a>
      </div>
      <div
        className="ta-scroll-table"
        style={{ maxHeight: '640px', overflowY: 'auto', overflowX: 'auto' }}
      >
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
          fontSize: '13px',
          color: 'var(--text-3)',
          borderTop: '1px solid var(--border)',
        }}
      >
        저장된 값 기준 · 총 {totalCount.toLocaleString()}개(표시 {malls.length.toLocaleString()}개)
        {linkpriceSyncedAt && ` · 제휴몰 정보 마지막 갱신 ${linkpriceSyncedAt}`}
      </div>
    </div>
  );
};
