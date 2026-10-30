import type { TicketGrade } from '../common';

// 환수 부채 상태 — 서버가 응답할 때 정한다(DB에 따로 저장하지 않음)
// SCHEDULED: 같은 종류의 구매 티켓이 승인 대기 중 → expected_offset_date에 그 티켓에서 먼저 차감
// WAITING: 대기 중인 티켓이 없음 → 다음 적립을 기다림
export type ITicketDebtStatus = 'SCHEDULED' | 'WAITING';

// GET /ticket/admin/list_ticket_debt 의 한 줄 — 아직 다 갚지 않은(amount > 0) 부채만 온다
export type ITicketDebt = {
  id: string;
  user: {
    id: string;
    nickname: string | null;
    kakao_email: string | null;
    identified_id: string | null;
    is_user_deleted: boolean;
  };
  ticket_type: TicketGrade;
  // 남은 부채 장수
  amount: number;
  total_incurred: number;
  total_repaid: number;
  // 마지막으로 부채가 생긴 시각 — 같은 회원·티켓 종류의 부채는 한 줄에 쌓인다
  incurred_at: string;
  first_incurred_at: string;
  last_repaid_at: string | null;
  // 예상 상계일 (KST, YYYY-MM-DD) — 대기 중인 티켓이 없으면 null
  expected_offset_date: string | null;
  // 승인 대기 중인 같은 종류 티켓 합계 — 부채를 다 갚을 수 있는지 가늠할 때 본다
  pending_ticket_amount: number;
  status: ITicketDebtStatus;
};
