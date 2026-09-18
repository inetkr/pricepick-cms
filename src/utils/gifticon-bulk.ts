import type {
  IGifticonBulkGrade,
  IGifticonBulkHistoryEntry,
  IGifticonBulkRow,
} from 'src/types/gifticon-bulk/gifticon_bulk';

// ----------------------------------------------------------------------

const GIFTICON_BULK_GRADE_MAP: Record<string, IGifticonBulkGrade> = {
  브론즈: 'bronze',
  실버: 'silver',
  골드: 'gold',
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
};

// 따옴표로 감싼 칸을 포함한 CSV 한 줄씩 파싱 — 첫 줄을 머리글로 삼아 {머리글: 값} 객체 배열로 돌려준다.
const parseCsvText = (text: string): Record<string, string>[] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];

  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => {
      const obj: Record<string, string> = {};
      header.forEach((h, i) => {
        obj[h] = (r[i] || '').trim();
      });
      return obj;
    });
};

type RawJsonRow = {
  code?: unknown;
  brand?: unknown;
  name?: unknown;
  category?: unknown;
  price?: unknown;
  periodEnd?: unknown;
  image?: unknown;
  description?: unknown;
  isActive?: unknown;
};

const toRowFromJson = (x: RawJsonRow): IGifticonBulkRow => ({
  code: String(x.code ?? '').trim(),
  brand: typeof x.brand === 'string' ? x.brand : '',
  name: typeof x.name === 'string' ? x.name : '',
  category: typeof x.category === 'string' ? x.category : '',
  price: typeof x.price === 'number' ? x.price : parseInt(String(x.price ?? ''), 10) || 0,
  validityDays: null,
  saleEndDate: typeof x.periodEnd === 'string' ? x.periodEnd : '',
  imageUrl: typeof x.image === 'string' ? x.image : '',
  description: typeof x.description === 'string' ? x.description : '',
  active: x.isActive !== false,
  grade: null,
  count: null,
  status: 'PENDING',
});

const toRowFromCsv = (r: Record<string, string>): IGifticonBulkRow => ({
  code: (r['상품코드'] || '').trim(),
  brand: r['브랜드'] || '',
  name: r['상품명'] || '',
  category: r['카테고리'] || '',
  price: parseInt(r['판매가격'], 10) || 0,
  validityDays: parseInt(r['유효일수'], 10) || 90,
  saleEndDate: r['판매종료일'] || '',
  imageUrl: (r['이미지경로'] || '').trim(),
  description: r['설명'] || '',
  active: true,
  grade: GIFTICON_BULK_GRADE_MAP[r['등급']] || null,
  count: parseInt(r['필요장수'], 10) || null,
  status: 'PENDING',
});

export interface IGifticonBulkParseResult {
  rows: IGifticonBulkRow[];
  duplicateCount: number;
}

// 파일 내용(text) → 미리보기 행 배열. JSON([{...}] 또는 {rows:[...]})과 CSV를 모두 받는다.
// 상품코드·상품명이 둘 다 있는 줄만 남기고, 상품코드가 겹치면 먼저 나온 줄만 남긴다.
export const parseGifticonBulkFile = (text: string): IGifticonBulkParseResult => {
  let rows: IGifticonBulkRow[];
  if (/^\s*[[{]/.test(text)) {
    const parsed: unknown = JSON.parse(text);
    const arr: RawJsonRow[] = Array.isArray(parsed)
      ? (parsed as RawJsonRow[])
      : ((parsed as { rows?: RawJsonRow[] })?.rows ?? []);
    rows = arr.map(toRowFromJson);
  } else {
    rows = parseCsvText(text).map(toRowFromCsv);
  }

  rows = rows.filter((r) => r.code && r.name);

  const seen = new Set<string>();
  const uniq: IGifticonBulkRow[] = [];
  rows.forEach((r) => {
    if (!seen.has(r.code)) {
      seen.add(r.code);
      uniq.push(r);
    }
  });

  return { rows: uniq, duplicateCount: rows.length - uniq.length };
};

const TEMPLATE_HEADERS = [
  '상품코드',
  '브랜드',
  '상품명',
  '카테고리',
  '판매가격',
  '유효일수',
  '판매종료일',
  '이미지경로',
  '설명',
  '등급',
  '필요장수',
];
const TEMPLATE_SAMPLE_ROW = [
  'ediya-americano',
  '이디야커피',
  '아메리카노',
  '커피/음료',
  '2000',
  '30',
  '2999-12-30',
  '/app/assets/gifticon/ediya-americano.jpg',
  '[유의사항] 매장 내 사용 시 제조 옵션 변경이 어려울 수 있습니다.',
  '',
  '',
];

const escapeCsvValue = (value: string): string =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

// 일괄 등록용 CSV 서식 — 헤더 + 예시 한 줄. BOM을 붙여 엑셀에서 한글이 깨지지 않게 한다.
export const downloadGifticonBulkTemplate = () => {
  const csv = [TEMPLATE_HEADERS, TEMPLATE_SAMPLE_ROW]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n');
  const blob = new Blob([String.fromCharCode(0xfeff), csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gifticon_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ----------------------------------------------------------------------
// 목데이터 — 히스토리 탭이 빈 화면으로만 보이지 않도록 지난 가져오기 이력 몇 건을 채워 둔다.
// TODO(API 연동): gifticon_bulk_history 컬렉션 조회로 교체.
// ----------------------------------------------------------------------

export const MOCK_GIFTICON_BULK_HISTORY: IGifticonBulkHistoryEntry[] = [
  {
    id: 'bulk-hist-003',
    fileName: 'gifticon_202609_update.csv',
    createdAt: '2026-09-10T11:20:15',
    total: 24,
    ok: 24,
    fail: 0,
  },
  {
    id: 'bulk-hist-002',
    fileName: 'gifticon_notice_bulk.csv',
    createdAt: '2026-08-28T09:05:41',
    total: 18,
    ok: 16,
    fail: 2,
  },
  {
    id: 'bulk-hist-001',
    fileName: 'gifticon_initial_catalog.json',
    createdAt: '2026-08-11T15:47:02',
    total: 110,
    ok: 110,
    fail: 0,
  },
];
