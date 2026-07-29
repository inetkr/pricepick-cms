import { CONFIG } from 'src/config-global';
import { WeeklyDrawsSection } from 'src/sections/weekly-draws/weekly-draws-section';

export const metadata = { title: `${CONFIG.appName} - 주간 이벤트 추첨 관리` };

export default function WeeklyDrawsPage() {
  return <WeeklyDrawsSection />;
}
