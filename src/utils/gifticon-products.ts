import dayjs from 'dayjs';
import { CONFIG } from 'src/config-global';
import type { TicketGrade } from 'src/types/common';
import type { IGifticonProductTicketPrice } from 'src/types/gifticon-products/gifticon_product';

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

// 등급 티켓 조각 — API의 ticket_price({GOLD,SILVER,BRONZE})를 화면에서 다루기 좋은
// 배열 형태로 바꾼 것. 값 자체는 서버가 계산해 내려준 수량을 그대로 쓴다.
export type IGifticonTicketPart = {
  grade: TicketGrade;
  quantity: number;
};

const TICKET_GRADE_ORDER: Array<Extract<TicketGrade, 'GOLD' | 'SILVER' | 'BRONZE'>> = [
  'GOLD',
  'SILVER',
  'BRONZE',
];

// GET /gift/admin/products가 내려주는 ticket_price를 화면 공용 형식으로 바꾼다 — 등급별
// 실제 환산 비율은 서버(티켓 가치 설정)가 정하므로 여기서 다시 계산하지 않는다.
export const apiTicketPriceToParts = (
  ticketPrice: IGifticonProductTicketPrice | null | undefined
): IGifticonTicketPart[] =>
  TICKET_GRADE_ORDER.map((grade) => ({ grade, quantity: ticketPrice?.[grade] ?? 0 })).filter(
    (p) => p.quantity > 0
  );

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
