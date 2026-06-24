import { CONFIG } from 'src/config-global';
import { BannersSection } from 'src/sections/banners/banners-section';

export const metadata = { title: `${CONFIG.appName} - 배너 관리` };

export default function BannersPage() {
  return <BannersSection />;
}
