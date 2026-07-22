'use client';

import React, { useState } from 'react';
import type { CsvColumn } from 'src/components/common/csv-export-button';
import { exportArrayToCsv } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { PointManualModal } from 'src/components/points/point-manual-modal';
import { PointsFilter } from 'src/components/points/points-filter';
import { PointsStats } from 'src/components/points/points-stats';
import { PointsTable } from 'src/components/points/points-table';
import { usePoints } from 'src/sections/points/hooks/use-point';
import type { IPoint, IPointTransactionType } from 'src/types/points/point';
import { formatDate } from 'src/utils/helper';

const transactionTypeCsvLabels: Record<IPointTransactionType, string> = {
  ATTENDANCE: '출석(쿠팡 구경하기)',
  FRIEND_INVITE: '친구초대 보상',
  ONBOARDING: '온보딩 보상',
  LUCKY_SPIN: '행운룰렛 당첨',
  CONVERT_FROM_TICKET: '티켓→포인트 전환',
  EXPIRED: '만료 소멸',
  ADMIN_ADD: '관리자 지급',
  ADMIN_SUB: '관리자 회수',
  CONVERT_TO_TICKET: '포인트→티켓 전환',
};

const pointsCsvColumns: CsvColumn<IPoint>[] = [
  { header: '회원', accessor: (p) => p.nickname },
  {
    header: '유형',
    accessor: (p) => transactionTypeCsvLabels[p.transaction_type] ?? p.transaction_type,
  },
  { header: '포인트', accessor: (p) => p.amount },
  { header: '일시', accessor: (p) => formatDate(p.created_at) },
];

export const PointsSection: React.FC = () => {
  const {
    points,
    stats,
    isLoading,
    filters,
    setFilters,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    manualPointAction,
    exportPoints,
  } = usePoints();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const allPoints = await exportPoints();
      exportArrayToCsv(allPoints, pointsCsvColumns, 'points.csv');
    } finally {
      setIsExporting(false);
    }
  };

  const paginationProps: PaginationProps = {
    currentPage: page,
    totalPages,
    onPageChange: setPage,
    onItemsPerPageChange: setLimit,
    showSizeChanger: true,
    showTotal: true,
    totalItems,
    itemsPerPage: limit,
  };

  return (
    <div className="section active" id="sec-points">
      <div className="info-box">
        <strong>포인트 원장은 append-only</strong> — 적립·사용·만료·교환 모두 레코드로 누적되며 삭제
        금지. 회수도 음수 레코드로 추가합니다. (10P = 1원)
      </div>

      <PointsStats stats={stats} />

      <div className="toolbar">
        <PointsFilter onApplyFilters={(newFilters) => setFilters({ ...filters, ...newFilters })} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={totalItems === 0 || isExporting}
            onClick={handleExportCsv}
          >
            {isExporting ? '내보내는 중...' : '내보내기'}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsManualModalOpen(true)}
          >
            수동 지급 / 회수
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <PointsTable points={points} pagination={paginationProps} />
      )}

      <PointManualModal
        open={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={(data) =>
          manualPointAction({
            user_identifier: data.user_identifier,
            action: data.action,
            amount: data.amount,
            description: data.description,
          })
        }
      />
    </div>
  );
};
