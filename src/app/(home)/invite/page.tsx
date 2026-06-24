import { CONFIG } from 'src/config-global';
import { InviteSection } from 'src/sections/invites/invites-section';

export const metadata = { title: `${CONFIG.appName} - 친구초대 내역` };

export default function InvitePage() {
  return <InviteSection />;
}
