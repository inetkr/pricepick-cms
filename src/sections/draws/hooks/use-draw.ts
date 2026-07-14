import { useMemo, useState } from 'react';
import type { IDraw, IDrawMode, IDrawPrize } from 'src/types/draws/draw';
import { getDrawStatus } from '../utils';

const todayStr = () => new Date().toISOString().slice(0, 10);
const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const INITIAL_DRAWS: IDraw[] = [
  {
    id: 'draw-12',
    round_name: '12회차',
    prizes: [
      { rank: '1등', name: '에어팟 프로 2세대', winner_count: 1 },
      { rank: '2등', name: '스타벅스 5만원권', winner_count: 3 },
      { rank: '3등', name: '편의점 상품권 1만원', winner_count: 5 },
    ],
    start_date: addDays(-5),
    end_date: addDays(-1),
    ticket_count: 18240,
    winners: null,
    draw_mode: null,
    announce_at: null,
    notify_winners: true,
    drawn_at: null,
    created_at: addDays(-5),
  },
  {
    id: 'draw-11',
    round_name: '11회차',
    prizes: [
      { rank: '1등', name: '스타벅스 5만원권', winner_count: 1 },
      { rank: '2등', name: '배스킨라빈스 아이스크림 교환권', winner_count: 3 },
    ],
    start_date: addDays(-12),
    end_date: addDays(-5),
    ticket_count: 14820,
    winners: [
      { rank: '1등', name: '스타벅스 5만원권', winner_count: 1 },
      { rank: '2등', name: '배스킨라빈스 아이스크림 교환권', winner_count: 3 },
    ],
    draw_mode: 'RANDOM',
    announce_at: `${addDays(-5)}T10:00`,
    notify_winners: true,
    drawn_at: addDays(-5),
    created_at: addDays(-12),
  },
  {
    id: 'draw-10',
    round_name: '10회차',
    prizes: [
      { rank: '1등', name: '삼성 갤럭시 버즈', winner_count: 1 },
      { rank: '2등', name: '투썸 케이크 교환권', winner_count: 5 },
    ],
    start_date: addDays(-19),
    end_date: addDays(-12),
    ticket_count: 12340,
    winners: [
      { rank: '1등', name: '삼성 갤럭시 버즈', winner_count: 1 },
      { rank: '2등', name: '투썸 케이크 교환권', winner_count: 5 },
    ],
    draw_mode: 'RANDOM',
    announce_at: `${addDays(-12)}T10:00`,
    notify_winners: true,
    drawn_at: addDays(-12),
    created_at: addDays(-19),
  },
  {
    id: 'draw-13',
    round_name: '13회차',
    prizes: [
      { rank: '1등', name: '삼성 갤럭시 워치', winner_count: 1 },
      { rank: '2등', name: '스타벅스 3만원권', winner_count: 5 },
    ],
    start_date: todayStr(),
    end_date: addDays(6),
    ticket_count: 0,
    winners: null,
    draw_mode: null,
    announce_at: null,
    notify_winners: true,
    drawn_at: null,
    created_at: todayStr(),
  },
];

export type CreateDrawInput = {
  round_name: string;
  start_date: string;
  end_date: string;
  prizes: IDrawPrize[];
};

export type ProcessDrawInput = {
  winners: IDrawPrize[];
  draw_mode: IDrawMode;
  announce_at: string;
  notify_winners: boolean;
};

export const useDraws = () => {
  const [draws, setDraws] = useState<IDraw[]>(INITIAL_DRAWS);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const totalItems = draws.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const pagedDraws = useMemo(
    () => draws.slice((page - 1) * limit, page * limit),
    [draws, page, limit]
  );

  const pendingCount = useMemo(
    () => draws.filter((draw) => getDrawStatus(draw) === 'CLOSED').length,
    [draws]
  );

  const handleSetPage = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  const createDraw = (input: CreateDrawInput) => {
    const newDraw: IDraw = {
      id: `draw-${Date.now()}`,
      round_name: input.round_name,
      prizes: input.prizes,
      start_date: input.start_date,
      end_date: input.end_date,
      ticket_count: 0,
      winners: null,
      draw_mode: null,
      announce_at: null,
      notify_winners: true,
      drawn_at: null,
      created_at: todayStr(),
    };
    setDraws((prev) => [newDraw, ...prev]);
    setPage(1);
  };

  const processDraw = (id: string, input: ProcessDrawInput) => {
    setDraws((prev) =>
      prev.map((draw) =>
        draw.id === id
          ? {
              ...draw,
              winners: input.winners,
              draw_mode: input.draw_mode,
              announce_at: input.announce_at,
              notify_winners: input.notify_winners,
              drawn_at: todayStr(),
            }
          : draw
      )
    );
  };

  return {
    draws: pagedDraws,
    totalItems,
    totalPages,
    page,
    setPage: handleSetPage,
    pendingCount,
    createDraw,
    processDraw,
  };
};
