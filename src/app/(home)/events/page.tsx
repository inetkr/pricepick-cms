import { CONFIG } from 'src/config-global';
import { EventsSection } from 'src/sections/events/events-section';

export const metadata = { title: `${CONFIG.appName} - 이벤트 관리` };

export default function EventsPage() {
  return <EventsSection />;
}
