import type { IBase } from './base';

export type IAnnouncementType = 'NORMAL' | 'MAINTENANCE' | 'UPDATE' | 'POLICY_CHANGE' | 'EVENT';

export type IAnnouncement = IBase & {
  id: string;
  employee_id: string;
  title: string;
  content: string;
  view_count: number;
  is_published: boolean;
  type: IAnnouncementType;
  published_at: string | null;
};

// 필드명은 명세로 확인되지 않아 기존 *_stat 타입들의 네이밍 컨벤션을 따라 추정함.
// 실제 응답과 다르면 이 타입과 announcement-stats.tsx만 맞춰서 수정하면 된다.
export type IAnnouncementStat = {
  published: number;
  draft: number;
  total: number;
};

export type ICreateAnnouncementPayload = {
  title: string;
  content: string;
  type: IAnnouncementType;
  is_published?: boolean;
};

export type IUpdateAnnouncementPayload = {
  title: string;
  content: string;
  type?: IAnnouncementType;
  is_published?: boolean;
};
