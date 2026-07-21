import { CONFIG } from 'src/config-global';
import { NotificationSection } from 'src/sections/notification/notification-section';

export const metadata = { title: `${CONFIG.appName} - 알림 관리` };

export default function NotificationsPage() {
  return <NotificationSection />;
}
