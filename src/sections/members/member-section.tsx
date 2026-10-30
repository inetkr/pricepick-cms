'use client';

import React, { useState } from 'react';
import type { CsvColumn } from 'src/components/common/csv-export-button';
import { CsvExportButton } from 'src/components/common/csv-export-button';
import type { PaginationProps } from 'src/components/common/pagination';
import { MemberFilters } from 'src/components/members/member-filters';
import { MemberModal } from 'src/components/members/member-modal';
import { MemberStats } from 'src/components/members/member-stats';
import { MemberTable } from 'src/components/members/member-table';
import { useMembers } from 'src/sections/members/hooks/use-member';
import type { IAdminTicketType } from 'src/types/common';
import type { IUser } from 'src/types/users/user';
import type { IUpdateUserStatusPayload } from 'src/types/users/user_status_history';
import { formatDate } from 'src/utils/helper';

const accountStatusLabels: Record<string, string> = {
  NORMAL: '정상',
  BLOCK: '차단',
  DELETE: '탈퇴',
};

const marketingConsentLabels: Record<string, string> = {
  ALL: '동의',
  NONE: '거부',
};

const memberCsvColumns: CsvColumn<IUser>[] = [
  { header: '닉네임', accessor: (m) => m.nickname },
  { header: '식별자', accessor: (m) => m.username },
  { header: '연동 상태', accessor: (m) => (m.kakao_info ? '카카오 연동' : '게스트(미연동)') },
  { header: '가입일', accessor: (m) => formatDate(m.created_at) },
  { header: '랜덤 티켓', accessor: (m) => m.pending_random_tickets },
  { header: '전환예정', accessor: (m) => m.pending_ticket },
  { header: '티켓', accessor: (m) => m.ticket_total },
  { header: '이벤트 티켓', accessor: (m) => m.event_ticket_total },
  {
    header: '마케팅 수신',
    accessor: (m) => marketingConsentLabels[m.user_setting?.marketing_consent] ?? '',
  },
  { header: '상태', accessor: (m) => accountStatusLabels[m.account_status] ?? '' },
];

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

  const handleSaveMember = (
    updatedMember: IUser,
    statusUpdate: IUpdateUserStatusPayload | null
  ) =>
    selectedMember
      ? updateMember(selectedMember, updatedMember, statusUpdate)
      : Promise.resolve(false);

  const handleGrantTicket = (data: {
    user_identifier: string; // 닉네임 또는 UID
    action: 'ADMIN_ADD' | 'ADMIN_SUB';
    ticket_type: IAdminTicketType;
    amount: number;
    description: string;
  }) => {
    grantTicket(data);
    const updated = members.find((m) => m.id === data.user_identifier);
    if (updated) {
      setSelectedMember(updated);
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
    <div className="section active" id="sec-members">
      <div className="data-source-bar">
        <span className="ds-label">데이터 출처</span>
        <span className="ds-tag ours">우리 DB · 회원 정보 (개인정보 포함, 보안 1순위)</span>
        <span className="ds-tag calc">집계 · 티켓 보유량, 가입일, 마지막 접속</span>
      </div>

      <div className="info-box">
        <strong>회원 가입 안내</strong>
        <br />
        카카오 연동 회원과 미연동(게스트) 회원이 모두 존재(로그인 정책 변경). 미연동 회원은 적립
        확정 대기 <strong>D+30</strong> 적용.
        <br />
        계정 모델: <strong>게스트(닉네임)로 시작</strong> → 앱 내 <strong>카카오 연동</strong>{' '}
        (애플·구글 로그인 폐지). 게스트는 적립만 누적, 사용·구매는 연동 후 가능.
        <br />
        구매 즉시 <strong>가지급 티켓(랜덤)</strong> 지급 → 포스트백 수신 후{' '}
        <strong>확정</strong> 시 티켓으로 전환
      </div>

      <div className="toolbar">
        <MemberFilters
          onApplyFilters={(newFilters) => setFilters({ ...filters, ...newFilters })}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <CsvExportButton
            data={members}
            columns={memberCsvColumns}
            filename="members.csv"
            label="내보내기"
          />
        </div>
      </div>

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
          isSuperAdmin
        />
      )}

      <MemberModal
        isOpen={isModalOpen}
        member={selectedMember}
        onClose={handleCloseModal}
        onSave={handleSaveMember}
        onTicketGrant={handleGrantTicket}
        isEditable
      />
    </div>
  );
};
