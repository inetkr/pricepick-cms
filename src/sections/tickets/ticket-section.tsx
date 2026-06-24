'use client';

import React, { useState } from 'react';
import { TicketToolbar } from 'src/components/tickets/ticket-toolbar';
import { TicketStats } from 'src/components/tickets/ticket-stats';
import { TicketItem, TicketTable } from 'src/components/tickets/ticket-table';

// Mock data (sẽ thay bằng API sau)
const mockData: TicketItem[] = [
  {
    nickname: '쇼핑왕민준',
    userId: 'minjun_kko',
    reason: '구매확정 전환',
    ticketType: 'gold',
    ticketCount: 1,
    ticketLabel: '골드 1장',
    date: '2026/05/29',
    time: '14:23:07',
    datetime: '2026/05/29 14:23:07',
  },
  {
    nickname: '가격헌터서연',
    userId: 'seoyeon_kko',
    reason: '구매 대기 (가지급)',
    ticketType: 'random',
    ticketCount: 1,
    ticketLabel: '랜덤 1장',
    date: '2026/05/29',
    time: '14:10:33',
    datetime: '2026/05/29 14:10:33',
  },
  {
    nickname: '가격헌터서연',
    userId: 'seoyeon_kko',
    reason: '구매확정 전환',
    ticketType: 'bronze',
    ticketCount: 1,
    ticketLabel: '브론즈 1장',
    date: '2026/05/29',
    time: '13:47:51',
    datetime: '2026/05/29 13:47:51',
  },
  {
    nickname: '딜헌터지민',
    userId: 'jiho_deal',
    reason: '구매확정 전환',
    ticketType: 'silver',
    ticketCount: 1,
    ticketLabel: '실버 1장',
    date: '2026/05/29',
    time: '13:05:22',
    datetime: '2026/05/29 13:05:22',
  },
  {
    nickname: '핫딜탐정',
    userId: 'hotdeal_kko',
    reason: '구매 대기 (가지급)',
    ticketType: 'random',
    ticketCount: 1,
    ticketLabel: '랜덤 1장',
    date: '2026/05/29',
    time: '12:51:09',
    datetime: '2026/05/29 12:51:09',
  },
  {
    nickname: '가격마스터',
    userId: 'price_master',
    reason: '구매확정 전환',
    ticketType: 'gold',
    ticketCount: 2,
    ticketLabel: '골드 2장 · 실버 1장 · 브론즈 3장',
    date: '2026/05/29',
    time: '12:40:44',
    datetime: '2026/05/29 12:40:44',
  },
  {
    nickname: '절약마스터',
    userId: 'saving_master',
    reason: '주간 미션 완료',
    ticketType: 'event',
    ticketCount: 2,
    ticketLabel: '이벤트 2장',
    date: '2026/05/29',
    time: '12:31:18',
    datetime: '2026/05/29 12:31:18',
  },
  {
    nickname: '쇼핑고수한나',
    userId: 'hanna_shop',
    reason: '출석 체크',
    ticketType: 'event',
    ticketCount: 1,
    ticketLabel: '이벤트 1장',
    date: '2026/05/29',
    time: '12:15:03',
    datetime: '2026/05/29 12:15:03',
  },
  {
    nickname: '딜헌터지민',
    userId: 'jiho_deal',
    reason: '광고 시청',
    ticketType: 'event',
    ticketCount: 1,
    ticketLabel: '이벤트 1장',
    date: '2026/05/29',
    time: '11:50:37',
    datetime: '2026/05/29 11:50:37',
  },
  {
    nickname: '친구초대왕',
    userId: 'invite_king',
    reason: '친구초대 보상',
    ticketType: 'event',
    ticketCount: 5,
    ticketLabel: '이벤트 5장',
    date: '2026/05/29',
    time: '11:30:55',
    datetime: '2026/05/29 11:30:55',
  },
  {
    nickname: '절약생활러',
    userId: 'saving_life',
    reason: '기프티콘 교환 소모',
    ticketType: 'gold',
    ticketCount: 1,
    ticketLabel: '−골드 1장',
    date: '2026/05/29',
    time: '11:10:29',
    datetime: '2026/05/29 11:10:29',
  },
  {
    nickname: '가격사냥꾼',
    userId: 'price_hunter',
    reason: '경품 응모 소모',
    ticketType: 'event',
    ticketCount: 3,
    ticketLabel: '−이벤트 3장',
    date: '2026/05/29',
    time: '10:55:14',
    datetime: '2026/05/29 10:55:14',
  },
  {
    nickname: '최수아',
    userId: 'choisua_kko',
    reason: '부정행위 회수',
    ticketType: 'event',
    ticketCount: 5,
    ticketLabel: '−5장 전액',
    date: '2026/05/29',
    time: '10:40:02',
    datetime: '2026/05/29 10:40:02',
  },
  {
    nickname: '운영자지급',
    userId: 'admin_system',
    reason: '관리자 지급',
    ticketType: 'gold',
    ticketCount: 2,
    ticketLabel: '골드 2장',
    date: '2026/05/29',
    time: '10:20:48',
    datetime: '2026/05/29 10:20:48',
  },
];

const ITEMS_PER_PAGE = 10;

export const TicketsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter dữ liệu
  const filteredData = mockData.filter((item) => {
    if (searchTerm && !item.nickname.includes(searchTerm) && !item.userId.includes(searchTerm))
      return false;
    // TODO: thêm filter theo type và status nếu cần
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleManualAction = () => {
    // TODO: Open modal for manual ticket issuance/withdrawal
    alert('수동 지급 / 회수 모달 열기');
  };

  return (
    <div className="section active">
      <TicketStats
        totalIssued="248,312"
        todayIssued="3,421"
        gifticonExchanged="2,847"
        prizeUsed="1,204"
        clawback="23"
        todayIssuedChange="↑ 12.4%"
      />

      <div className="info-box">
        <strong>티켓 원장은 절대 삭제 금지</strong> — 회계/세무/부정거래 추적의 근거. 회수 시에도
        음수 레코드로 추가, 원본 보존. (append-only)
      </div>

      <TicketToolbar
        onSearch={setSearchTerm}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        onAddManual={handleManualAction}
      />

      <div className="card">
        <div className="card-header">
          <div className="card-title">최근 티켓 이력</div>
        </div>
        <TicketTable
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
