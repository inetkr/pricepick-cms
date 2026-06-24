'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StatCard } from 'src/components/common/stat-card';
import { ChartBar } from 'src/components/dashboard/chart-card';
import { SchedulerItem } from 'src/components/dashboard/scheduler-item';
import { RecentActivityTable } from 'src/components/dashboard/recent-activity-table';
import { TopAffiliatesTable } from 'src/components/dashboard/top-affliate-table';
import { TopTicketUsersTable } from 'src/components/dashboard/top-ticket-users-table';

// Mock data (thay bằng API sau)
const statsRow1 = [
  {
    label: '이번달 순수익',
    value: '3.0M',
    change: { type: 'up' as const, text: '↑ 전월 +21%' },
    color: 'green' as const,
  },
  {
    label: '제휴 수수료 매출',
    value: '4.2M',
    change: { type: 'up' as const, text: '↑ 전월 +18%' },
    color: 'purple' as const,
  },
  {
    label: '기프티콘 판매 수익',
    value: '0.2M',
    change: { type: 'up' as const, text: '↑ 전월 +12%' },
    color: 'info' as any,
  },
  {
    label: '티켓 적립 비용',
    value: '1.4M',
    change: { type: 'neutral' as const, text: '차감 항목' },
    color: 'amber' as const,
  },
];

const statsRow2 = [
  {
    label: '전체 회원',
    value: '12,847',
    change: { type: 'up' as const, text: '↑ 오늘 +234명' },
    color: 'purple' as const,
  },
  {
    label: '오늘 발행 티켓',
    value: '3,421',
    change: { type: 'up' as const, text: '↑ 12.4%' },
    color: 'green' as const,
  },
  {
    label: '미처리 문의',
    value: '7',
    change: { type: 'down' as const, text: '빠른 처리 필요' },
    color: 'amber' as const,
  },
  {
    label: '미처리 추첨',
    value: '1',
    change: { type: 'down' as const, text: '마감 D-1' },
    color: 'red' as const,
  },
];

const statsRow3 = [
  { label: 'DAU', value: '2,841', change: { type: 'up' as const, text: '↑ 어제 +142' } },
  { label: '클릭 → 구매 전환율', value: '3.8%', change: { type: 'up' as const, text: '↑ 0.4%p' } },
  { label: '이탈율 (7일)', value: '12.3%', change: { type: 'down' as const, text: '↑ 1.2%p' } },
  {
    label: '이번달 신규 가입',
    value: '1,284',
    change: { type: 'up' as const, text: '↑ 전월 +9%' },
  },
];

const chartData = [
  { label: '5/5', value: 98 },
  { label: '5/6', value: 142 },
  { label: '5/7', value: 118 },
  { label: '5/8', value: 196 },
  { label: '5/9', value: 163 },
  { label: '5/10', value: 201 },
  { label: '오늘', value: 234, isToday: true },
];

const schedulerData = [
  {
    name: '포스트백 수신 처리',
    description: '실시간',
    lastRun: '방금 전',
    nextStatus: '정상',
    status: 'running' as const,
  },
  {
    name: '티켓 확정 처리 (연동 D+7 / 미연동 D+30)',
    description: '매일 자정',
    lastRun: '어제 00:00',
    nextStatus: '정상',
    status: 'running' as const,
  },
  {
    name: '알림 발송',
    description: '매 5분',
    lastRun: '2분 전',
    nextStatus: '정상',
    status: 'running' as const,
  },
  {
    name: '주간 추첨 티켓 집계',
    description: '매주 월요일 자정',
    lastRun: '지난 월요일',
    nextStatus: '정상',
    status: 'running' as const,
  },
  {
    name: 'DB 백업',
    description: '매일 새벽 3시',
    lastRun: '2일 전',
    nextStatus: '오류',
    status: 'stopped' as const,
  },
];

const recentPurchases = [
  {
    mall: '쿠팡',
    nickname: 'rain***',
    amount: '128,000원',
    tickets: '+12장',
    datetime: '2026/05/28<br>13:42:17',
  },
  {
    mall: '쿠팡',
    nickname: 'sky***',
    amount: '54,900원',
    tickets: '+5장',
    datetime: '2026/05/28<br>11:05:33',
  },
  {
    mall: '쿠팡',
    nickname: 'han***',
    amount: '319,000원',
    tickets: '+31장',
    datetime: '2026/05/28<br>09:18:44',
  },
];

const topAffiliates = [
  { rank: 1, name: '쿠팡', clicks: 48210, conversions: 3842 },
  { rank: 2, name: '11번가', clicks: 12040, conversions: 684 },
  { rank: 3, name: 'G마켓', clicks: 9820, conversions: 512 },
  { rank: 4, name: '알리익스프레스', clicks: 7310, conversions: 421 },
  { rank: 5, name: '아이허브', clicks: 4120, conversions: 288 },
];

const topTicketUsers = [
  { rank: 1, nickname: '쇼핑왕민준', id: 'minjun_kakao', monthly: 42, total: 318 },
  { rank: 2, nickname: '가격헌터서연', id: 'seoyeon_kko', monthly: 37, total: 264 },
  { rank: 3, nickname: '알뜰살뜰지호', id: 'jiho_kakao', monthly: 31, total: 205 },
];

export const DashboardSection: React.FC = () => {
  const router = useRouter();

  const handleViewLogs = () => {
    router.push('/postback');
  };

  return (
    <div className="section active">
      {/* Hàng 1: 4 stat cards */}
      <div className="stats-grid">
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
          <div style={{ padding: '16px 18px' }}>
            <ChartBar data={chartData} maxHeight={100} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">스케줄러 현황</div>
          </div>
          <div>
            {schedulerData.map((item, idx) => (
              <SchedulerItem key={idx} {...item} showActions={false} />
            ))}
          </div>
        </div>
      </div>

      {/* Bảng hoạt động gần đây */}
      <RecentActivityTable data={recentPurchases} onViewLogs={handleViewLogs} />

      {/* Hai bảng cột */}
      <div className="card-grid">
        <TopAffiliatesTable data={topAffiliates} />
        <TopTicketUsersTable data={topTicketUsers} />
      </div>
    </div>
  );
};
