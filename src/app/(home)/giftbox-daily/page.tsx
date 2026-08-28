import { CONFIG } from 'src/config-global';
import { DailyLuckyRouletteSection } from 'src/sections/daily-lucky-roulette/daily-lucky-roulette-section';

export const metadata = { title: `${CONFIG.appName} - 매일 선물 상자 열기` };

export default function DailyLuckyRoulettePage() {
  return <DailyLuckyRouletteSection />;
}
