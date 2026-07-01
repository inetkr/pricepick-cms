'use client';

import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'src/components/common/pagination';
import { TicketStats } from 'src/components/tickets/ticket-stats';
import { TicketTable } from 'src/components/tickets/ticket-table';
import { TicketToolbar } from 'src/components/tickets/ticket-toolbar';
import { useDebounce } from 'src/hooks/use-debounce';
import { useTickets } from 'src/sections/tickets/hooks/use-ticket';

export const TicketsSection: React.FC = () => {
  const {
    tickets,
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
  } = useTickets();
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
    <div className="section active" id="sec-tickets">
      {/* <div className="info-box">
          <strong>티켓 원장은 절대 삭제 금지</strong> — 회계/세무/부정거래 추적의 근거. 회수 시에도
          음수 레코드로 추가, 원본 보존. (append-only)
        </div> */}

      <TicketStats stats={stats} />

      <TicketToolbar
        onSearch={setKeyword}
        onTransactionTypeGroupChange={(value) =>
          setFilters({ ...filters, transaction_type_group: value })
        }
        onUsageStatusChange={(value) => setFilters({ ...filters, usage_status: value })}
      />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <TicketTable tickets={tickets} pagination={paginationProps} />
      )}
    </div>
  );
};
