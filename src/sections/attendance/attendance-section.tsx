'use client';

import React, { useState } from 'react';
import { AttendanceEditModal } from 'src/components/attendance/attendance-edit-modal';
import type {
  AttendanceResultItem} from 'src/components/attendance/attendance-result-table';
import {
  AttendanceResultTable,
} from 'src/components/attendance/attendance-result-table';
import { AttendanceSettingCard } from 'src/components/attendance/attendance-setting-card';
import { AttendanceStats } from 'src/components/attendance/attendance-stats';

// Mock data
const mockResultData: AttendanceResultItem[] = [
  {
    rank: '🥇',
    nickname: '쇼핑왕민준',
    id: 'minjun_kko',
    thisWeek: '당첨',
    total: 18,
    ticketsUsed: 3,
  },
  {
    rank: '🥈',
    nickname: '가격헌터서연',
    id: 'seoyeon_kko',
    thisWeek: '당첨',
    total: 15,
    ticketsUsed: 1,
  },
  {
    rank: '🥉',
    nickname: '절약마스터',
    id: 'saving_master',
    thisWeek: '미당첨',
    total: 12,
    ticketsUsed: 0,
  },
];

const settingPolicies = [
  {
    label: '응모 대상',
    value: '이벤트 티켓 보유 회원 (자동 응모)',
    description: '보유 이벤트 티켓으로 매 회차 자동 응모. 티켓이 없으면 응모 제외.',
  },
  {
    label: '추첨 일정',
    value: '매주 월요일 00:00 자동 추첨',
    description: '추첨 주기는 운영 정책에 따름(월1/격주 미정).',
  },
  {
    label: '당첨 확률',
    value: '50% (조정 가능)',
    description: '응모자 중 50% 확률로 당첨 처리.',
  },
  {
    label: '당첨 보상',
    value: '경품(기프티콘·실물 등)',
    description: '당첨 시 경품 지급. 이벤트 티켓을 새로 발급하지 않음(소비처).',
  },
  {
    label: '이벤트 티켓 만료',
    value: '경품응모 추첨 기준 이월',
    description:
      '30일 고정 만료 폐지 — 당회 추첨 미응모 시 차회로 1회 이월, 차회도 미응모 시 소멸(최대 2회 추첨 유효).',
  },
];

export const AttendanceSection: React.FC = () => {
  const [resultData] = useState<AttendanceResultItem[]>(mockResultData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleSaveSettings = (data: any) => {
    console.log('Save settings:', data);
    // TODO: call API to save
    // Sau khi lưu, có thể refresh data hoặc show toast
  };

  const handleRowClick = (item: AttendanceResultItem) => {
    // TODO: Show member detail
    console.log('Row clicked:', item);
  };

  return (
    <div className="section active">
      <div className="info-box">
        <strong>주간 이벤트 추첨 = 이벤트 티켓 소비처(자동 응모)</strong> — 보유한 이벤트 티켓으로
        자동 응모되며, 당첨 시 <strong>경품(기프티콘·실물 등)</strong>을 지급합니다. 추첨이 이벤트
        티켓을 새로 발급하지 않습니다. (이벤트 티켓 획득 경로는 출석 5일·행운룰렛·온보딩 가입 3종
        그대로)
      </div>

      <div className="info-box">
        <strong>주간 이벤트 추첨</strong> — 매주 월요일, 보유 이벤트 티켓으로 자동 응모된 회원 중
        추첨하여 당첨자에게 경품(기프티콘·실물 등)을 지급합니다. 이벤트 티켓은 이 추첨의{' '}
        <strong>응모 수단(소비)</strong>이며, 추첨이 이벤트 티켓을 발급하지 않습니다.
      </div>

      {/* Stats */}
      <AttendanceStats
        totalParticipants="12,841"
        winners="6,184"
        winRate="48.2%"
        ticketsUsed="3,421"
      />

      {/* Two columns: Settings + Results */}
      <div className="card-grid">
        <AttendanceSettingCard
          title="추첨 설정"
          policies={settingPolicies}
          onEdit={handleOpenEditModal}
        />
        <AttendanceResultTable data={resultData} onRowClick={handleRowClick} />
      </div>

      <AttendanceEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveSettings}
        initialData={{
          probability: 50,
          firstPrize: 1,
          secondPrize: 3,
          thirdPrize: 5,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          description: '주간 이벤트 추첨',
        }}
      />
    </div>
  );
};
