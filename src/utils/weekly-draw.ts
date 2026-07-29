import type { IDrawRound } from 'src/types/weekly-draws/weekly-draw';

export const formatDrawRoundLabel = (round: Pick<IDrawRound, 'label_year' | 'label_month' | 'week_of_month'>) =>
  `${round.label_year}년 ${round.label_month}월 ${round.week_of_month}주차`;
