import type { IBase } from './base';

// 백엔드 QnaState enum 값 추정치(PENDING 기본값만 명세로 확인됨). 실제 enum과 다르면 이 타입과
// src/constants/qna.ts의 QNA_STATE_OPTIONS만 맞춰서 수정하면 된다.
export type IQnaState = 'PENDING' | 'PROCESSING' | 'COMPLETED';

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
  }
};

export type IQnaStats = {
  pending: number;
  processing: number;
  completed: number;
  avg_response_hours: number;
};

export type IUpdateQnaPayload = {
  answer?: string;
  state?: IQnaState;
};
