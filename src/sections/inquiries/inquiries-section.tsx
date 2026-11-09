'use client';

import React, { useState } from 'react';
import { InfoBox } from 'src/components/common/info-box';
import type { PaginationProps } from 'src/components/common/pagination';
import { InquiryFilters } from 'src/components/inquiries/inquiry-filters';
import { InquiryDetailModal } from 'src/components/inquiries/inquiry-detail-modal';
import { InquiryStats } from 'src/components/inquiries/inquiry-stats';
import { InquiryTable } from 'src/components/inquiries/inquiry-table';
import { useInquiries } from 'src/sections/inquiries/hooks/use-inquiries';
import type { IQna, IUpdateQnaPayload } from 'src/types/qna';

export const InquiriesSection: React.FC = () => {
  const {
    inquiries,
    isLoading,
    isSaving,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    applyFilters,
    stats,
    isStatsLoading,
    answerInquiry,
    deleteInquiry,
  } = useInquiries();

  const [selected, setSelected] = useState<IQna | null>(null);

  const handleAnswer = async (id: string, payload: IUpdateQnaPayload) => {
    const ok = await answerInquiry(id, payload);
    if (ok) setSelected(null);
  };

  const pagination: PaginationProps = {
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
    <div className="section active" id="sec-inquiries">
      <InfoBox>
        1:1 문의 처리 — 답변을 저장하면 처리 상태가 자동으로 갱신되며, 완료된 문의도 처리 상태를
        다시 변경(재수정)할 수 있습니다.
      </InfoBox>

      <InquiryStats stats={stats} isLoading={isStatsLoading} />

      <div className="toolbar">
        <InquiryFilters onApplyFilters={applyFilters} />
      </div>

      <InquiryTable
        inquiries={inquiries}
        isLoading={isLoading}
        pagination={pagination}
        onOpen={setSelected}
        onDelete={deleteInquiry}
      />

      <InquiryDetailModal
        open={!!selected}
        inquiry={selected}
        isSaving={isSaving}
        onClose={() => setSelected(null)}
        onSubmit={handleAnswer}
      />
    </div>
  );
};
