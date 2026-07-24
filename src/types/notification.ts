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
