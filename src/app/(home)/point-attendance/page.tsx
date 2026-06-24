import { CONFIG } from 'src/config-global';
import { PointAttendanceSection } from 'src/sections/point-attendance/point-attendance-section';

export const metadata = { title: `${CONFIG.appName} - 출석체크` };

export default function PointAttendancePage() {
  return <PointAttendanceSection />;
}
