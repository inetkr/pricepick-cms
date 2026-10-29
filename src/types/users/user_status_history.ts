import type { IAccountStatus } from "../common";

// 회원 상세 > 상태 변경 이력 — GET /user/admin/status_history/:id 의 한 줄
// ADMIN: CMS에서 관리자가 변경(사유 필수), SELF: 회원이 앱에서 직접 탈퇴(사유 없음)
export type IUserStatusChangedBy = 'ADMIN' | 'SELF';

export type IUserStatusHistory = {
  id: string;
  from_status: IAccountStatus | null;
  to_status: IAccountStatus;
  reason: string | null;
  changed_by: IUserStatusChangedBy;
  created_at: string;
  employee: { id: string; username: string; fullname: string | null } | null;
}

export type IUpdateUserStatusPayload = {
  account_status: IAccountStatus;
  reason: string;
}
