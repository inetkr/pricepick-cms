import type { TicketGrade } from 'src/types/common';
import type { IMemberIdentitySummary } from 'src/components/common/member-identity-cell';

// ----------------------------------------------------------------------

export type IGifticonExchangeStatus = 'USED' | 'CANCELLED';

export type IGifticonExchangeTicketPart = {
  grade: TicketGrade;
  quantity: number;
};

// 회원이 티켓을 소모해 기프티콘을 교환한 기록 한 건 — 원장(append-only)이라
// 취소돼도 이 문서를 지우지 않고 status만 CANCELLED로 바뀐다.
export interface IGifticonExchange {
  id: string;
  userId: string;
  member: IMemberIdentitySummary;
  // 교환한 상품의 코드 — 상품 목록(IGifticonProduct.code)과 같은 값으로 이어진다.
  productCode: string;
  orderNo: string | null;
  exchangedAt: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  status: IGifticonExchangeStatus;
  // 교환 시점에 실제로 빠져나간 등급 티켓 조합 — 상품 가격이 나중에 바뀌어도
  // 이 기록 자체는 그대로 남는다(원장이라 소급 변경하지 않는다).
  ticketsUsed: IGifticonExchangeTicketPart[];
}
