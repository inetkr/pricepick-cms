import type { IAnnouncement, IAnnouncementType } from 'src/types/announcement';

export const ANNOUNCEMENT_TYPE_OPTIONS: { value: IAnnouncementType; label: string }[] = [
  { value: 'NORMAL', label: '일반' },
  { value: 'MAINTENANCE', label: '서비스 점검' },
  { value: 'UPDATE', label: '업데이트' },
  { value: 'POLICY_CHANGE', label: '정책 변경' },
  { value: 'EVENT', label: '이벤트' },
];

/* 공지 상태 (QA22) — 「임시저장」과 「비게시」는 다른 상태다.
     게시      is_published = true
     비게시    한 번이라도 게시된 적 있는 공지를 내린 것 (published_at 이 남아 있다)
     임시저장  아직 한 번도 게시되지 않은 초안 (published_at 이 비어 있다)
   서버는 is_published 하나만 주므로 published_at 으로 두 상태를 가른다. */
export type IAnnouncementState = 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT';

export const getAnnouncementState = (
  announcement: Pick<IAnnouncement, 'is_published' | 'published_at'>
): IAnnouncementState => {
  if (announcement.is_published) return 'PUBLISHED';
  return announcement.published_at ? 'UNPUBLISHED' : 'DRAFT';
};

export const ANNOUNCEMENT_STATE_BADGE: Record<
  IAnnouncementState,
  { label: string; className: string }
> = {
  PUBLISHED: { label: '게시', className: 'badge-green' },
  UNPUBLISHED: { label: '비게시', className: 'badge-gray' },
  DRAFT: { label: '임시저장', className: 'badge-amber' },
};

export const ANNOUNCEMENT_TYPE_LABEL: Record<IAnnouncementType, string> =
  ANNOUNCEMENT_TYPE_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<IAnnouncementType, string>
  );
