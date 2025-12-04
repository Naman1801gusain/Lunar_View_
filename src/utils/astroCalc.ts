import { Moon } from "lunarphase-js";

// Vedic Tithi names (15 per Paksha, reused for both Shukla/Krishna)
const TITHI_NAMES = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima/Amavasya",
];

export type TithiDetails = {
  tithi: string;
  age: number;
  phase: string;
  isEkadashi: boolean;
  isFullMoon: boolean;
  isNewMoon: boolean;
  illumination: number;
  paksha: "Shukla" | "Krishna";
};

export function getTithiDetails(date: Date): TithiDetails {
  const age = Moon.lunarAge(date); // 0 - 29.5 days
  const phase = Moon.lunarPhase(date); // "New", "Full", etc.

  const isWaxing = age < 15;
  const paksha = isWaxing ? "Shukla" : "Krishna";

  let tithiIndex = Math.floor(age % 15);
  if (tithiIndex >= TITHI_NAMES.length) {
    tithiIndex = TITHI_NAMES.length - 1;
  }

  const roundedAge = Math.round(age);
  const isFullMoon = roundedAge === 15;
  const isNewMoon = roundedAge === 0 || roundedAge === 30;

  let tithiName = TITHI_NAMES[tithiIndex];
  if (tithiIndex === 14) {
    tithiName = paksha === "Shukla" ? "Purnima" : "Amavasya";
  }

  let displayTitle = `${paksha} ${tithiName}`;
  if (isFullMoon) {
    displayTitle = "Purnima (Full Moon)";
  }
  if (isNewMoon) {
    displayTitle = "Amavasya (New Moon)";
  }

  const halfCycle = 29.53 / 2;
  const illuminationFraction = age <= halfCycle ? age / halfCycle : (29.53 - age) / halfCycle;
  const illumination = Math.round(Math.max(0, Math.min(illuminationFraction, 1)) * 100);

  return {
    tithi: displayTitle,
    age,
    phase,
    isEkadashi: tithiIndex === 10,
    isFullMoon,
    isNewMoon,
    illumination,
    paksha,
  };
}

