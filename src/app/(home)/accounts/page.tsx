import { CONFIG } from 'src/config-global';
import { AccountsSection } from 'src/sections/accounts/accounts-section';

export const metadata = { title: `${CONFIG.appName} - 관리자 계정` };

export default function AccountsPage() {
  return <AccountsSection />;
}
