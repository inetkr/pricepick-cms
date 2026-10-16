// 티켓 단일화 — 브론즈/실버/골드가 「티켓」 하나로 합쳐졌다. 이벤트 티켓은 경품 응모 전용이라
// 티켓 가치와 무관하게 별도로 관리된다 (티켓 값을 바꿔도 이벤트 티켓 가치는 따라 움직이지 않는다).
export type ITicketValueConfigValue = {
  ticket: number;
  event: number;
};

export type ITicketValueKind = keyof ITicketValueConfigValue;

// /ticket/admin/ticket_value_config 응답·요청 바디는 티켓 종류 키가 대문자로 온다.
export type ITicketValueConfigApiValues = {
  TICKET: number;
  EVENT_TICKET: number;
};

export type ITicketValueConfigData = {
  configured: boolean;
  values: ITicketValueConfigApiValues;
  updated_at: string;
};
