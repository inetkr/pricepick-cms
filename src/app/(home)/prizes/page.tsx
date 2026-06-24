import { CONFIG } from 'src/config-global';
import { PrizesSection } from 'src/sections/prizes/prize-section';

export const metadata = { title: `${CONFIG.appName} - 경품 내역` };

export default function PrizePage() {
  return <PrizesSection />;
}
