export type ITicketStat = {
  total_issued: ITicketTotalType;
  today_issued: ITicketTotalType;
  gifticon_purchases_this_month: number;
  event_ticket_prize_entries: number;
  fraud_revoked: number;
};

export type ITicketTotalType = {
  bronze: number;
  silver: number;
  gold: number;
  event: number;
  all: number;
}
