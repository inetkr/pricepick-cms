// 브론즈/실버/골드는 1:10:20 고정 비율로 묶여 있고, 이벤트 티켓은 경품 응모 전용이라 등급 비율과
// 무관하게 별도로 관리된다 (등급을 바꿔도 이벤트 티켓 가치는 따라 움직이지 않는다).
export type ITicketValueConfigValue = {
  bronze: number;
  silver: number;
  gold: number;
  event: number;
};

export type ITicketValueGrade = 'bronze' | 'silver' | 'gold';

// /ticket/admin/ticket_value_config 응답·요청 바디는 등급 키가 대문자로 온다.
export type ITicketValueConfigApiValues = {
  BRONZE: number;
  SILVER: number;
  GOLD: number;
  EVENT: number;
};

export type ITicketValueConfigData = {
  configured: boolean;
  values: ITicketValueConfigApiValues;
  updated_at: string;
};
