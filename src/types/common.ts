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

export type ITicketType = 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT';

export type TicketGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT' | 'RANDOM';

export type IPrizeType = 'EVENT_TICKET' | 'NO_WIN' | 'POINT';

export type IPolicyType = 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'REWARD_POLICY' | 'TICKET_REWARD_POLICY' | 'MARKETING_CONSENT';