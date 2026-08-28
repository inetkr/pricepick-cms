import { CONFIG } from 'src/config-global';
import { JackpotRouletteSection } from 'src/sections/jackpot-roulette/jackpot-roulette-section';

export const metadata = { title: `${CONFIG.appName} - 랜덤 선물 상자 열기` };

export default function JackpotRoulettePage() {
  return <JackpotRouletteSection />;
}
