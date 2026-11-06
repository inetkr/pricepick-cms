import { CONFIG } from 'src/config-global';
import { NotificationSection } from 'src/sections/notification/notification-section';

export const metadata = { title: `${CONFIG.appName} - 알림 관리 · 발송 기록` };

export default function NotificationHistoryPage() {
  return <NotificationSection tab="history" />;
}
