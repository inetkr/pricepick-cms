import { CONFIG } from 'src/config-global';
import { AppVersionSection } from 'src/sections/app-version/app-version-section';

export const metadata = { title: `${CONFIG.appName} - 앱 버전 관리` };

export default function AppVersionPage() {
  return <AppVersionSection />;
}
