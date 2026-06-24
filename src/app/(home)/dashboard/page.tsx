import { CONFIG } from 'src/config-global';
import { DashboardSection } from 'src/sections/dashboard/dashboard-section';

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <DashboardSection />;
}
