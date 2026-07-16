import { CONFIG } from 'src/config-global';
import { TermsSection } from 'src/sections/terms/terms-section';

export const metadata = { title: `${CONFIG.appName} - 약관 관리` };

export default function TermsPage() {
  return <TermsSection />;
}
