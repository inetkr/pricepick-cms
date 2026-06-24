'use client';

import React, { useState } from 'react';
import { EditPrizeModal } from 'src/components/prizes/modals/edit-prize-modal';
import { SendPrizeData, SendPrizeModal } from 'src/components/prizes/modals/send-prize-modal';
import { PrizeSettingsCard } from 'src/components/prizes/prize-settings-card';
import { PrizeStats } from 'src/components/prizes/prize-stats';
import { UnsentPrizesTable } from 'src/components/prizes/unsent-prizes-table';

// Mock data
const prizeSettings = [
  {
    level: '🥇 1등',
    name: '스타벅스 아메리카노 (Tall)',
    probability: '당첨 확률 5%',
    dailyMax: '10',
  },
  {
    level: '🥈 2등',
    name: '편의점 아이스크림 교환권',
    probability: '당첨 확률 15%',
    dailyMax: '30',
  },
  {
    level: '🥉 3등',
    name: '꽝 (재도전 기회)',
    probability: '당첨 확률 80%',
    dailyMax: '—',
  },
];

const unsentPrizes = [
  {
    nickname: '쇼핑왕민준',
    kakaoId: 'minjun_kko',
    prize: '스타벅스 아메리카노',
    winDate: '2026/05/29',
    winTime: '09:12:00',
  },
];

export const PrizesSection: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{
    nickname: string;
    prize: string;
  } | null>(null);

  const handleEditSave = (data: any) => {
    console.log('Prize settings saved:', data);
    // TODO: Call API to save
  };

  const handleSendPrize = (item: any) => {
    setSelectedRecipient({
      nickname: item.nickname,
      prize: item.prize,
    });
    setSendModalOpen(true);
  };

  const handleSendConfirm = (data: SendPrizeData) => {
    console.log('Send prize:', data);
    // TODO: Call API to send
  };

  return (
    <div className="section active">
      <div className="info-box">
        <strong>정책 확정 반영</strong> — 이벤트 티켓 획득 경로·만료·한도 확정 적용. 경품 추첨
        주기(월1/격주)만 미정.
      </div>

      <div className="info-box">
        🎟 <strong>이벤트 티켓 전용</strong> — 이벤트 티켓 1장 소모 · 1회 추첨 최대 10장 · 추첨 회차
        기준 응모
      </div>

      <PrizeStats
        todayEntries="3,421"
        todayWinners="127"
        eventTicketsUsed="3,421"
        unshippedPrizes="12"
      />

      <div className="card-grid">
        <PrizeSettingsCard prizes={prizeSettings} onEdit={() => setEditModalOpen(true)} />

        <UnsentPrizesTable data={unsentPrizes} onSendPrize={handleSendPrize} />
      </div>

      {/* Modal chỉnh sửa cài đặt */}
      <EditPrizeModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />

      {/* Modal gửi giải thưởng */}
      {selectedRecipient && (
        <SendPrizeModal
          open={sendModalOpen}
          onClose={() => {
            setSendModalOpen(false);
            setSelectedRecipient(null);
          }}
          onSend={handleSendConfirm}
          recipientName={selectedRecipient.nickname}
          prizeName={selectedRecipient.prize}
        />
      )}
    </div>
  );
};
