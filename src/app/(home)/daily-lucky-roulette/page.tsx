import { CONFIG } from 'src/config-global';
import { DailyLuckyRouletteSection } from 'src/sections/daily-lucky-roulette/daily-lucky-roulette-section';

export const metadata = { title: `${CONFIG.appName} - 매일 행운 룰렛` };

export default function DailyLuckyRoulettePage() {
  return <DailyLuckyRouletteSection />;
}
