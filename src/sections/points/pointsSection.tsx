'use client';

import React, { useEffect, useState } from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { PointsStats } from 'src/components/points/points-stats';
import { PointsTable } from 'src/components/points/points-table';
import { PointsToolbar } from 'src/components/points/points-toolbar';
import { useDebounce } from 'src/hooks/use-debounce';
import { usePoints } from 'src/sections/points/hooks/use-point';

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
  } = usePoints();
  const [keyword, setKeyword] = useState<string>('');
  const debouncedInput = useDebounce(keyword, 500);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedInput });
  }, [debouncedInput]);

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

      <PointsToolbar
        onSearch={setKeyword}
        onTypeChange={(value) => setFilters({ ...filters, type: value })}
        onPeriodChange={(value) => setFilters({ ...filters, period: value })}
      />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <PointsTable points={points} pagination={paginationProps} />
      )}
    </div>
  );
};
