import { CONFIG } from 'src/config-global';
import { GifticonUnusedSection } from 'src/sections/gifticon-unused/gifticon-unused-section';

export const metadata = { title: `${CONFIG.appName} - 기프티콘 미사용 취소` };

export default function GifticonUnusedPage() {
  return <GifticonUnusedSection />;
}
