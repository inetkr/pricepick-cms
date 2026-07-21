import { CONFIG } from 'src/config-global';
import { AnnouncementSection } from 'src/sections/announcement/announcement-section';

export const metadata = { title: `${CONFIG.appName} - 공지사항 관리` };

export default function AnnouncementPage() {
  return <AnnouncementSection />;
}
