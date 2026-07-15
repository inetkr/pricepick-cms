import { CONFIG } from 'src/config-global';
import { PointsSection } from 'src/sections/points/points-section';

export const metadata = { title: `${CONFIG.appName} - 포인트 내역` };

export default function PointsPage() {
  return <PointsSection />;
}
