import type { IAnnouncementType } from 'src/types/announcement';

export const ANNOUNCEMENT_TYPE_OPTIONS: { value: IAnnouncementType; label: string }[] = [
  { value: 'NORMAL', label: '일반' },
  { value: 'MAINTENANCE', label: '서비스 점검' },
  { value: 'UPDATE', label: '업데이트' },
  { value: 'POLICY_CHANGE', label: '정책 변경' },
  { value: 'EVENT', label: '이벤트' },
];

export const ANNOUNCEMENT_TYPE_LABEL: Record<IAnnouncementType, string> =
  ANNOUNCEMENT_TYPE_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
    {} as Record<IAnnouncementType, string>
  );
