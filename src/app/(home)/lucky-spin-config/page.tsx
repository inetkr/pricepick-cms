import { CONFIG } from 'src/config-global';
import { LuckySpinSection } from 'src/sections/lucky-spin/lucky-spin-section';

export const metadata = { title: `${CONFIG.appName} - 행운룰렛 설정` };

export default function LuckySpinConfigPage() {
  return <LuckySpinSection />;
}
