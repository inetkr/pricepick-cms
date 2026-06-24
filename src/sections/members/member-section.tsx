'use client';

import React, { useState } from 'react';
import { MemberFilters } from 'src/components/members/member-filters';
import { MemberModal } from 'src/components/members/member-modal';
import { MemberStats } from 'src/components/members/member-stats';
import { MemberTable } from 'src/components/members/member-table';
import { useMembers } from 'src/hooks/use-member';
import { Member } from 'src/types/members/member';

export const MembersSection: React.FC = () => {
  const {
    members,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateMemberStatus,
    updateMember,
    grantTicket,
  } = useMembers();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (id: number) => {
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

  const handleSaveMember = (updatedMember: Member) => {
    updateMember(updatedMember);
  };

  const handleGrantTicket = (memberId: number, grade: string, quantity: number) => {
    grantTicket(memberId, grade, quantity);
    // Cập nhật lại selectedMember
    const updated = members.find((m) => m.id === memberId);
    if (updated) {
      setSelectedMember(updated);
    }
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
        onSearch={setSearchTerm}
        onJoinTypeChange={(value) => setFilters({ ...filters, joinType: value })}
        onStatusChange={(value) => setFilters({ ...filters, status: value })}
        onMarketingChange={(value) => setFilters({ ...filters, marketing: value })}
      />

      <MemberStats stats={stats} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          로딩 중...
        </div>
      ) : (
        <MemberTable
          members={members}
          onViewDetail={handleViewDetail}
          onStatusChange={updateMemberStatus}
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
