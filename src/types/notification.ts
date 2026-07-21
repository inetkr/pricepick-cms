import type { IBase } from './base';

export type INotificationChannel = 'PUSH' | 'KAKAO' | 'PUSH_KAKAO';

export type INotificationTarget =
  | 'ALL'
  | 'KAKAO_LINKED'
  | 'GUEST'
  | 'INACTIVE_30D'
  | 'NEW_7D'
  | 'PURCHASED'
  | 'CUSTOM';

export type INotificationStatus = 'SENT' | 'SCHEDULED' | 'TEST' | 'FAILED';

export type INotification = IBase & {
  id: string;
  employee_id: string;
  title: string;
  body: string;
  channel: INotificationChannel;
  target: INotificationTarget;
  recipient_count: number;
  open_rate: number | null;
  status: INotificationStatus;
  scheduled_at: string | null;
  sent_at: string | null;
};

// 필드명은 명세로 확인되지 않아 announcement(IAnnouncementStat)의 네이밍 컨벤션을 따라 추정함.
// 실제 응답과 다르면 이 타입과 notification-stats.tsx만 맞춰서 수정하면 된다.
export type INotificationStat = {
  sent_this_month: number;
  avg_open_rate: number;
  scheduled_count: number;
};

export type ICreateNotificationPayload = {
  title: string;
  body: string;
  channel: INotificationChannel;
  target: INotificationTarget;
  scheduled_at?: string | null;
};

export type ISendTestNotificationPayload = {
  title: string;
  body: string;
  channel: INotificationChannel;
};
