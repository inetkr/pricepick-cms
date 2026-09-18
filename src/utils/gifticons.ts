import dayjs from 'dayjs';
import type { IMemberIdentitySummary } from 'src/components/common/member-identity-cell';
import type {
  IGifticonExchange,
  IGifticonExchangeTicketPart,
} from 'src/types/gifticons/gifticon_exchange';
import {
  formatBrandedProductName,
  formatGifticonValidityDays,
  getGifticonTicketBreakdown,
  MOCK_GIFTICON_PRODUCTS,
} from 'src/utils/gifticon-products';

// ----------------------------------------------------------------------

export const findGifticonProductByCode = (code: string) =>
  MOCK_GIFTICON_PRODUCTS.find((p) => p.code === code) ?? null;

// 구매 시점에 실제로 빠져나간 등급 티켓 조합 — 지금은 연결된 상품의 판매가격으로
// 계산하지만, 원장 값이라 상품 가격이 나중에 바뀌어도 이 기록 자체는 바뀌지 않는다.
const ticketsUsedFor = (code: string): IGifticonExchangeTicketPart[] =>
  getGifticonTicketBreakdown(findGifticonProductByCode(code)?.price ?? null);

export const getGifticonExchangeProductName = (exchange: IGifticonExchange): string => {
  const product = findGifticonProductByCode(exchange.productCode);
  if (!product) return exchange.productCode;
  return formatBrandedProductName(product.brand, product.name);
};

export const getGifticonExchangeValidityLabel = (exchange: IGifticonExchange): string =>
  formatGifticonValidityDays(findGifticonProductByCode(exchange.productCode)?.validityDays ?? null);

// 구매 시점 판매가격(원) — 사용한 티켓/환불 티켓 조합의 원화 환산을 표시할 때 쓴다.
export const getGifticonExchangeAmount = (exchange: IGifticonExchange): number | null =>
  findGifticonProductByCode(exchange.productCode)?.price ?? null;

// 유효기간 만료일 = 구매일 + 상품 유효기간(일). 상품에 유효기간이 없으면 만료일도 알 수 없다.
export const getGifticonExchangeExpiryDate = (exchange: IGifticonExchange): string | null => {
  const days = findGifticonProductByCode(exchange.productCode)?.validityDays;
  if (!days || days <= 0) return null;
  return dayjs(exchange.exchangedAt).add(days, 'day').toISOString();
};

// 취소 사유 프리셋 — 취소내역 화면의 취소사유 거르개와 같은 값을 쓴다.
export const GIFTICON_CANCEL_REASON_PRESETS = [
  '고객 요청',
  '관리자 취소',
  '회원 요청 취소',
  '상품 재고 소진',
] as const;
export const GIFTICON_CANCEL_REASON_ETC = '기타';
export const GIFTICON_CANCEL_REASON_DEFAULT: string = '관리자 취소';

// 회원의 현재 보유 등급 티켓 — 실제로는 티켓 원장(포스트백 적립분 − 기프티콘 교환 소모분)을
// 집계한 값이다. 티켓 내역 화면을 아직 만들기 전이라 지금은 회원별로 값을 고정해 둔다.
// TODO(API 연동): 티켓 원장 API가 준비되면 회원별 active 등급 티켓 합계로 교체한다.
const MOCK_MEMBER_TICKET_HOLDINGS: Record<string, IGifticonExchangeTicketPart[]> = {
  'user-noh-yh-001': [
    { grade: 'GOLD', quantity: 3 },
    { grade: 'SILVER', quantity: 5 },
    { grade: 'BRONZE', quantity: 12 },
  ],
  'user-mi-ri-002': [
    { grade: 'SILVER', quantity: 2 },
    { grade: 'BRONZE', quantity: 7 },
  ],
  'user-moon-gj-003': [
    { grade: 'GOLD', quantity: 1 },
    { grade: 'BRONZE', quantity: 4 },
  ],
  'user-kang-ss-004': [{ grade: 'BRONZE', quantity: 9 }],
  'user-lee-sy-005': [{ grade: 'SILVER', quantity: 1 }],
  'user-park-jh-006': [
    { grade: 'SILVER', quantity: 3 },
    { grade: 'BRONZE', quantity: 1 },
  ],
};

export const getMemberTicketHoldings = (userId: string): IGifticonExchangeTicketPart[] =>
  MOCK_MEMBER_TICKET_HOLDINGS[userId] ?? [];

// ----------------------------------------------------------------------
// 목데이터 — 백엔드 API 연동 전까지 화면 확인용. 상품은 gifticon-products 목데이터의
// 상품코드로 그대로 이어 붙인다(실제로도 gifticon_exchanges.gifticon_id가 상품 문서의
// 코드/ID를 그대로 가리킨다).
// ----------------------------------------------------------------------

const M = (
  nickname: string,
  linkedKakao: boolean,
  kakaoLoginId: string | null
): IMemberIdentitySummary => ({ nickname, linkedKakao, kakaoLoginId });

const MOCK_MEMBERS: { userId: string; member: IMemberIdentitySummary }[] = [
  { userId: 'user-noh-yh-001', member: M('노윤희', true, 'haessaldurum') },
  { userId: 'user-mi-ri-002', member: M('미리', true, 'himanwi') },
  { userId: 'user-moon-gj-003', member: M('문금주', true, 'bueongbueong') },
  { userId: 'user-kang-ss-004', member: M('강신성', true, 'ddongbal') },
  // 미연동(게스트) 회원은 기프티샵을 쓸 수 없다(정책 확정) — 기프티콘 교환 기록을 갖는
  // 회원은 전부 카카오 연동 상태여야 하므로 목데이터도 전원 연동 회원으로 둔다.
  { userId: 'user-lee-sy-005', member: M('이서연', true, 'seoyeon_lee') },
  { userId: 'user-park-jh-006', member: M('박지훈', true, 'jihun_park') },
];

let seq = 0;
const nextId = () => {
  seq += 1;
  return `gex-${String(seq).padStart(3, '0')}`;
};

const buildExchange = (
  memberIdx: number,
  productCode: string,
  exchangedAt: string,
  options?: { orderNo?: string; cancelledAt?: string; cancelReason?: string }
): IGifticonExchange => {
  const { userId, member } = MOCK_MEMBERS[memberIdx];
  const cancelled = !!options?.cancelledAt;
  return {
    id: nextId(),
    userId,
    member,
    productCode,
    orderNo: options?.orderNo ?? `PHTRX${exchangedAt.replace(/[-:T]/g, '').slice(0, 14)}`,
    exchangedAt,
    cancelledAt: options?.cancelledAt ?? null,
    cancelReason: options?.cancelReason ?? null,
    status: cancelled ? 'CANCELLED' : 'USED',
    ticketsUsed: ticketsUsedFor(productCode),
  };
};

export const MOCK_GIFTICON_EXCHANGES: IGifticonExchange[] = [
  buildExchange(0, 'NPAY-50000-001', '2026-09-17T18:20:31'),
  buildExchange(1, 'SSG-20000-001', '2026-09-17T09:05:12'),
  buildExchange(2, 'EDIYA-AMR-001', '2026-09-16T14:22:47'),
  buildExchange(3, 'GS25-3000-001', '2026-09-16T08:11:03'),
  buildExchange(0, 'BHC-PRC-001', '2026-09-15T19:40:55'),
  buildExchange(4, 'CU-BEV-15L-001', '2026-09-15T12:03:21'),
  buildExchange(
    1,
    'SBUX-AMR-T-001',
    '2026-09-14T16:33:38',
    {
      cancelledAt: '2026-09-14T23:35:12',
      cancelReason: '고객 요청',
    }
  ),
  buildExchange(5, 'CGV-TICKET-001', '2026-09-14T11:12:09'),
  buildExchange(2, '72429', '2026-09-13T20:55:01'),
  buildExchange(3, '72436', '2026-09-13T13:51:32'),
  buildExchange(0, '72441', '2026-09-12T21:14:46'),
  buildExchange(4, '75264', '2026-09-12T10:28:17'),
  buildExchange(1, '75260', '2026-09-11T17:02:39'),
  buildExchange(
    5,
    'SBUX-LTE-T-001',
    '2026-09-11T09:47:55',
    {
      cancelledAt: '2026-09-11T15:10:02',
      cancelReason: '관리자 취소',
    }
  ),
  buildExchange(2, 'BR-PINT-001', '2026-09-10T22:18:04'),
  buildExchange(3, 'COMPOSE-AMR-001', '2026-09-10T08:59:30'),
  buildExchange(0, 'PAIKS-AMR-001', '2026-09-09T13:24:11'),
  buildExchange(4, '75252', '2026-09-08T19:05:48'),
  buildExchange(1, 'NPAY-50000-001', '2026-09-07T11:41:27'),
  buildExchange(
    2,
    'GS25-3000-001',
    '2026-09-06T15:52:03',
    {
      cancelledAt: '2026-09-06T16:30:00',
      cancelReason: '상품 재고 소진',
    }
  ),
  buildExchange(5, 'CU-BEV-15L-001', '2026-09-05T10:10:10'),
  buildExchange(3, 'BHC-PRC-001', '2026-09-04T18:47:52'),
];
