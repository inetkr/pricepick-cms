import type { IDraw, IDrawStatus } from 'src/types/draws/draw';

const toDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// 상태를 필드로 저장하지 않고 시작일/마감일/당첨 확정 여부에서 매번 계산한다.
// 날짜가 지나도 상태 값을 갱신하는 배치가 없어도 항상 정확하고, 값이 어긋날 일이 없다.
export const getDrawStatus = (draw: IDraw): IDrawStatus => {
  if (draw.winners) return 'COMPLETED';
  const today = toDateStr(new Date());
  if (today < draw.start_date) return 'SCHEDULED';
  if (today <= draw.end_date) return 'ACTIVE';
  return 'CLOSED';
};

export const getDaysRemaining = (endDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.ceil((end.getTime() - today.getTime()) / 86400000);
};

export const formatDrawPeriod = (draw: IDraw): string => `${draw.start_date} ~ ${draw.end_date}`;

export const formatDateTime = (value: string | null): string => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${day} ${hh}:${mm}`;
};
