import MonthlyLunarView from "@/components/MonthlyLunarView";
import ShootingStars from "@/components/ShootingStars";
import TwinklingStars from "@/components/TwinklingStars";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-black via-slate-950 to-slate-900 py-16 text-white">
      <TwinklingStars />
      <ShootingStars />
      <main className="relative z-20 mx-auto max-w-6xl px-6">
        <div className="mb-10 space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-slate-400">Sprint 1</p>
          <h1 className="text-4xl font-serif text-amber-200 sm:text-5xl">Monthly Lunar View</h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            Track the moon&apos;s journey along with its Vedic Tithis in a single glance. Navigate through months to plan
            rituals, fasts, and spiritual practices without hammering external APIs.
          </p>
        </div>
        <MonthlyLunarView />
      </main>
    </div>
  );
}
