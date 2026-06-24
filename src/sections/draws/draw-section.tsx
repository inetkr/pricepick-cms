'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DrawItem, DrawTable } from 'src/components/draws/draw.table';
import { DrawForm } from 'src/components/draws/draw-form';

// Mock data
const mockDraws: DrawItem[] = [
  {
    id: 1,
    round: '12회',
    prizes: [
      { rank: '🥇', name: '에어팟 프로 2세대', count: 1 },
      { rank: '🥈', name: '스타벅스 5만원권', count: 3 },
      { rank: '🥉', name: '편의점 상품권 1만원', count: 5 },
    ],
    period: '05/05 ~ 05/12',
    deadline: '05/12 (D-1)',
    ticketCount: 18240,
    winners: [
      { rank: '1등', count: 1 },
      { rank: '2등', count: 3 },
      { rank: '3등', count: 5 },
    ],
    status: '진행 중',
  },
  {
    id: 2,
    round: '11회',
    prizes: [
      { rank: '🥇', name: '스타벅스 5만원권', count: 1 },
      { rank: '🥈', name: '배스킨라빈스 아이스크림 교환권', count: 3 },
    ],
    period: '04/28 ~ 05/05',
    deadline: '05/05',
    ticketCount: 14820,
    winners: [
      { rank: '1등', count: 1 },
      { rank: '2등', count: 3 },
    ],
    status: '완료',
  },
  {
    id: 3,
    round: '10회',
    prizes: [
      { rank: '🥇', name: '삼성 갤럭시 버즈', count: 1 },
      { rank: '🥈', name: '투썸 케이크 교환권', count: 5 },
    ],
    period: '04/21 ~ 04/28',
    deadline: '04/28',
    ticketCount: 12340,
    winners: [
      { rank: '1등', count: 1 },
      { rank: '2등', count: 5 },
    ],
    status: '완료',
  },
];

export const DrawsSection: React.FC = () => {
  const router = useRouter();
  const [draws, setDraws] = useState<DrawItem[]>(mockDraws);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const handleDraw = (id: string | number) => {
    // Mở modal xử lý 당첨
    // toast(`당첨 처리 모달 열기 - 회차 ${id}`);
  };

  const handleViewResult = (id: string | number) => {
    // toast(`결과 보기 - 회차 ${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetch data for page
    // toast(`페이지 ${page} 로드`);
  };

  const handleCreateDraw = (data: any) => {
    // Tạo mới đợt rút thăm
    const newDraw: DrawItem = {
      id: draws.length + 1,
      round: data.roundName || `${draws.length + 1}회`,
      prizes: data.prizes.map((p: any) => ({
        rank: p.rank,
        name: p.name,
        count: p.winnerCount,
      })),
      period: `${data.startDate} ~ ${data.endDate}`,
      deadline: data.endDate,
      ticketCount: 0,
      winners: data.prizes.map((p: any) => ({
        rank: p.rank,
        count: p.winnerCount,
      })),
      status: '예정',
    };
    setDraws([newDraw, ...draws]);
    setShowForm(false);
    // toast('새 추첨 회차가 등록되었습니다.');
  };

  return (
    <div className="section active">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">추첨 회차 목록</div>
            <div className="card-sub">매주 월요일 당첨자 발표</div>
          </div>
          <div id="draw-hdr-actions" />
        </div>
        <DrawTable
          data={draws}
          onDraw={handleDraw}
          onViewResult={handleViewResult}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={Math.ceil(draws.length / 10)}
          totalItems={draws.length}
        />
      </div>

      {!showForm ? (
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
            + 새 회차 등록
          </button>
        </div>
      ) : (
        <DrawForm onSubmit={handleCreateDraw} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
};
