import { CONFIG } from 'src/config-global';
import { PostbackSection } from 'src/sections/postback/postback-section';

export const metadata = { title: `${CONFIG.appName} - 포스트백 로그` };

export default function PostbackPage() {
  return <PostbackSection />;
}
