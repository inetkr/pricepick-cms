'use client';

import React, { useState } from 'react';
import { RevenueStats } from 'src/components/revenue/revenue-stats';
import {
  FeeRevenueItem,
  GifticonRevenueItem,
  RevenueTable,
} from 'src/components/revenue/revenue-table';
import { RevenueTabs } from 'src/components/revenue/revenue-tabs';
import { RevenueToolbar } from 'src/components/revenue/revenue-toolbar';

// Mock data
const feeData: FeeRevenueItem[] = [
  {
    datetime: '2026/05/29<br>14:23:01',
    mall: '쿠팡',
    nickname: '쇼핑왕민준',
    uid: '#10042',
    orderNumber: '20260529-1423042',
    amount: '129,000원',
    commissionRate: '3.0%',
    commission: '+3,870원',
    ticketCost: '−2,500원',
    status: '정상',
  },
  {
    datetime: '2026/05/29<br>13:47:22',
    mall: '11번가',
    nickname: '알뜰살뜰지호',
    uid: '#10039',
    orderNumber: '11ST-0529-88412',
    amount: '28,900원',
    commissionRate: '3.5%',
    commission: '+1,011원',
    ticketCost: '−500원',
    status: '정상',
  },
  // thêm dữ liệu mock...
];

const gifticonData: GifticonRevenueItem[] = [
  {
    datetime: '2026/05/29<br>14:05:33',
    product: '스타벅스 아메리카노 T',
    nickname: '가격헌터서연',
    uid: '#10055',
    exchangePrice: '4,500원',
    wholesaleCost: '4,090원',
    margin: '+410원',
    status: '완료',
  },
  // thêm dữ liệu mock...
];

const feeColumns = [
  { key: 'datetime' as const, label: '발생 일시' },
  { key: 'mall' as const, label: '제휴몰' },
  { key: 'nickname' as const, label: '회원(UID)' },
  { key: 'orderNumber' as const, label: '주문번호' },
  { key: 'amount' as const, label: '구매금액' },
  { key: 'commissionRate' as const, label: '수수료율' },
  { key: 'commission' as const, label: '수수료 매출' },
  { key: 'ticketCost' as const, label: '적립 금액(티켓)' },
  { key: 'status' as const, label: '상태' },
];

const gifticonColumns = [
  { key: 'datetime' as const, label: '발생 일시' },
  { key: 'product' as const, label: '기프티콘 상품' },
  { key: 'nickname' as const, label: '회원(UID)' },
  { key: 'exchangePrice' as const, label: '교환가(실가)' },
  { key: 'wholesaleCost' as const, label: '도매 원가' },
  { key: 'margin' as const, label: '판매 마진' },
  { key: 'status' as const, label: '상태' },
];

export const RevenueSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMall, setSelectedMall] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Filter logic có thể thêm sau

  return (
    <div className="section active">
      <div className="data-source-bar">
        <span className="ds-label">데이터 출처</span>
        <span className="ds-tag ours">우리 DB · revenue_logs</span>
      </div>
      <div className="info-box">
        <strong>매출 내역</strong> — 매출 발생 건별 기록입니다. <strong>제휴 수수료</strong>(제휴몰
        D+30 정산)와 <strong>기프티콘 판매</strong>(교환 시 즉시 발생 마진)는 정산 주체·시점이 달라
        유형별로 분리해 관리합니다. 합산 지표는 <strong>수익 분석</strong> 페이지 참고.
      </div>

      <RevenueStats
        feeRevenue="4.2M"
        gifticonRevenue="0.2M"
        totalRevenue="4.4M"
        feeChange="제휴몰 D+30 정산"
        gifticonChange="교환 마진 · 즉시"
        totalChange="↑ 전월 +17%"
      />

      <div className="card" style={{ padding: '18px' }}>
        <RevenueTabs defaultTab="fee">
          <div>
            <RevenueToolbar
              searchPlaceholder="회원, 주문번호 검색..."
              onSearch={setSearchTerm}
              onMallChange={setSelectedMall}
              onPeriodChange={setSelectedPeriod}
            />
            <RevenueTable
              data={feeData}
              columns={feeColumns}
              totalLabel="오늘 3,421건 · 합 4,240,000원"
              totalValue="4,240,000원"
            />
          </div>
          <div>
            <RevenueToolbar searchPlaceholder="회원, 상품 검색..." onSearch={setSearchTerm} />
            <RevenueTable
              data={gifticonData}
              columns={gifticonColumns}
              totalLabel="오늘 47건 · 마진 합 38,600원"
              totalValue="38,600원"
            />
          </div>
        </RevenueTabs>
      </div>
    </div>
  );
};
