import type {
  INotificationChannel,
  INotificationSendType,
  INotificationStatus,
  INotificationTargetAudience,
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
};

export const NOTIFICATION_STATUS_OPTIONS: { value: INotificationStatus; label: string }[] = [
  { value: 'SENT', label: '발송완료' },
  { value: 'SCHEDULED', label: '예약' },
  { value: 'FAILED', label: '실패' },
];

// 백엔드 errorService.custom.customError(message, statusCode, type)의 type 값 → 한글 메시지
export const NOTIFICATION_ERROR_MESSAGE: Record<string, string> = {
  invalid_target_audience: '발송 대상 값이 올바르지 않습니다.',
  invalid_scheduled_at: '예약 발송 일시 형식이 올바르지 않습니다.',
  scheduled_at_in_past: '예약 발송 일시는 현재 시간 이후로 설정해주세요.',
  push_in_quiet_hours: '야간 시간대(22:00~08:00)에는 푸시를 예약할 수 없습니다.',
};
