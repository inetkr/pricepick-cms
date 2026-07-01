import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type IAccountStatus = 'NORMAL' | 'BLOCK' | 'DELETE';

export type IMarketingConsent = 'ALL' | 'SELECTIVE' | 'NONE';

export type ILoginType = 'INAPP' | 'KAKAO';

export type ITicketStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'USED' | 'EXPIRED' | 'CLAIMED';

export type ITransactionTypeGroup = 'ADMIN_ADD' | 'COUPANG_PURCHASE' | 'ATTENDANCE' | 'AD_WATCH' | 'FRIEND_INVITE' | 'WEEKLY_TASK';

export type IUsageStatus = 'HOLDING' | 'USED' | 'PENDING' | 'ADMIN_SUB' | 'REJECTED';

export type ITicketType = 'RANDOM' | 'RANK' | 'EVENT';
;