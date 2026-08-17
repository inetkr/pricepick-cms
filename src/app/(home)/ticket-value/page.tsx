import { CONFIG } from 'src/config-global';
import { TicketValueSection } from 'src/sections/ticket-value/ticket-value-section';

export const metadata = { title: `${CONFIG.appName} - 티켓 가치 설정` };

export default function TicketValuePage() {
  return <TicketValueSection />;
}
