// src/sections/clawback/ClawbackSection.tsx
'use client';

import React, { useState } from 'react';
import { ClawbackDebtTable, DebtItem } from 'src/components/clawback/clawback-debt-table';
import { ClawbackStats } from 'src/components/clawback/clawback-stats';
import { ClawbackItem, ClawbackTable } from 'src/components/clawback/clawback-table';
import { ClawbackToolbar } from 'src/components/clawback/clawback-toolbar';
import { InfoBox } from 'src/components/common/info-box';

// Mock data (giữ nguyên)
const clawbackData: ClawbackItem[] = [
  {
    id: 1,
    datetime: '2026/05/30<br>04:00:00',
    nickname: '절약마스터',
    kakaoId: 'saving_master',
    orderId: '—',
    tickets: [{ type: 'bronze', quantity: 2 }],
    reason: 'expire',
    originalDate: '2025/05/29',
    originalTime: '03:58:00',
  },
  {
    id: 2,
    datetime: '2026/05/11<br>14:32:00',
    nickname: '쇼핑왕민준',
    kakaoId: 'minjun_kko',
    orderId: 'CP-20260510-8821',
    tickets: [
      { type: 'silver', quantity: 1 },
      { type: 'bronze', quantity: 5 },
    ],
    reason: 'return',
    originalDate: '2026/05/10',
    originalTime: '09:14:00',
  },
  {
    id: 3,
    datetime: '2026/05/10<br>22:17:00',
    nickname: '절약러지호',
    kakaoId: 'jiho_kko',
    orderId: 'CP-20260509-4421',
    tickets: [{ type: 'bronze', quantity: 8 }],
    reason: 'cancel',
    originalDate: '2026/05/09',
    originalTime: '18:44:00',
  },
  {
    id: 4,
    datetime: '2026/05/10<br>11:03:00',
    nickname: '가격헌터서연',
    kakaoId: 'seoyeon_kko',
    orderId: 'CP-20260508-1104',
    tickets: [
      { type: 'gold', quantity: 1 },
      { type: 'silver', quantity: 2 },
    ],
    reason: 'return',
    originalDate: '2026/05/08',
    originalTime: '13:21:00',
  },
  {
    id: 5,
    datetime: '2026/05/09<br>08:55:00',
    nickname: '핫딜탐정',
    kakaoId: 'hotdeal_kko',
    orderId: 'CP-20260507-9982',
    tickets: [{ type: 'bronze', quantity: 3 }],
    reason: 'cancel',
    originalDate: '2026/05/07',
    originalTime: '20:10:00',
  },
];

const debtData: DebtItem[] = [
  {
    nickname: '쇼핑고수준혁',
    kakaoId: 'shop_junhyuk',
    debtTicket: [{ type: 'silver', quantity: -2 }],
    occurredDate: '2026/05/08',
    occurredTime: '13:21:00',
    expectedSettle: '다음 적립 시',
    status: '상계 대기',
  },
  {
    nickname: '알뜰소비민지',
    kakaoId: 'minji_save',
    debtTicket: [{ type: 'bronze', quantity: -12 }],
    occurredDate: '2026/05/01',
    occurredTime: '09:05:33',
    expectedSettle: '다음 적립 시',
    status: '상계 대기',
  },
];

export const ClawbackSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = clawbackData.filter((item) => {
    if (searchTerm && !item.nickname.includes(searchTerm) && !item.orderId.includes(searchTerm))
      return false;
    if (selectedReason && item.reason !== selectedReason) return false;
    // Grade filter có thể thêm sau
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationProps = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  const handleExport = () => {
    console.log('Export CSV');
    // TODO: implement
  };

  const handleViewDetail = (item: ClawbackItem) => {
    console.log('View detail:', item);
    // TODO: open modal
  };

  return (
    <div className="section active">
      <InfoBox>
        <strong>티켓 회수·소멸 이력</strong>은 구매 취소·반품에 의한 회수 및 등급 티켓 유효기간 만료
        소멸 내역입니다. TicketTransaction 테이블의 type='CLAWBACK'·'EXPIRE' 레코드를 조회합니다.
      </InfoBox>

      <ClawbackStats
        totalCount={47}
        totalBronze={312}
        totalSilver={28}
        totalGold={4}
        totalChange="↑ 전월 +8건"
      />

      <ClawbackToolbar
        onSearch={setSearchTerm}
        onGradeChange={setSelectedGrade}
        onReasonChange={setSelectedReason}
        onPeriodChange={setSelectedPeriod}
        onExport={handleExport}
      />

      <ClawbackTable
        data={paginatedData}
        pagination={paginationProps}
        onViewDetail={handleViewDetail}
        onViewLog={(item) => console.log('View log:', item)}
      />

      <ClawbackDebtTable data={debtData} />
    </div>
  );
};
