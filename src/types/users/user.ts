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
  kakao_info: IKakaoUserInfo;
  account_status: IAccountStatus;
  last_ip: string;
  last_online: string | null;
  total_points: number;
  pending_random_tickets: number;
  pending_bronze: number;
  pending_silver: number;
  pending_gold: number;
  pending_event_tickets: number;
  ticket_bronze_total: number;
  ticket_silver_total: number;
  ticket_gold_total: number;
  ticket_event_total: number;
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