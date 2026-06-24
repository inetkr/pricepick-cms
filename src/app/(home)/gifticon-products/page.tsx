import { CONFIG } from 'src/config-global';
import { GifticonProductsSection } from 'src/sections/gifticon-products/gifticon-products-section';

export const metadata = { title: `${CONFIG.appName} - 기프티콘 상품 목록` };

export default function GifticonProductsPage() {
  return <GifticonProductsSection />;
}
