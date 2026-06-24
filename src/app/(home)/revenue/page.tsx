import { CONFIG } from 'src/config-global';
import { RevenueSection } from 'src/sections/revenue/revenue-section';

export const metadata = { title: `${CONFIG.appName} - 매출 내역` };

export default function RevenuePage() {
  return <RevenueSection />;
}
