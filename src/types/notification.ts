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

// INDIVIDUAL = 선택 개별 발송 (관리자가 고른 회원에게만 즉시 발송), TEST = 예전 테스트 발송 기록
export type INotificationTargetAudienceValue = INotificationTargetAudience | 'INDIVIDUAL' | 'TEST';

export type INotificationSendType = 'NOW' | 'SCHEDULED';

// CANCELLED — 예약했다가 발송 전에 취소한 건 (발송되지 않고 「예약 / 취소됨」으로 남는다)
export type INotificationStatus = 'SENT' | 'SCHEDULED' | 'FAILED' | 'CANCELLED';

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
  // 발송 결과 4칸 — 합이 대상 수와 같다. 예약 건은 아직 발송 전이라 null
  success_count?: number | null;
  fail_count?: number | null;
  // 미처리 — 보낼 주소가 없어 시도하지 못함 (토큰 없음·권한 거부·수신 거부)
  skipped_count?: number | null;
  // 확인 불가 — 결과를 알 수 없음 (응답 없음·과거 기록)
  unknown_count?: number | null;
  // 알림을 눌러 연 회원 수 — 열람률은 opened_count / success_count로 보여 준다
  opened_count?: number | null;
  // 발송에 성공한 회원
  sent_users?: INotificationUserRef[] | null;
  // 선택 개별 발송 건에서 관리자가 고른 회원 (그 외 건은 null)
  target_users?: INotificationUserRef[] | null;
};

export type INotificationUserRef = {
  id: string;
  nickname: string | null;
};

export type INotificationStat = {
  sent_this_month: number;
  scheduled_pending: number;
};

// 발송 확인 팝업의 대상 인원 — 발송 대상 선택값 기준
export type INotificationAudienceCount = {
  target_audience: INotificationTargetAudience;
  // 실제로 받을 회원 (수신 동의)
  recipient_count: number;
  // 수신 미동의라 빠지는 회원
  excluded_count: number;
  // 대상 조건에 맞는 전체 회원 = recipient_count + excluded_count
  total_count: number;
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

// 선택 개별 발송 — 고른 회원에게만 즉시 발송 (예약 불가). 발송 기록에는 「개별 발송」으로 남는다
export type ISendIndividualNotificationPayload = {
  channel: INotificationChannel;
  target_audience: 'INDIVIDUAL';
  target_user_ids: string[];
  title: string;
  content: string;
  send_type: 'NOW';
  is_test: false;
};

export type ISendIndividualNotificationResult = {
  mode: 'SENT';
  campaign: INotification;
  sent_count: number;
  // 존재하지 않는 회원 — 보내지 않았고 대상 수에도 들어가지 않는다
  not_found_user_ids: string[];
};

// 수신 실패 사유
// NOT_FOUND: (테스트) user_id 없음·삭제 — 응답에만 있고 DB에는 남지 않는다
// NO_DEVICE: device_token이 있는 로그인 기기가 없음
// OPTED_OUT: 마케팅 수신 미동의 (개별 발송에서 미처리로 남는다)
// PUSH_FAILED: 기기는 있으나 FCM이 모든 토큰을 거절 (토큰 만료·앱 삭제 등)
// NOT_NORMAL: (실발송) 큐 대기 중 계정이 정지·탈퇴됨
// SEND_ERROR: (실발송) 묶음 전체가 FCM 호출 오류 (네트워크·구글 장애 등)
export type INotificationFailReason =
  | 'NOT_FOUND'
  | 'NO_DEVICE'
  | 'OPTED_OUT'
  | 'PUSH_FAILED'
  | 'NOT_NORMAL'
  | 'SEND_ERROR';

// 수신자 목록(DEVQA 24) — 수신 기록은 90일 보관 후 삭제
export type INotificationRecipient = {
  user_id: string;
  nickname: string | null;
  identified_id: string | null;
  // SKIPPED = 미처리 (보낼 주소가 없어 시도하지 않음 — 사유는 fail_reason)
  result: 'SENT' | 'FAILED' | 'SKIPPED';
  fail_reason: INotificationFailReason | null;
  // 서버가 내려주는 한글 사유 — 예: 「푸시 토큰 없음」
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
  skipped_count?: number | null;
  unknown_count?: number | null;
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
  result: 'SENT' | 'FAILED' | 'SKIPPED';
  fail_reason: INotificationFailReason | null;
  // 서버가 내려주는 한글 사유 — 예: 「수신 가능한 기기 없음」
  fail_reason_label?: string | null;
  sent_at: string | null;
};
