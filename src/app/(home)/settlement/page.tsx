import { CONFIG } from 'src/config-global';
import { SettlementSection } from 'src/sections/settlement/settlement-section';

export const metadata = { title: `${CONFIG.appName} - 정산 내역` };

export default function SettlementPage() {
  return <SettlementSection />;
}
