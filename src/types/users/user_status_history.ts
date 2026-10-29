import type { IAccountStatus } from "../common";

// 회원 상세 > 상태 변경 이력 — GET /user/admin/status_history/:id 의 한 줄
// ADMIN: CMS에서 관리자가 변경(사유 필수), SELF: 회원이 앱에서 직접 탈퇴(사유 없음)
export type IUserStatusChangedBy = 'ADMIN' | 'SELF';

// 차단 기간 — 차단(BLOCK)으로 바꿀 때만 보낸다. PERMANENT면 blocked_until은 null
export type IBlockDuration = 'PERMANENT' | 'DAYS_7' | 'DAYS_30';

export type IUserStatusHistory = {
  id: string;
  from_status: IAccountStatus | null;
  to_status: IAccountStatus;
  reason: string | null;
  changed_by: IUserStatusChangedBy;
  block_duration?: IBlockDuration | null;
  // 마지막으로 차단되는 날(KST, YYYY-MM-DD) — 다음 날 0시에 풀린다
  blocked_until?: string | null;
  created_at: string;
  employee: { id: string; username: string; fullname: string | null } | null;
}

export type IUpdateUserStatusPayload = {
  account_status: IAccountStatus;
  reason: string;
  block_duration?: IBlockDuration;
}
