'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardAPI } from 'src/api';
import type {
  IDashboardRecentPurchase,
  IDashboardSummary,
  IDashboardTopMember,
  IDashboardTopMerchant,
} from 'src/types/dashboard/dashboard';
import { StatCard } from 'src/components/common/stat-card';
import { RecentActivityTable } from 'src/components/dashboard/recent-activity-table';
import { TopAffiliatesTable } from 'src/components/dashboard/top-affliate-table';
import { TopTicketUsersTable } from 'src/components/dashboard/top-ticket-users-table';

const emptyStateStyle: React.CSSProperties = {
  padding: '40px 18px',
  textAlign: 'center',
  fontSize: '13px',
  color: 'var(--text-2)',
};

export const DashboardSection: React.FC = () => {
  const router = useRouter();
  const [summary, setSummary] = useState<IDashboardSummary | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<IDashboardRecentPurchase[]>([]);
  const [topMerchants, setTopMerchants] = useState<IDashboardTopMerchant[]>([]);
  const [topMembers, setTopMembers] = useState<IDashboardTopMember[]>([]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const responseData = await dashboardAPI.getSummary();
        if (responseData && responseData.result && responseData.result.object) {
          setSummary(responseData.result.object);
        }
      } catch (error) {
        console.error('Failed to load dashboard summary:', error);
      }
    };
    const loadRecentPurchases = async () => {
      try {
        const responseData = await dashboardAPI.getRecentPurchases();
        if (responseData && responseData.result && responseData.result.object) {
          setRecentPurchases(responseData.result.object.rows ?? []);
        }
      } catch (error) {
        console.error('Failed to load dashboard recent purchases:', error);
      }
    };
    const loadTopMerchants = async () => {
      try {
        const responseData = await dashboardAPI.getTopMerchants();
        if (responseData && responseData.result && responseData.result.object) {
          setTopMerchants(responseData.result.object.rows ?? []);
        }
      } catch (error) {
        console.error('Failed to load dashboard top merchants:', error);
      }
    };
    const loadTopMembers = async () => {
      try {
        const responseData = await dashboardAPI.getTopMembers();
        if (responseData && responseData.result && responseData.result.object) {
          setTopMembers(responseData.result.object.rows ?? []);
        }
      } catch (error) {
        console.error('Failed to load dashboard top members:', error);
      }
    };
    loadSummary();
    loadRecentPurchases();
    loadTopMerchants();
    loadTopMembers();
  }, []);

  const formatCount = (value?: number) => (value ?? 0).toLocaleString('ko-KR');
  const formatWon = (value?: number) => `${formatCount(value)}원`;

  // 티켓은 등급마다 가치가 달라 합계만으로는 읽을 수 없다 — 등급별 수를 함께 적는다
  const breakdown = summary?.issued_ticket_breakdown;
  const issuedBreakdown = breakdown
    ? [
        ['브론즈', breakdown.BRONZE],
        ['실버', breakdown.SILVER],
        ['골드', breakdown.GOLD],
        ['이벤트', breakdown.EVENT],
      ]
        .filter(([, n]) => n !== undefined)
        .map(([name, n]) => `${name} ${formatCount(n as number)}`)
        .join(' · ')
    : null;

  // 기프티콘은 회원이 보유 포인트로 교환하는 구조라 매출이 아니다 — 매출 카드에서 뺀다(QA #1)
  const statsRow1 = [
    { label: '이번달 순수익', value: formatWon(summary?.profit_amount), color: 'green' as const },
    {
      label: '제휴 수수료 매출',
      value: formatWon(summary?.affiliate_commission_amount),
      color: 'purple' as const,
    },
    {
      label: '티켓 적립 비용',
      value: formatWon(summary?.ticket_accrual_cost_amount),
      change: { type: 'neutral' as const, text: '차감 항목' },
      color: 'amber' as const,
    },
  ];

  const statsRow2 = [
    { label: '전체 회원', value: formatCount(summary?.member_count), color: 'purple' as const },
    {
      label: '발행 티켓 (누적 적립)',
      value: formatCount(summary?.issued_ticket_count),
      change: issuedBreakdown ? { type: 'neutral' as const, text: issuedBreakdown } : undefined,
      color: 'green' as const,
    },
    {
      label: '미처리 문의',
      value: formatCount(summary?.qna_pending_count),
      color: 'amber' as const,
    },
    { label: '미처리 추첨', value: '-', color: 'red' as const },
  ];

  const statsRow3 = [
    { label: 'DAU', value: '-' },
    { label: '클릭 → 구매 전환율', value: '-' },
    { label: '이탈율 (7일)', value: '-' },
    { label: '이번달 신규 가입', value: formatCount(summary?.new_member_this_month_count) },
  ];

  const handleViewLogs = () => {
    router.push('/postback');
  };

  return (
    <div className="section active">
      {/* Hàng 1: 4 stat cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {statsRow1.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Hàng 2 */}
      <div className="stats-grid">
        {statsRow2.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Hàng 3 */}
      <div className="stats-grid">
        {statsRow3.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Biểu đồ + Scheduler */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">일별 신규 회원 (최근 7일)</div>
          </div>
          <div style={emptyStateStyle}>
            운영 누적 데이터 없음 (시계열 집계는 실서비스 운영 후 표시)
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">스케줄러 현황</div>
          </div>
          <div style={emptyStateStyle}>실행 이력 없음 (배치 스케줄러 미가동)</div>
        </div>
      </div>

      {/* Bảng hoạt động gần đây */}
      <RecentActivityTable data={recentPurchases} onViewLogs={handleViewLogs} />

      {/* Hai bảng cột */}
      <div className="card-grid">
        <TopAffiliatesTable data={topMerchants} />
        <TopTicketUsersTable data={topMembers} />
      </div>
    </div>
  );
};
