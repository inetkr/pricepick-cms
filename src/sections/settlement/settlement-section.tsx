'use client';

import React from 'react';
import { SettlementDiffBox } from 'src/components/settlement/settlement-diff-box';
import { SettlementStats } from 'src/components/settlement/settlement-stats';
import type { SettlementColumn} from 'src/components/settlement/settlement-table';
import { SettlementTable } from 'src/components/settlement/settlement-table';

// Định nghĩa kiểu dữ liệu
interface AffiliateSettlement {
  mall: string;
  ourRecord: string;
  confirmedAmount: string;
  diff: string;
  cycle: string;
  status: '일치' | '검증 중' | '오류';
}

interface MonthlySettlement {
  month: string;
  estimatedRevenue: string;
  confirmedAmount: string;
  diff: string;
  status: '집계 중' | '확정' | '처리완료';
}

// Mock data
const affiliateData: AffiliateSettlement[] = [
  {
    mall: '쿠팡',
    ourRecord: '2,550,000원',
    confirmedAmount: '2,550,000원',
    diff: '0원',
    cycle: '익월 15일',
    status: '일치',
  },
  {
    mall: '11번가',
    ourRecord: '540,000원',
    confirmedAmount: '540,000원',
    diff: '0원',
    cycle: '익월 말',
    status: '일치',
  },
  {
    mall: 'G마켓',
    ourRecord: '360,000원',
    confirmedAmount: '360,000원',
    diff: '0원',
    cycle: '익월 말',
    status: '일치',
  },
  {
    mall: '알리익스프레스',
    ourRecord: '270,000원',
    confirmedAmount: '265,000원',
    diff: '-5,000원',
    cycle: 'D+45',
    status: '검증 중',
  },
  {
    mall: '아이허브',
    ourRecord: '100,000원',
    confirmedAmount: '100,000원',
    diff: '0원',
    cycle: '익월 15일',
    status: '일치',
  },
];

const monthlyData: MonthlySettlement[] = [
  {
    month: '2026년 5월',
    estimatedRevenue: '4,200,000원',
    confirmedAmount: '집계 중',
    diff: '—',
    status: '집계 중',
  },
  {
    month: '2026년 4월',
    estimatedRevenue: '3,820,000원',
    confirmedAmount: '3,815,000원',
    diff: '-5,000원',
    status: '확정',
  },
  {
    month: '2026년 3월',
    estimatedRevenue: '3,505,000원',
    confirmedAmount: '3,480,000원',
    diff: '-25,000원',
    status: '처리완료',
  },
];

// Định nghĩa columns
const affiliateColumns: SettlementColumn<AffiliateSettlement>[] = [
  { key: 'mall', label: '제휴몰' },
  { key: 'ourRecord', label: '우리 기록', align: 'center' },
  { key: 'confirmedAmount', label: '확정 정산금', align: 'center' },
  {
    key: 'diff',
    label: '차액',
    align: 'center',
    render: (item) => (
      <span style={{ color: item.diff === '0원' ? 'var(--text-2)' : 'var(--danger)' }}>
        {item.diff}
      </span>
    ),
  },
  {
    key: 'cycle',
    label: '정산 주기',
    align: 'center',
    render: (item) => <span style={{ fontSize: '12px' }}>{item.cycle}</span>,
  },
  {
    key: 'status',
    label: '상태',
    align: 'center',
    render: (item) => {
      const statusMap = {
        일치: 'badge-green',
        '검증 중': 'badge-amber',
        오류: 'badge-red',
      };
      return (
        <span className={`badge ${statusMap[item.status] || 'badge-gray'}`}>{item.status}</span>
      );
    },
  },
];

const monthlyColumns: SettlementColumn<MonthlySettlement>[] = [
  { key: 'month', label: '정산 월' },
  { key: 'estimatedRevenue', label: '추정 매출', align: 'center' },
  {
    key: 'confirmedAmount',
    label: '확정 정산금',
    align: 'center',
    render: (item) => (
      <span style={{ color: item.confirmedAmount === '집계 중' ? 'var(--text-3)' : 'var(--text)' }}>
        {item.confirmedAmount}
      </span>
    ),
  },
  {
    key: 'diff',
    label: '차액',
    align: 'center',
    render: (item) => (
      <span style={{ color: item.diff === '—' ? 'var(--text-3)' : 'var(--danger)' }}>
        {item.diff}
      </span>
    ),
  },
  {
    key: 'status',
    label: '상태',
    align: 'center',
    render: (item) => {
      const statusMap = {
        '집계 중': 'badge-amber',
        확정: 'badge-green',
        처리완료: 'badge-green',
      };
      return (
        <span className={`badge ${statusMap[item.status] || 'badge-gray'}`}>{item.status}</span>
      );
    },
  },
];

const diffReasons = [
  {
    label: '환불 처리 누락',
    description: '2건 · -38,000원 (제휴몰은 차감, 우리 시스템 미반영 → 포스트백 재처리 필요)',
  },
  {
    label: '부정거래 검증 지연',
    description: '5건 · -5,000원 (제휴몰 검증 후 차감, 다음달 정산 반영)',
  },
];

export const SettlementSection: React.FC = () => {
  const handleExport = () => {
    console.log('Export CSV');
    // TODO: implement export
  };

  return (
    <div className="section active">
      <div className="data-source-bar">
        <span className="ds-label">데이터 출처</span>
        <span className="ds-tag coupang">제휴몰 파트너스 정산 데이터 · 제휴몰별 확정 주기</span>
        <span className="ds-tag calc">우리 DB 집계 · 추정 매출 (포스트백 기준)</span>
      </div>

      <SettlementStats
        monthlyConfirmed="3.8M"
        monthlyEstimated="4.2M"
        yearlyTotal="18.4M"
        confirmedDesc="2026년 4월분 · 5개 제휴몰"
        estimatedDesc="5월 포스트백 기준"
        yearlyChange="↑ 전년 대비 +34%"
      />

      {/* Bảng 정산 현황 theo 제휴몰 */}
      <SettlementTable
        title="제휴몰별 정산 현황"
        totalLabel="2026년 4월 확정분"
        data={affiliateData}
        columns={affiliateColumns}
        onExport={handleExport}
      />

      {/* Bảng 월별 정산 추이 */}
      <SettlementTable
        title="월별 정산 추이"
        data={monthlyData}
        columns={monthlyColumns}
        onExport={handleExport}
      />

      {/* Hộp giải thích chênh lệch */}
      <SettlementDiffBox title="차액 사유 (이번달)" reasons={diffReasons} />
    </div>
  );
};
