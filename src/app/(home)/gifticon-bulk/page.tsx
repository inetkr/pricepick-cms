import { CONFIG } from 'src/config-global';
import { GifticonBulkSection } from 'src/sections/gifticon-bulk/gifticon-bulk-section';

export const metadata = { title: `${CONFIG.appName} - 기프티콘 일괄 등록` };

export default function GifticonBulkPage() {
  return <GifticonBulkSection />;
}
