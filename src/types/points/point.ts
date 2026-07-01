import { IBase } from "../base";

export type IPointType = 'ATTENDANCE' | 'EXCHANGE' | 'ADMIN_GRANT' | 'USED' | 'EXPIRED';

export type IPoint = IBase & {
  id: string;
  user_id: string;
  nickname: string;
  kakao_id: string | number | null;
  type: IPointType;
  points: number;
  balance: number;
}
