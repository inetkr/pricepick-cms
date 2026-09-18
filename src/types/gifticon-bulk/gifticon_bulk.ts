// ----------------------------------------------------------------------

export type IGifticonBulkRowStatus = 'PENDING' | 'DONE' | 'ERROR';

export type IGifticonBulkGrade = 'bronze' | 'silver' | 'gold';

// 파일(CSV·JSON) 한 줄을 정규화한 결과 — 미리보기 표 한 행에 대응한다.
export interface IGifticonBulkRow {
  code: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  validityDays: number | null;
  saleEndDate: string;
  imageUrl: string;
  description: string;
  active: boolean;
  // CSV에서만 선택적으로 줄 수 있는 값 — 없으면 판매가격으로 등급 티켓을 환산한다.
  grade: IGifticonBulkGrade | null;
  count: number | null;
  status: IGifticonBulkRowStatus;
}

export interface IGifticonBulkHistoryEntry {
  id: string;
  fileName: string;
  createdAt: string;
  total: number;
  ok: number;
  fail: number;
}
