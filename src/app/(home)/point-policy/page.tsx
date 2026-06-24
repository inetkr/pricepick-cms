import { CONFIG } from 'src/config-global';
import { PointPolicySection } from 'src/sections/point-policy/point-policy-section';

export const metadata = { title: `${CONFIG.appName} - 포인트 정책` };

export default function PointPolicyPage() {
  return <PointPolicySection />;
}
