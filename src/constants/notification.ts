import type {
  INotificationChannel,
  INotificationStatus,
  INotificationTarget,
} from 'src/types/notification';

export const NOTIFICATION_CHANNEL_OPTIONS: { value: INotificationChannel; label: string }[] = [
  { value: 'PUSH', label: '앱 푸시' },
  { value: 'KAKAO', label: '카카오 알림톡 (연동 회원)' },
  { value: 'PUSH_KAKAO', label: '푸시 + 알림톡 동시' },
];

export const NOTIFICATION_CHANNEL_LABEL: Record<INotificationChannel, string> =
  NOTIFICATION_CHANNEL_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<INotificationChannel, string>
  );

export const NOTIFICATION_TARGET_OPTIONS: { value: INotificationTarget; label: string }[] = [
  { value: 'ALL', label: '전체 회원' },
  { value: 'KAKAO_LINKED', label: '카카오 연동 회원' },
  { value: 'GUEST', label: '미연동(게스트) 회원' },
  { value: 'INACTIVE_30D', label: '30일 미접속' },
  { value: 'NEW_7D', label: '신규 가입(7일 이내)' },
  { value: 'PURCHASED', label: '구매 이력 있는 회원' },
  { value: 'CUSTOM', label: '커스텀 세그먼트' },
];

export const NOTIFICATION_TARGET_LABEL: Record<INotificationTarget, string> =
  NOTIFICATION_TARGET_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<INotificationTarget, string>
  );

export const NOTIFICATION_STATUS_LABEL: Record<INotificationStatus, string> = {
  SENT: '발송완료',
  SCHEDULED: '예약',
  TEST: '테스트',
  FAILED: '실패',
};
