import { CONFIG } from 'src/config-global';
import { TicketsSection } from 'src/sections/tickets/ticket-section';

export const metadata = { title: `${CONFIG.appName} - 티켓 내역` };

export default function TicketsPage() {
  return <TicketsSection />;
}
