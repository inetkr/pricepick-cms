'use client';

import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'src/components/common/pagination';
import { MemberFilters } from 'src/components/members/member-filters';
import { MemberModal } from 'src/components/members/member-modal';
import { MemberStats } from 'src/components/members/member-stats';
import { MemberTable } from 'src/components/members/member-table';
import { useDebounce } from 'src/hooks/use-debounce';
import { useMembers } from 'src/sections/members/hooks/use-member';
import { IUser } from 'src/types/users/user';

export const MembersSection: React.FC = () => {
  const {
    members,
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
    updateMember,
    grantTicket,
  } = useMembers();
  const [selectedMember, setSelectedMember] = useState<IUser | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const debouncedInput = useDebounce(keyword, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      setSelectedMember(member);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleSaveMember = (updatedMember: IUser) => {
    updateMember(updatedMember);
  };

  const handleGrantTicket = (
    memberId: string,
    data: {
      action: 'ADMIN_ADD' | 'ADMIN_SUB';
      ticket_type: 'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD';
      amount: number;
      description: string;
    }
  ) => {
    grantTicket(memberId, data);
    const updated = members.find((m) => m.id === memberId);
    if (updated) {
      setSelectedMember(updated);
    }
  };

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
    <div className="section active" id="sec-members">
      {/* <div className="data-source-bar">
        <span className="ds-label">데이터 출처</span>
        <span className="ds-tag ours">우리 DB · users 테이블 (PII 포함, 보안 1순위)</span>
        <span className="ds-tag calc">집계 · 티켓 보유량, 가입일, 마지막 접속</span>
      </div> */}

      {/* <div className="info-box">
        <strong>회원 가입 안내</strong>
        <br />
        카카오 연동 회원과 미연동 회원이 모두 존재(로그인 정책 변경). 미연동 회원은 적립 확정 대기{' '}
        <strong>D+30</strong> 적용.
        <br />
        가입 경로: <strong>카카오 직접</strong> · <strong>Apple → 카카오</strong> ·{' '}
        <strong>Google → 카카오</strong> — 모든 경로 동일하게 적용
        <br />
        구매 즉시 <strong>가지급 티켓(랜덤)</strong> 지급 → 포스트백 수신 후{' '}
        <strong>연동 D+7 / 미연동 D+30 확정</strong> 시 등급 티켓(브론즈/실버/골드)으로 전환
      </div> */}

      <MemberFilters
        onSearch={(value) => {
          setKeyword(value);
        }}
        onKakaoStatusChange={(value) => setFilters({ ...filters, kakao_status: value })}
        onAccountStatusChange={(value) => setFilters({ ...filters, account_status: value })}
        onMarketingChange={(value) => setFilters({ ...filters, marketing_consent: value })}
      />

      <MemberStats stats={stats} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <MemberTable
          members={members}
          pagination={paginationProps}
          onViewDetail={handleViewDetail}
          onStatusChange={() => {}}
          isSuperAdmin={true}
        />
      )}

      <MemberModal
        isOpen={isModalOpen}
        member={selectedMember}
        onClose={handleCloseModal}
        onSave={handleSaveMember}
        onTicketGrant={handleGrantTicket}
        isEditable={true}
      />
    </div>
  );
};
