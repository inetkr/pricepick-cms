'use client';

import React, { useState } from 'react';
import { PointsStats } from 'src/components/points/points-stats';
import { PointsItem, PointsTable } from 'src/components/points/points-table';
import { PointsToolbar } from 'src/components/points/points-toolbar';

// Mock data từ file gốc
const mockData: PointsItem[] = [
  {
    id: 1,
    nickname: '쇼핑왕민준',
    kakaoId: 'minjun_kko',
    type: '출석 적립',
    points: 100,
    balance: 1300,
    date: '2026/06/06',
    time: '09:12:41',
    datetime: '2026/06/06 09:12:41',
  },
  {
    id: 2,
    nickname: '가격헌터서연',
    kakaoId: 'seoyeon_kko',
    type: '티켓 교환',
    points: 1000,
    balance: 3420,
    date: '2026/06/06',
    time: '08:55:10',
    datetime: '2026/06/06 08:55:10',
  },
  {
    id: 3,
    nickname: '딜헌터지민',
    kakaoId: 'jiho_deal',
    type: '티켓 교환',
    points: -10000,
    balance: 2140,
    date: '2026/06/05',
    time: '21:33:02',
    datetime: '2026/06/05 21:33:02',
  },
  {
    id: 4,
    nickname: '절약마스터',
    kakaoId: 'saving_master',
    type: '출석 적립',
    points: 100,
    balance: 980,
    date: '2026/06/05',
    time: '10:04:55',
    datetime: '2026/06/05 10:04:55',
  },
  {
    id: 5,
    nickname: '핫딜탐정',
    kakaoId: 'hotdeal_kko',
    type: '만료 소멸',
    points: -300,
    balance: 1520,
    date: '2026/06/05',
    time: '04:00:00',
    datetime: '2026/06/05 04:00:00',
  },
  {
    id: 6,
    nickname: '가격마스터',
    kakaoId: 'price_master',
    type: '관리자 지급',
    points: 500,
    balance: 4500,
    date: '2026/06/04',
    time: '16:20:18',
    datetime: '2026/06/04 16:20:18',
  },
];

export const PointsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = mockData.filter((item) => {
    if (searchTerm && !item.nickname.includes(searchTerm) && !item.kakaoId.includes(searchTerm))
      return false;
    if (selectedType && item.type !== selectedType) return false;
    // TODO: filter by period
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
    // TODO: implement export
  };

  const handleManual = () => {
    console.log('Open manual points modal');
    // TODO: open modal
  };

  return (
    <div className="section active">
      <div className="info-box">
        <strong>포인트 원장은 append-only</strong> — 적립·사용·만료·교환 모두 레코드로 누적되며 삭제
        금지. 회수도 음수 레코드로 추가합니다. (10P = 1원)
      </div>

      <PointsStats
        totalAccumulated="48,210,400P"
        todayAccumulated="1,284,100P"
        totalUsed="31,902,000P"
        expiredThisMonth="204,500P"
      />

      <PointsToolbar
        onSearch={setSearchTerm}
        onTypeChange={setSelectedType}
        onPeriodChange={setSelectedPeriod}
        onExport={handleExport}
        onManual={handleManual}
      />

      <PointsTable data={paginatedData} pagination={paginationProps} />
    </div>
  );
};
