import { CONFIG } from 'src/config-global';
import { GifticonSection } from 'src/sections/gifticons/gifticons-section';

export const metadata = { title: `${CONFIG.appName} - 기프티콘 내역` };

export default function GifticonsPage() {
  return <GifticonSection />;
}
