import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type IAccountStatus = 'NORMAL' | 'BLOCK' | 'DELETE';

export type IMarketingConsent = 'ALL' | 'SELECTIVE' | 'NONE';

export type ILoginType = 'INAPP' | 'KAKAO';

export type ITicketStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'USED' | 'EXPIRED' | 'CLAIMED';

export type ITransactionTypeGroup = 'ADMIN' | 'COUPANG_PURCHASE' | 'ATTENDANCE';

export type IUsageStatus = 'HOLDING' | 'USED';