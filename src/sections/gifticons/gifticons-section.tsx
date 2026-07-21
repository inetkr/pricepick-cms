'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { InfoBox } from 'src/components/common/info-box';
import type { PaginationProps } from 'src/components/common/pagination';
import type { GifticonItem } from 'src/components/gifticons/gifticon-table';
import { GifticonTable } from 'src/components/gifticons/gifticon-table';
import { GifticonToolbar } from 'src/components/gifticons/gifticon-toolbar';

// Mock data
const gifticonData: GifticonItem[] = [
  {
    id: 1,
    purchaseDate: '2026/05/28',
    purchaseTime: '18:20:31',
    statusDate: '2026/05/29',
    statusTime: '01:25:05',
    orderNumber: 'PHTRX20260528182031',
    nickname: '노윤희',
    kakaoId: 'haessaldurum',
    productName: '네이버페이 포인트 2만원',
    productCode: '46073',
    expiryDate: '2026/06/27',
    status: 'used',
    ticketGrade: 'GOLD',
    ticketQuantity: 1,
  },
  {
    id: 2,
    purchaseDate: '2026/05/28',
    purchaseTime: '18:20:31',
    statusDate: '—',
    statusTime: '—',
    orderNumber: 'PHTRX20260528182031',
    nickname: '노윤희',
    kakaoId: 'haessaldurum',
    productName: '네이버페이 포인트 2만원',
    productCode: '46073',
    expiryDate: '2026/06/27',
    status: 'unused',
    ticketGrade: 'GOLD',
    ticketQuantity: 1,
  },
  {
    id: 3,
    purchaseDate: '2026/05/28',
    purchaseTime: '01:37:39',
    statusDate: '2026/05/28',
    statusTime: '23:05:03',
    orderNumber: 'PHTRX20260528013738',
    nickname: '미리',
    kakaoId: 'himanwi',
    productName: '[SSG상품권] 2만원권',
    productCode: '71229',
    expiryDate: '2026/06/26',
    status: 'used',
    ticketGrade: 'GOLD',
    ticketQuantity: 1,
  },
  {
    id: 4,
    purchaseDate: '2026/05/28',
    purchaseTime: '09:22:26',
    statusDate: '2026/05/28',
    statusTime: '16:25:05',
    orderNumber: 'PHTRX20260528092226',
    nickname: '노윤희',
    kakaoId: 'haessaldurum',
    productName: '네이버페이 포인트 2만원',
    productCode: '46073',
    expiryDate: '2026/06/26',
    status: 'used',
    ticketGrade: 'GOLD',
    ticketQuantity: 1,
  },
  {
    id: 5,
    purchaseDate: '2026/05/27',
    purchaseTime: '16:33:38',
    statusDate: '2026/05/27',
    statusTime: '23:35:12',
    orderNumber: 'PHTRX20260527163338',
    nickname: '문금주',
    kakaoId: 'bueongbueong',
    productName: '네이버페이 포인트 2만원',
    productCode: '46073',
    expiryDate: '2026/06/26',
    status: 'used',
    ticketGrade: 'GOLD',
    ticketQuantity: 1,
  },
  {
    id: 6,
    purchaseDate: '2026/05/27',
    purchaseTime: '13:51:32',
    statusDate: '2026/05/27',
    statusTime: '20:55:01',
    orderNumber: 'PHTRX20260527135132',
    nickname: '강신성',
    kakaoId: 'ddongbal',
    productName: '네이버페이 포인트 5만원',
    productCode: '46076',
    expiryDate: '2026/06/25',
    status: 'used',
    ticketGrade: 'GOLD',
    ticketQuantity: 2,
  },
];

export const GifticonSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // FAKE:
  const fakeTotalItems = 1050;
  const fakeTotalPages = Math.ceil(fakeTotalItems / itemsPerPage);

  // Filter logic
  const filteredData = gifticonData.filter((item) => {
    if (searchTerm && !item.nickname.includes(searchTerm)) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  // Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onPerpageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // 페이지 변경 시 첫 페이지로 이동
  };

  const paginationProps: PaginationProps = {
    currentPage,
    totalPages: fakeTotalPages,
    onPageChange: setCurrentPage,
    onItemsPerPageChange: onPerpageChange,
    showSizeChanger: true,
    showTotal: true,
    totalItems: fakeTotalItems,
    itemsPerPage,
  };

  const handleExport = () => {
    toast.success('CSV 내보내기 완료');
  };

  return (
    <div className="section active">
      <InfoBox>
        기프티콘 구매·사용 내역입니다. 회원이 티켓을 소모해 기프티콘을 교환하면 자동 기록됩니다.
      </InfoBox>

      {/* <GifticonStats totalCount={1050} usedCount={312} unusedCount={238} expiredCount={500} /> */}

      <GifticonToolbar
        onSearch={setSearchTerm}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
        onExport={handleExport}
      />

      <GifticonTable data={paginatedData} pagination={paginationProps} />
    </div>
  );
};
