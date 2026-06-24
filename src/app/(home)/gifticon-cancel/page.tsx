import { CONFIG } from 'src/config-global';
import { GifticonCancelSection } from 'src/sections/gifticon-cancel/gifticon-cancel-section';

export const metadata = { title: `${CONFIG.appName} - 기프티콘 취소 내역` };

export default function GifticonCancelPage() {
  return <GifticonCancelSection />;
}
