import { CONFIG } from 'src/config-global';
import { DrawsSection } from 'src/sections/draws/draw-section';

export const metadata = { title: `${CONFIG.appName} - 추첨 내역` };

export default function DrawsPage() {
  return <DrawsSection />;
}
