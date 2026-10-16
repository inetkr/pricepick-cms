import type { IBase } from "../base";
import type { IAccountStatus, ILoginType, IMarketingConsent } from "../common";

export type IUser = IBase & {
  id: string;
  username: string;
  nickname: string;
  identified_id: string;
  email: string | null;
  login_type: ILoginType;
  kakao_id: string | number | null;
  // 연동 여부는 kakao_info 로 본다 — 미연동이면 null
  kakao_info: IKakaoUserInfo | null;
  account_status: IAccountStatus;
  last_ip: string;
  // epoch 밀리초를 문자열로 준다 — parseTimestamp로 읽는다
  last_online: string | number | null;
  total_points: number;
  pending_random_tickets: number;
  // 티켓 단일화 — 등급별 보유·전환예정 수가 티켓 하나로 합쳐졌다
  pending_ticket: number;
  pending_event_ticket: number;
  ticket_total: number;
  event_ticket_total: number;
  user_setting: IUserSetting;
}

export type IKakaoUserInfo = {
  nickname: string;
  email: string | null;
  linked_at: string;
}

export type IUserSetting = {
  marketing_consent: IMarketingConsent;
}