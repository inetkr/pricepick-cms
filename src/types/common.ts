import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type IAccountStatus = 'NORMAL' | 'BLOCK' | 'DELETE';

// 앱의 마케팅 정보 수신 토글 하나만 반영한다 — 동의(ALL) / 거부(NONE) (QA11)
export type IMarketingConsent = 'ALL' | 'NONE';

export type ILoginType = 'INAPP' | 'KAKAO';

export type ITicketStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'USED' | 'EXPIRED' | 'CLAIMED';

export type ITransactionTypeGroup = 'ADMIN_ADD' | 'PURCHASE' | 'ATTENDANCE' | 'AD_WATCH' | 'FRIEND_INVITE' | 'WEEKLY_TASK';

export type IUsageStatus = 'HOLDING' | 'USED' | 'EXPIRED' | 'PENDING' | 'REVOKED';

export type ITicketType = 'BRONZE' | 'SILVER' | 'GOLD' | 'EVENT';

// 티켓 단일화 — 브론즈·실버·골드가 「티켓」(TICKET) 하나로 합쳐졌다. 이벤트 티켓은 EVENT_TICKET.
// BRONZE·SILVER·GOLD·EVENT 는 단일화 전 데이터를 읽을 때만 남겨 두고, 화면에는 TICKET 으로 적는다.
export type IAdminTicketType = 'TICKET' | 'EVENT_TICKET';

export type TicketGrade =
  | 'TICKET'
  | 'EVENT_TICKET'
  | 'RANDOM'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'EVENT';

export type IPrizeType = 'EVENT_TICKET' | 'NO_WIN' | 'POINT';

export type IPolicyType = 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'REWARD_POLICY' | 'TICKET_REWARD_POLICY' | 'MARKETING_CONSENT';