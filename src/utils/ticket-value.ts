import type {
  ITicketValueConfigApiValues,
  ITicketValueConfigValue,
} from 'src/types/config/ticket_value_config';

// 티켓 1장 = 10원 (단일화 전 브론즈 단가를 그대로 이어받았다)
export const DEFAULT_TICKET_VALUE: ITicketValueConfigValue = {
  ticket: 10,
  event: 40,
};

// 포인트 정책의 포인트-원 환율은 이 화면이 소유한 값이 아니라 포인트 정책 화면에서 별도 관리된다.
// 영향 범위 카드는 포인트 정책 설정값으로 미리보기만 계산할 뿐 실제 정책에 반영하지 않는다.
// 티켓 환산가치(원)를 포인트 정책의 exchange_rate(point/won) 비율로 환산한 포인트 값으로 바꾼다.
export const convertTicketToPoint = (wonValue: number, pointsPerWon: number): number =>
  wonValue * pointsPerWon;

export const isValidTicketValue = (value: number): boolean =>
  Number.isFinite(value) && Number.isInteger(value) && value >= 0;

// 서버는 키를 대문자(TICKET/EVENT_TICKET)로 주고받는다 — 화면 상태는 소문자로 다룬다.
export const fromApiTicketValue = (values: ITicketValueConfigApiValues): ITicketValueConfigValue => ({
  ticket: values.TICKET,
  event: values.EVENT_TICKET,
});

export const toApiTicketValue = (values: ITicketValueConfigValue): ITicketValueConfigApiValues => ({
  TICKET: values.ticket,
  EVENT_TICKET: values.event,
});
