'use client';

import React, { useState } from 'react';
import type { PaginationProps } from 'src/components/common/pagination';
import { InfoBox } from 'src/components/common/info-box';
import { WithdrawalDetailModal } from 'src/components/withdrawal/withdrawal-detail-modal';
import { WithdrawalFlowCard } from 'src/components/withdrawal/withdrawal-flow-card';
import { WithdrawalPolicyCard } from 'src/components/withdrawal/withdrawal-policy-card';
import { WithdrawalStats } from 'src/components/withdrawal/withdrawal-stats';
import { WithdrawalTable } from 'src/components/withdrawal/withdrawal-table';
import { WithdrawalToolbar } from 'src/components/withdrawal/withdrawal-toolbar';
import { useWithdrawal } from 'src/sections/withdrawal/hooks/use-withdrawal';
import type { IUser } from 'src/types/users/user';

export const WithdrawalSection: React.FC = () => {
  const { members, stats, isLoading, filters, setFilters, page, setPage, limit, setLimit, totalPages, totalItems } =
    useWithdrawal();
  const [selectedMember, setSelectedMember] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (member: IUser) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
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
    <div className="section active" id="sec-withdrawal">
      <InfoBox type="warning">
        <strong>즉시 처리 방침</strong> — 회원이 앱 &quot;마이 → 계정탈퇴&quot;를 누르면{' '}
        <strong>그 자리에서 즉시 처리</strong>됩니다(유예·철회 기간 없음). 개인정보(PII)는 즉시
        스크랩되고 회원 문서(레코드)는 유지됩니다. 처리 누락 시 개인정보보호법 위반 소지.
      </InfoBox>

      <WithdrawalStats stats={stats} />

      <WithdrawalFlowCard />

      <WithdrawalToolbar onSearch={(search) => setFilters({ ...filters, search })} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <WithdrawalTable members={members} pagination={paginationProps} onViewDetail={handleViewDetail} />
      )}

      <WithdrawalPolicyCard />

      <WithdrawalDetailModal
        isOpen={isModalOpen}
        member={selectedMember}
        onClose={handleCloseModal}
      />
    </div>
  );
};
