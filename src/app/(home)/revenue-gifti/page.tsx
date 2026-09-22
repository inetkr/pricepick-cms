import { CONFIG } from 'src/config-global';
import { RevenueGiftiSection } from 'src/sections/revenue-gifti/revenue-gifti-section';

export const metadata = { title: `${CONFIG.appName} - 기프티샵 판매 매출` };

export default function RevenueGiftiPage() {
  return <RevenueGiftiSection />;
}
