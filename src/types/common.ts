import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type IAccountStatus = 'NORMAL' | 'BLOCK' | 'DELETE';

export type IMarketingConsent = 'ALL' | 'SELECTIVE' | 'NONE';

export type ILoginType = 'INAPP' | 'KAKAO';
