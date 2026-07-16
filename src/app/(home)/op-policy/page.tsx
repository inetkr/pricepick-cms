import { CONFIG } from 'src/config-global';
import { OpPolicySection } from 'src/sections/op-policy/op-policy-section';

export const metadata = { title: `${CONFIG.appName} - 운영 정책` };

export default function OpPolicyPage() {
  return <OpPolicySection />;
}
