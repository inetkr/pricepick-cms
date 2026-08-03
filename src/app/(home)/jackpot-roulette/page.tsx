import { CONFIG } from 'src/config-global';
import { JackpotRouletteSection } from 'src/sections/jackpot-roulette/jackpot-roulette-section';

export const metadata = { title: `${CONFIG.appName} - 잭팟 룰렛` };

export default function JackpotRoulettePage() {
  return <JackpotRouletteSection />;
}
