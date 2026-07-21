import { CONFIG } from 'src/config-global';
import { WithdrawalSection } from 'src/sections/withdrawal/withdrawal-section';

export const metadata = { title: `${CONFIG.appName} - 계정 탈퇴 처리` };

export default function WithdrawalPage() {
  return <WithdrawalSection />;
}
