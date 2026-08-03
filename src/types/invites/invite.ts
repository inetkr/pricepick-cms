import { type IKakaoUserInfo } from "../users/user";

export type IInvite = {
  user_id: string;
  nickname: string;
  kakao_id: string | number | null;
  kakao_info: IKakaoUserInfo | null;
  identified_id: string;
  total_invited: number;
  total_completed: number;
  points_granted: number;
  invited_this_month: number;
  latest_invited_at: string | null;
};
