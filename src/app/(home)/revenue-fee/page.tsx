import { CONFIG } from 'src/config-global';
import { RevenueFeeSection } from 'src/sections/revenue-fee/revenue-fee-section';

export const metadata = { title: `${CONFIG.appName} - 제휴 수수료 매출` };

export default function RevenueFeePage() {
  return <RevenueFeeSection />;
}
