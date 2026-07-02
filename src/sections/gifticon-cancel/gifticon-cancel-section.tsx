'use client';

import React, { useState } from 'react';
import { InfoBox } from 'src/components/common/info-box';
import type { PaginationProps } from 'src/components/common/pagination';
import type {
  GifticonCancelItem} from 'src/components/gifticon-cancel/gifticon-cancel-table';
import {
  GifticonCancelTable,
} from 'src/components/gifticon-cancel/gifticon-cancel-table';
import { GifticonCancelToolbar } from 'src/components/gifticon-cancel/gifticon-cancel-toolbar';

// Mock data
const mockData: GifticonCancelItem[] = [
  {
    id: 7,
    orderNumber: 'PHTRX2026012109341888...',
    nickname: '작은 들소',
    kakaoId: 'jogeun_deulso',
    productName: '달달연유라떼(HOT)',
    cancelDate: '2026/01/22',
    cancelTime: '11:32:16',
    reason: 'admin',
    refundTicket: { grade: 'bronze', quantity: -1 },
    remainingTicket: { grade: 'bronze', quantity: 1 },
  },
  {
    id: 6,
    orderNumber: 'PHTRX202601210932242...',
    nickname: '작은 들소',
    kakaoId: 'jogeun_deulso',
    productName: '밀크티(M)',
    cancelDate: '2026/01/22',
    cancelTime: '11:32:34',
    reason: 'admin',
    refundTicket: { grade: 'bronze', quantity: -1 },
    remainingTicket: { grade: 'bronze', quantity: 2 },
  },
  {
    id: 5,
    orderNumber: 'PHTRX202601210930566...',
    nickname: '작은 들소',
    kakaoId: 'jogeun_deulso',
    productName: '콜드브루(Hot)(TAKE-OUT)',
    cancelDate: '2026/01/22',
    cancelTime: '11:32:42',
    reason: 'admin',
    refundTicket: { grade: 'bronze', quantity: -1 },
    remainingTicket: { grade: 'bronze', quantity: 3 },
  },
  {
    id: 4,
    orderNumber: 'PHTRX202601210921430...',
    nickname: '작은 들소',
    kakaoId: 'jogeun_deulso',
    productName: '컬쳐랜드 모바일문화상품권 5,000원',
    cancelDate: '2026/01/22',
    cancelTime: '11:32:56',
    reason: 'admin',
    refundTicket: { grade: 'bronze', quantity: -1 },
    remainingTicket: { grade: 'bronze', quantity: 4 },
  },
  {
    id: 3,
    orderNumber: 'PHTRX202601210928588...',
    nickname: 'SUBIN LIM / 착한 청새치',
    kakaoId: 'cheongsaechi',
    productName: '[공차] 1만원권',
    cancelDate: '2026/01/22',
    cancelTime: '11:32:59',
    reason: 'admin',
    refundTicket: { grade: 'silver', quantity: -1 },
    remainingTicket: { grade: 'silver', quantity: 1 },
  },
  {
    id: 2,
    orderNumber: 'PHTRX202603040124260...',
    nickname: '이동주 / 순한 독수리',
    kakaoId: 'dongju_lee',
    productName: '구글기프트카드 5천원 교환권',
    cancelDate: '2026/03/09',
    cancelTime: '15:40:25',
    reason: 'admin',
    refundTicket: { grade: 'bronze', quantity: -1 },
    remainingTicket: { grade: 'bronze', quantity: 3 },
  },
  {
    id: 1,
    orderNumber: 'PHTRX202602260145366...',
    nickname: '애드블루스 / 희망찬 바다거북',
    kakaoId: 'blue_turtle',
    productName: '구글기프트카드 5천원 교환권',
    cancelDate: '2026/03/09',
    cancelTime: '15:40:32',
    reason: 'admin',
    refundTicket: { grade: 'bronze', quantity: -1 },
    remainingTicket: { grade: 'bronze', quantity: 4 },
  },
];

export const GifticonCancelSection: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchNickname, setSearchNickname] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = mockData.filter((item) => {
    if (searchName && !item.nickname.includes(searchName)) return false;
    if (searchNickname && !item.kakaoId.includes(searchNickname)) return false;
    if (searchOrder && !item.orderNumber.includes(searchOrder)) return false;
    if (searchProduct && !item.productName.includes(searchProduct)) return false;
    if (selectedReason && item.reason !== selectedReason) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationProps: PaginationProps = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
    totalItems: filteredData.length,
    itemsPerPage,
    showSizeChanger: true,
    showTotal: true,
    onItemsPerPageChange: (size) => {
      setCurrentPage(1); // 페이지 변경 시 첫 페이지로 이동
    },
  };

  const handleExport = () => {
    console.log('Export CSV');
    // TODO: implement export
  };

  return (
    <div className="section active">
      <InfoBox>
        기프티콘 취소 처리 내역입니다. 관리자 취소 또는 시스템 취소 건이 기록됩니다.
      </InfoBox>

      <GifticonCancelToolbar
        onSearchName={setSearchName}
        onSearchNickname={setSearchNickname}
        onSearchOrder={setSearchOrder}
        onSearchProduct={setSearchProduct}
        onReasonChange={setSelectedReason}
        onExport={handleExport}
      />

      <GifticonCancelTable data={paginatedData} pagination={paginationProps} />
    </div>
  );
};
