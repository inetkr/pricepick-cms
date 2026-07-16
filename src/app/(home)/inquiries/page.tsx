import { CONFIG } from 'src/config-global';
import { InquiriesSection } from 'src/sections/inquiries/inquiries-section';

export const metadata = { title: `${CONFIG.appName} - 1:1 문의` };

export default function InquiriesPage() {
  return <InquiriesSection />;
}
