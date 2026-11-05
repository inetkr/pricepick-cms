import { CONFIG } from 'src/config-global';
import { RevenueFeeSection } from 'src/sections/revenue-fee/revenue-fee-section';

export const metadata = { title: `${CONFIG.appName} - 경유 쇼핑 리워드 매출` };

export default function RevenueFeePage() {
  return <RevenueFeeSection />;
}
