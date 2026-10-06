import type { ApiPagination } from './api_response';
import type { IBase } from './base';

export type INotificationChannel = 'PUSH_APP';

export type INotificationTargetAudience =
  | 'ALL'
  | 'KAKAO_LINKED'
  | 'KAKAO_NOT_LINKED'
  | 'INACTIVE'
  | 'NEW'
  | 'HAS_PURCHASE';

export type INotificationTargetAudienceValue = INotificationTargetAudience | 'TEST';

export type INotificationSendType = 'NOW' | 'SCHEDULED';

export type INotificationStatus = 'SENT' | 'SCHEDULED' | 'FAILED';

export type INotificationStatusValue = INotificationStatus | 'TEST';

export type INotification = IBase & {
  id: string;
  employee_id: string | null;
  channel: INotificationChannel;
  target_audience: INotificationTargetAudienceValue;
  title: string;
  content: string;
  send_type: INotificationSendType;
  // unix timestamp(초)
  scheduled_at: number | null;
  status: INotificationStatusValue;
  sent_count: number;
  sent_at: string | null;
  open_rate?: number | null;
  // 대상 수 — 발송 시점에 대상 조건으로 집계한 인원 (테스트는 고른 회원 수)
  recipient_count?: number | null;
  // 성공·실패 — 예약 건은 아직 발송 전이라 null
  success_count?: number | null;
  fail_count?: number | null;
  // 테스트 발송(DEVQA 23) — 실제로 보낸 회원 (get_list_cms가 테스트 건에 실어 준다)
  sent_users?: INotificationTestUser[] | null;
};

export type INotificationTestUser = {
  id: string;
  nickname: string;
};

export type INotificationStat = {
  sent_this_month: number;
  scheduled_pending: number;
};

export type ISendNotificationPayload = {
  channel: INotificationChannel;
  target_audience: INotificationTargetAudience;
  title: string;
  content: string;
  send_type: INotificationSendType;
  // unix timestamp(초)
  scheduled_at?: number | null;
  is_test: boolean;
};

// DEVQA 23 · 테스트 발송 — 고른 회원에게만 즉시 발송
export type ISendTestNotificationPayload = {
  title: string;
  content: string;
  test_user_ids: string[];
};

// 수신 실패 사유
// NOT_FOUND: (테스트) user_id 없음·삭제 — 응답에만 있고 DB에는 남지 않는다
// NO_DEVICE: device_token이 있는 로그인 기기가 없음
// PUSH_FAILED: 기기는 있으나 FCM이 모든 토큰을 거절 (토큰 만료·앱 삭제 등)
// NOT_NORMAL: (실발송) 큐 대기 중 계정이 정지·탈퇴됨
// SEND_ERROR: (실발송) 묶음 전체가 FCM 호출 오류 (네트워크·구글 장애 등)
export type INotificationFailReason =
  | 'NOT_FOUND'
  | 'NO_DEVICE'
  | 'PUSH_FAILED'
  | 'NOT_NORMAL'
  | 'SEND_ERROR';

export type ISendTestNotificationResultItem = {
  user_id: string;
  nickname: string | null;
  identified_id: string | null;
  // SENT | FAILED — 서버가 실패 사유 코드를 그대로 넣어 주기도 한다
  result: 'SENT' | 'FAILED' | INotificationFailReason;
  fail_reason?: INotificationFailReason | null;
};

export type ISendTestNotificationResult = {
  mode: 'TEST';
  campaign: INotification;
  results: ISendTestNotificationResultItem[];
};

// 수신자 목록(DEVQA 24) — 수신 기록은 90일 보관 후 삭제
export type INotificationRecipient = {
  user_id: string;
  nickname: string | null;
  identified_id: string | null;
  result: 'SENT' | 'FAILED';
  fail_reason: INotificationFailReason | null;
  // 서버가 내려주는 한글 사유 — 예: 「수신 가능한 기기 없음」
  fail_reason_label?: string | null;
  sent_at: string | null;
};

// 수신자 목록 응답에 함께 오는 발송 건 요약 — 성공·실패는 검색어와 무관한 전체 기준
export type INotificationRecipientCampaign = Pick<
  INotification,
  'id' | 'title' | 'target_audience' | 'status' | 'sent_count' | 'scheduled_at'
> & {
  recipient_count: number | null;
  success_count: number | null;
  fail_count: number | null;
};

export type INotificationRecipientListResponse = {
  code: number;
  result: {
    object: { count: number; rows: INotificationRecipient[] };
    campaign: INotificationRecipientCampaign;
  };
  pagination: ApiPagination;
};

// 회원 상세의 「받은 알림」
export type IUserReceivedNotification = {
  campaign_id: string;
  title: string;
  content: string;
  channel: INotificationChannel;
  target_audience: INotificationTargetAudienceValue;
  is_test: boolean;
  result: 'SENT' | 'FAILED';
  fail_reason: INotificationFailReason | null;
  // 서버가 내려주는 한글 사유 — 예: 「수신 가능한 기기 없음」
  fail_reason_label?: string | null;
  sent_at: string | null;
};
