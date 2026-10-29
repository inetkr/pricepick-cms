import { CONFIG } from 'src/config-global';
import { StreakMissionSection } from 'src/sections/streak-mission/streak-mission-section';

export const metadata = { title: `${CONFIG.appName} - 연속구매 미션` };

export default function StreakMissionPage() {
  return <StreakMissionSection />;
}
