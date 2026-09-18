import dayjs from 'dayjs';
import { CONFIG } from 'src/config-global';
import type { TicketGrade } from 'src/types/common';
import type {
  IGifticonProduct,
  IGifticonProductApiDetailRow,
  IGifticonProductApiRow,
  IGifticonProductApiTicketPrice,
  IGifticonTicketPart,
} from 'src/types/gifticon-products/gifticon_product';
import { DEFAULT_TICKET_VALUE } from 'src/utils/ticket-value';
import { calcGreedyBreakdown } from 'src/utils/ticket-accrual';

// ----------------------------------------------------------------------

// 이미지 업로드 API는 "/files/upload/images/..."처럼 호스트 없는 경로만 돌려준다 —
// API 서버(NEXT_PUBLIC_SERVER_URL, "…/api"로 끝남)와 같은 호스트에서 파일을 내려준다고 보고
// "/api" 접미사만 떼어 붙인다. 이미 절대 URL(예: CDN 주소)이면 그대로 둔다.
export const resolveGifticonImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path)) return path;
  const base = CONFIG.serverUrl.replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

// 상품판매종료일 입력이 없는(무기한) 상품에 쓰는 자리 표시 날짜 — 실제 값을 만들지 않는다.
export const GIFTICON_PRODUCT_NO_END_DATE = '2999-12-30';

// 유효기간(일) 표기 — 말이 되는 값(5년 이내)일 때만 보여준다. 근거 없는 값을 지어내지 않는다.
export const formatGifticonValidityDays = (days: number | null): string => {
  if (days == null || days <= 0 || days > 1825) return '—';
  return `${days}일`;
};

export const formatGifticonSaleEndDate = (isoDate: string | null): string => {
  if (!isoDate) return '—';
  const d = dayjs(isoDate);
  return d.isValid() ? d.format('YYYY/MM/DD') : '—';
};

// 상품명에 브랜드가 이미 들어 있으면 또 붙이지 않는다 — "GS25 GS25 3,000원 금액권"처럼
// 겹치는 걸 막는다. 구매내역 등 상품명을 요약해 보여주는 화면에서 공용으로 쓴다.
export const formatBrandedProductName = (brand: string, name: string): string => {
  const b = brand.trim();
  const n = name.trim();
  if (!b) return n;
  if (!n) return b;
  if (n.includes(b)) return n;
  const head = b.split(/[[(]/)[0].trim();
  if (head && n.includes(head)) return n;
  return `${b} ${n}`;
};

// 판매가격(원)을 등급 티켓 조합으로 환산 — 큰 등급(골드)부터 채우는 규칙은 티켓 적립 설정과
// 같다(calcGreedyBreakdown). 값이 없거나 0 이하면 빈 배열을 돌려준다.
export const getGifticonTicketBreakdown = (price: number | null): IGifticonTicketPart[] => {
  if (!price || price <= 0) return [];
  const { gold, silver, bronze } = calcGreedyBreakdown(price, DEFAULT_TICKET_VALUE);
  const parts: IGifticonTicketPart[] = [];
  if (gold > 0) parts.push({ grade: 'GOLD', quantity: gold });
  if (silver > 0) parts.push({ grade: 'SILVER', quantity: silver });
  if (bronze > 0) parts.push({ grade: 'BRONZE', quantity: bronze });
  return parts;
};

// 등급 티켓 조각을 "골드 10 + 실버 2"처럼 한 줄 텍스트로 합친다 — 상품 목록 판매가격 칸은
// 칩(TicketChip)이 아니라 이 굵은 글씨 한 줄 + 아래 회색 원화 병기로 보여준다(포인츠허브 그대로).
const GIFTICON_TICKET_GRADE_KO: Record<'GOLD' | 'SILVER' | 'BRONZE', string> = {
  GOLD: '골드',
  SILVER: '실버',
  BRONZE: '브론즈',
};

export const formatGifticonTicketPartText = (part: IGifticonTicketPart): string =>
  `${GIFTICON_TICKET_GRADE_KO[part.grade as 'GOLD' | 'SILVER' | 'BRONZE'] ?? part.grade} ${part.quantity}`;

export const formatGifticonTicketComboText = (parts: IGifticonTicketPart[]): string =>
  parts.map(formatGifticonTicketPartText).join(' + ');

// GET /gift/admin/products가 내려주는 ticket_price({GOLD,SILVER,BRONZE})를
// 화면 공용 형식(IGifticonTicketPart[])으로 바꾼다. 등급별 실제 환산 비율은 서버(티켓
// 가치 설정)가 정하므로 여기서 다시 계산하지 않고 받은 수량을 그대로 쓴다.
const TICKET_GRADE_ORDER: Array<Extract<TicketGrade, 'GOLD' | 'SILVER' | 'BRONZE'>> = [
  'GOLD',
  'SILVER',
  'BRONZE',
];

const apiTicketPriceToParts = (
  ticketPrice: IGifticonProductApiTicketPrice | null | undefined
): IGifticonTicketPart[] =>
  TICKET_GRADE_ORDER.map((grade) => ({ grade, quantity: ticketPrice?.[grade] ?? 0 })).filter(
    (p) => p.quantity > 0
  );

export const mapGifticonProductFromApi = (row: IGifticonProductApiRow): IGifticonProduct => ({
  id: row.id,
  category: row.category_name,
  brand: row.brand_name,
  name: row.product_name,
  code: row.product_code,
  saleEndDate: row.valid_end,
  validityDays: null,
  price: row.price_won,
  ticketParts: apiTicketPriceToParts(row.ticket_price),
  imageUrl: row.image_url || null,
  notice: null,
  status: row.is_active ? 'ACTIVE' : 'INACTIVE',
});

// GET /gift/admin/products/:id는 목록 행 필드에 description(기프팅 쿠폰 유의사항)과
// provider_valid_days(유효기간, 일)가 더 붙어 온다 — 목록 매핑 결과에 그 두 필드만 얹는다.
export const mapGifticonProductDetailFromApi = (
  row: IGifticonProductApiDetailRow
): IGifticonProduct => ({
  ...mapGifticonProductFromApi(row),
  notice: row.description || null,
  validityDays: row.provider_valid_days ?? null,
});

// ----------------------------------------------------------------------
// 목데이터 — 백엔드 API 연동 전까지 화면 확인용. 상품명·가격은 운영 정책서(op-policy)의
// 기프티콘 교환 카탈로그 예시를 그대로 가져왔다(브론즈 12장→CU 1,100원 등과 같은 실제 값).
// ----------------------------------------------------------------------

export const MOCK_GIFTICON_PRODUCTS: IGifticonProduct[] = [
  {
    id: '20',
    category: '커피/음료',
    brand: '이디야커피',
    name: '이디야 아메리카노',
    code: 'EDIYA-AMR-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 3200,
    imageUrl: null,
    notice: '매장 내 사용 시 제조 옵션 변경이 어려울 수 있습니다.',
    status: 'ACTIVE',
  },
  {
    id: '19',
    category: '커피/음료',
    brand: '컴포즈커피',
    name: '컴포즈 아메리카노',
    code: 'COMPOSE-AMR-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 2000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '18',
    category: '커피/음료',
    brand: '빽다방',
    name: '빽다방 아메리카노',
    code: 'PAIKS-AMR-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 1500,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '17',
    category: '커피/음료',
    brand: '스타벅스',
    name: '스타벅스 아메리카노 T',
    code: 'SBUX-AMR-T-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 60,
    price: 4500,
    imageUrl: null,
    notice: '일부 리저브 매장에서는 사용이 제한될 수 있습니다.',
    status: 'ACTIVE',
  },
  {
    id: '16',
    category: '커피/음료',
    brand: '스타벅스',
    name: '스타벅스 카페라떼 T',
    code: 'SBUX-LTE-T-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 60,
    price: 5800,
    imageUrl: null,
    notice: '일부 리저브 매장에서는 사용이 제한될 수 있습니다.',
    status: 'ACTIVE',
  },
  {
    id: '15',
    category: '커피/음료',
    brand: '배스킨라빈스',
    name: '배스킨라빈스 파인트',
    code: 'BR-PINT-001',
    saleEndDate: '2026-12-31',
    validityDays: 90,
    price: 8500,
    imageUrl: null,
    notice: '맛 선택은 구매 후 매장에서 지정합니다.',
    status: 'ACTIVE',
  },
  {
    id: '14',
    category: '편의점',
    brand: 'CU',
    name: 'CU 음료 1.5L',
    code: 'CU-BEV-15L-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 1100,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '13',
    category: '편의점',
    brand: 'GS25',
    name: 'GS25 3,000원 금액권',
    code: 'GS25-3000-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 3000,
    imageUrl: null,
    notice: '금액권은 잔액 환불이 되지 않습니다.',
    status: 'ACTIVE',
  },
  {
    id: '12',
    category: '편의점',
    brand: '세븐일레븐',
    name: '세븐일레븐 5,000원 금액권',
    code: '7EL-5000-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 5000,
    imageUrl: null,
    notice: '금액권은 잔액 환불이 되지 않습니다.',
    status: 'INACTIVE',
  },
  {
    id: '11',
    category: '외식',
    brand: 'BHC',
    name: 'BHC 뿌링클',
    code: 'BHC-PRC-001',
    saleEndDate: '2026-12-31',
    validityDays: 60,
    price: 19000,
    imageUrl: null,
    notice: '단품 기준이며 세트 메뉴로는 교환할 수 없습니다.',
    status: 'ACTIVE',
  },
  {
    id: '10',
    category: '문화/생활',
    brand: 'CGV',
    name: 'CGV 영화관람권',
    code: 'CGV-TICKET-001',
    saleEndDate: '2026-12-31',
    validityDays: 90,
    price: 14000,
    imageUrl: null,
    notice: '특별관(IMAX 등)에는 추가 요금이 발생할 수 있습니다.',
    status: 'ACTIVE',
  },
  {
    id: '9',
    category: '문화/생활',
    brand: '투썸플레이스',
    name: '[투썸플레이스] 5천원권',
    code: '72429',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 5000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '8',
    category: '문화/생활',
    brand: '투썸플레이스',
    name: '[투썸플레이스] 1만원권',
    code: '72436',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 10000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '7',
    category: '문화/생활',
    brand: '투썸플레이스',
    name: '[투썸플레이스] 3만원권',
    code: '72441',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 30,
    price: 30000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '6',
    category: '문화/생활',
    brand: '북앤라이프',
    name: '도서문화상품권 5만원권',
    code: '75264',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 365,
    price: 50000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '5',
    category: '문화/생활',
    brand: '북앤라이프',
    name: '도서문화상품권 3만원권',
    code: '75260',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 365,
    price: 30000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '4',
    category: '문화/생활',
    brand: '북앤라이프',
    name: '도서문화상품권 1만원권',
    code: '75252',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 365,
    price: 10000,
    imageUrl: null,
    notice: null,
    status: 'INACTIVE',
  },
  {
    id: '3',
    category: '쇼핑',
    brand: '네이버',
    name: '네이버페이 포인트 5만원',
    code: 'NPAY-50000-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 90,
    price: 50000,
    imageUrl: null,
    notice: '네이버페이 포인트로 즉시 전환되며 재판매할 수 없습니다.',
    status: 'ACTIVE',
  },
  {
    id: '2',
    category: '쇼핑',
    brand: 'SSG닷컴',
    name: '[SSG상품권] 2만원권',
    code: 'SSG-20000-001',
    saleEndDate: GIFTICON_PRODUCT_NO_END_DATE,
    validityDays: 365,
    price: 20000,
    imageUrl: null,
    notice: null,
    status: 'ACTIVE',
  },
  {
    id: '1',
    category: '쇼핑',
    brand: '구글',
    name: '구글기프트카드 5천원 교환권',
    code: 'GOOGLE-5000-001',
    saleEndDate: null,
    validityDays: null,
    price: null,
    imageUrl: null,
    notice: null,
    status: 'INACTIVE',
  },
];
