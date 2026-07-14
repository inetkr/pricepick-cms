'use client';

import React, { useState } from 'react';
import type { CsvColumn } from 'src/components/common/csv-export-button';
import { exportArrayToCsv } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { InfoBox } from 'src/components/stats/info-box';
import { TicketFilters } from 'src/components/tickets/ticket-filters';
import { TicketManualModal } from 'src/components/tickets/ticket-manual-modal';
import { TicketStats } from 'src/components/tickets/ticket-stats';
import { TicketTable } from 'src/components/tickets/ticket-table';
import { useTickets } from 'src/sections/tickets/hooks/use-ticket';
import type { ITicket } from 'src/types/tickets/ticket';
import { formatDate } from 'src/utils/helper';

const usageStatusLabels: Record<string, string> = {
  USED: '사용 완료',
  PENDING: '가지급(대기)',
  HOLDING: '보유 중',
  ADMIN_SUB: '회수',
  REJECTED: '거절',
};

const ticketGradeLabels: Record<string, string> = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
  EVENT: '이벤트',
  RANDOM: '랜덤',
};

const ticketCsvColumns: CsvColumn<ITicket>[] = [
  { header: '닉네임', accessor: (t) => t.nickname },
  { header: '카카오톡 ID', accessor: (t) => t.kakao_nickname },
  { header: '식별자', accessor: (t) => t.identified_id },
  { header: '사유', accessor: (t) => t.description },
  { header: '티켓 등급', accessor: (t) => ticketGradeLabels[t.ticket_type] ?? t.ticket_type },
  { header: '수량', accessor: (t) => t.amount },
  { header: '상태', accessor: (t) => usageStatusLabels[t.usage_status] ?? t.usage_status },
  { header: '일시', accessor: (t) => formatDate(t.created_at) },
];

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
    manualTicketAction,
    exportTickets,
  } = useTickets();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const allTickets = await exportTickets();
      exportArrayToCsv(allTickets, ticketCsvColumns, 'tickets.csv');
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
    <div className="section active" id="sec-tickets">
      <TicketStats stats={stats} />

      <InfoBox type="info">
        <strong>티켓 원장은 절대 삭제 금지</strong> — 회계/세무/부정거래 추적의 근거. 회수 시에도
        음수 레코드로 추가, 원본 보존. (append-only)
      </InfoBox>

      <div className="toolbar">
        <TicketFilters onApplyFilters={(newFilters) => setFilters({ ...filters, ...newFilters })} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={totalItems === 0 || isExporting}
            onClick={handleExportCsv}
          >
            {isExporting ? '내보내는 중...' : 'CSV 내보내기'}
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
        <TicketTable tickets={tickets} pagination={paginationProps} />
      )}

      <TicketManualModal
        open={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={(data) =>
          manualTicketAction({
            user_identifier: data.user_identifier,
            action: data.action,
            tickets: data.tickets,
            description: data.description,
          })
        }
      />
    </div>
  );
};
