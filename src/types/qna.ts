import type { IBase } from './base';
import { type IKakaoUserInfo } from './users/user';

// 백엔드 QnaState enum 값 추정치(PENDING 기본값만 명세로 확인됨). 실제 enum과 다르면 이 타입과
// src/constants/qna.ts의 QNA_STATE_OPTIONS만 맞춰서 수정하면 된다.
// 상태는 둘뿐이다 — 답변을 등록하면 자동으로 COMPLETED(처리 완료)가 된다. 「처리 중」은 없앴다(김반장님 확정 2026-10-05).
export type IQnaState = 'PENDING' | 'COMPLETED';

export type IQnaType = 'TICKET_EARN' | 'GIFT_EXCHANGE' | 'TICKET_CONVERT' | 'ACCOUNT' | 'OTHER';

export type IQna = IBase & {
  id: string;
  user_id: string;
  employee_id: string | null;
  type: IQnaType;
  title: string;
  content: string;
  answer: string | null;
  is_published: boolean;
  state: IQnaState;
  processed_at: string | null;
  user: {
    id: string;
    nickname: string;
    identified_id: string | null;
    kakao_info?: IKakaoUserInfo
  }
};

export type IQnaStats = {
  pending: number;
  completed: number;
  avg_response_hours: number;
};

export type IUpdateQnaPayload = {
  answer?: string;
  state?: IQnaState;
};
