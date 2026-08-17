import { CONFIG } from 'src/config-global';
import { TicketAccrualSection } from 'src/sections/ticket-accrual/ticket-accrual-section';

export const metadata = { title: `${CONFIG.appName} - 티켓 적립 설정` };

export default function TicketAccrualPage() {
  return <TicketAccrualSection />;
}
