import type {
  INotificationChannel,
  INotificationFailReason,
  INotificationSendType,
  INotificationStatus,
  INotificationTargetAudience,
  INotificationTargetAudienceValue,
} from 'src/types/notification';

export const NOTIFICATION_CHANNEL_OPTIONS: { value: INotificationChannel; label: string }[] = [
  { value: 'PUSH_APP', label: '앱 푸시' },
];

export const NOTIFICATION_CHANNEL_LABEL: Record<INotificationChannel, string> =
  NOTIFICATION_CHANNEL_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<INotificationChannel, string>
  );

export const NOTIFICATION_TARGET_AUDIENCE_OPTIONS: {
  value: INotificationTargetAudience;
  label: string;
}[] = [
  { value: 'ALL', label: '전체 회원' },
  { value: 'KAKAO_LINKED', label: '카카오 연동 회원' },
  { value: 'KAKAO_NOT_LINKED', label: '미연동(게스트) 회원' },
  { value: 'INACTIVE', label: '30일 미접속' },
  { value: 'NEW', label: '신규 가입(7일 이내)' },
  { value: 'HAS_PURCHASE', label: '구매 이력 있는 회원' },
];

export const NOTIFICATION_TARGET_AUDIENCE_LABEL: Record<INotificationTargetAudience, string> =
  NOTIFICATION_TARGET_AUDIENCE_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<INotificationTargetAudience, string>
  );

export const NOTIFICATION_SEND_TYPE_OPTIONS: { value: INotificationSendType; label: string }[] = [
  { value: 'NOW', label: '즉시 발송' },
  { value: 'SCHEDULED', label: '예약 발송' },
];

export const NOTIFICATION_STATUS_LABEL: Record<INotificationStatus, string> = {
  SENT: '발송완료',
  SCHEDULED: '예약',
  FAILED: '실패',
  CANCELLED: '예약 / 취소됨',
};

// 발송 기록의 「대상」 검색 — 작성 폼에는 없는 「개별 발송」까지 고를 수 있다
export const NOTIFICATION_HISTORY_TARGET_OPTIONS: {
  value: INotificationTargetAudienceValue;
  label: string;
}[] = [...NOTIFICATION_TARGET_AUDIENCE_OPTIONS, { value: 'INDIVIDUAL', label: '개별 발송' }];

// 선택 개별 발송 한 번에 고를 수 있는 최대 인원 (서버 PUSH_CAMPAIGN_INDIVIDUAL_MAX_USERS)
export const NOTIFICATION_INDIVIDUAL_MAX_USERS = 500;

export const NOTIFICATION_STATUS_OPTIONS: { value: INotificationStatus; label: string }[] = [
  { value: 'SENT', label: '발송완료' },
  { value: 'SCHEDULED', label: '예약' },
  { value: 'FAILED', label: '실패' },
  { value: 'CANCELLED', label: '취소됨' },
];

export const NOTIFICATION_FAIL_REASON_LABEL: Record<INotificationFailReason, string> = {
  NOT_FOUND: '회원 없음(삭제됨)',
  NO_DEVICE: '등록된 기기 없음',
  OPTED_OUT: '수신 거부',
  PUSH_FAILED: '푸시 거부(토큰 만료·앱 삭제)',
  NOT_NORMAL: '정지·탈퇴 회원',
  SEND_ERROR: '발송 오류',
};

export const getNotificationFailReasonLabel = (reason: string | null | undefined) => {
  if (!reason) return '';
  return NOTIFICATION_FAIL_REASON_LABEL[reason as INotificationFailReason] || reason;
};

// 백엔드 errorService.custom.customError(message, statusCode, type)의 type 값 → 한글 메시지
export const NOTIFICATION_ERROR_MESSAGE: Record<string, string> = {
  invalid_target_audience: '발송 대상 값이 올바르지 않습니다.',
  invalid_scheduled_at: '예약 발송 일시 형식이 올바르지 않습니다.',
  scheduled_at_in_past: '예약 발송 일시는 현재 시간 이후로 설정해주세요.',
  push_in_quiet_hours: '야간 시간대(22:00~08:00)에는 푸시를 보내거나 예약할 수 없습니다.',
  target_user_ids_required: '발송할 회원을 선택하세요.',
  too_many_target_user_ids: `한 번에 최대 ${NOTIFICATION_INDIVIDUAL_MAX_USERS}명까지 보낼 수 있습니다.`,
  target_users_not_found: '선택한 회원을 찾을 수 없습니다.',
  individual_push_not_schedulable: '선택 개별 발송은 즉시 발송만 가능합니다.',
  push_campaign_not_found: '알림을 찾을 수 없습니다.',
  push_campaign_already_cancelled: '이미 취소된 예약입니다.',
  push_campaign_not_scheduled: '이미 발송되어 취소할 수 없습니다.',
};
