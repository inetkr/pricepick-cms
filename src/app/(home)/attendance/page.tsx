import { redirect } from 'next/navigation';
import { paths } from 'src/routes/paths';

// 출석 이벤트는 현재 메뉴에서 숨긴 기능이다 — 주소로 직접 들어와도 대시보드로 돌려보낸다.
// 다시 열 때는 AttendanceSection(src/sections/attendance/attendance-section)을 렌더링하면 된다.
export default function AttendancePage() {
  redirect(paths.dashboard.root);
}
