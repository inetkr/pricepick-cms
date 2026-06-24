import { CONFIG } from 'src/config-global';
import { AttendanceSection } from 'src/sections/attendance/attendance-section';

export const metadata = { title: `${CONFIG.appName} - 출석 이벤트` };

export default function AttendancePage() {
  return <AttendanceSection />;
}
