import { CONFIG } from 'src/config-global';
import { NoticeSection } from 'src/sections/notices/notice-section';

export const metadata = { title: `${CONFIG.appName} - 공지사항` };

export default function NoticePage() {
  return <NoticeSection />;
}
