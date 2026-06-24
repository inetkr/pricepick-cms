import { CONFIG } from 'src/config-global';
import { StatsSection } from 'src/sections/stats/stats-section';

export const metadata = { title: `${CONFIG.appName} - 수익 분석` };

export default function StatsPage() {
  return <StatsSection />;
}
