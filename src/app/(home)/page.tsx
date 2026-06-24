import { RoleBasedGuard } from 'src/auth/guard';
import { CONFIG } from 'src/config-global';
import { DashboardSection } from 'src/sections/dashboard/dashboard-section';
import { PAGE_LIST } from 'src/utils/constants';

export const metadata = { title: `${CONFIG.appName} - 대시보드` };

export default function Page() {
  return (
    <RoleBasedGuard>
      <DashboardSection />
    </RoleBasedGuard>
  );
}
