import { RoleBasedGuard } from 'src/auth/guard';
import { CONFIG } from 'src/config-global';
import { MembersSection } from 'src/sections/members/member-section';

export const metadata = { title: `${CONFIG.appName} - 회원 관리` };

export default function MembersPage() {
  return (
    <RoleBasedGuard>
      <MembersSection />
    </RoleBasedGuard>
  );
}
