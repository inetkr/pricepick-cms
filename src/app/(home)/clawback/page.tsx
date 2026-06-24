import { CONFIG } from 'src/config-global';
import { ClawbackSection } from 'src/sections/clawback/clawback-section';

export const metadata = { title: `${CONFIG.appName} - 환수 내역` };

export default function ClawbackPage() {
  return <ClawbackSection />;
}
