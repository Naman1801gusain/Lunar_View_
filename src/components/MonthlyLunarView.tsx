"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getTithiDetails, type TithiDetails } from "@/utils/astroCalc";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthlyLunarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const leadingEmptyCells = useMemo(() => {
    const firstWeekday = getDay(startOfMonth(currentDate));
    return Array.from({ length: firstWeekday });
  }, [currentDate]);

  const selectedDetails = useMemo(
    () => (selectedDay ? getTithiDetails(selectedDay) : null),
    [selectedDay]
  );

  return (
    <section className="relative mx-auto max-w-5xl p-6 text-slate-100">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Monthly Lunar View</p>
          <h2 className="text-3xl font-serif text-amber-300">{format(currentDate, "MMMM yyyy")}</h2>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Previous month"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="rounded-full border border-slate-700 p-2 transition hover:border-amber-400 hover:text-amber-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next month"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="rounded-full border border-slate-700 p-2 transition hover:border-amber-400 hover:text-amber-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-slate-400">
        {weekdayLabels.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {leadingEmptyCells.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const details = getTithiDetails(day);

          const baseStyles =
            "group relative min-h-[110px] rounded-xl border border-slate-800 p-3 transition duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";
          const fullMoonStyles = details.isFullMoon ? "bg-amber-200/20 border-amber-300/60 text-amber-50" : "";
          const newMoonStyles = details.isNewMoon ? "bg-slate-950 border-slate-600 shadow-inner" : "";
          const ekadashiStyles = details.isEkadashi ? "bg-purple-900/20 border-purple-500/30" : "";
          const defaultStyles =
            !details.isFullMoon && !details.isNewMoon ? "bg-slate-900/50 hover:border-amber-400/50" : "";
          const hoverStyles = "hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.45)]";

          const isSelected =
            selectedDay && format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              ? "ring-2 ring-amber-400"
              : "";

          const cellClass = [baseStyles, defaultStyles, fullMoonStyles, newMoonStyles, ekadashiStyles, hoverStyles, isSelected]
            .filter(Boolean)
            .join(" ");

          let moonGlyph = "🌘";
          if (details.phase === "Full") {
            moonGlyph = "🌕";
          } else if (details.phase === "New") {
            moonGlyph = "🌑";
          } else if (details.age < 15) {
            moonGlyph = "🌔";
          }

          return (
            <div
              key={day.toISOString()}
              className={cellClass}
              onClick={() => setSelectedDay(day)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedDay(day);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="text-right text-sm text-slate-400">{format(day, "d")}</div>
              <div className="my-2 flex justify-center text-3xl transition duration-200 group-hover:scale-110" title={details.phase}>
                {moonGlyph}
              </div>
              <p className="text-center text-xs font-medium leading-tight text-amber-100">{details.tithi}</p>
              {details.isEkadashi && (
                <span
                  className="absolute left-2 top-2 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]"
                  title="Ekadashi"
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && selectedDetails && (
        <DetailModal date={selectedDay} details={selectedDetails} onClose={() => setSelectedDay(null)} />
      )}
    </section>
  );
};

type DetailModalProps = {
  date: Date;
  details: TithiDetails;
  onClose: () => void;
};

const DetailModal = ({ date, details, onClose }: DetailModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  let moonGlyph = "🌘";
  if (details.phase === "Full") moonGlyph = "🌕";
  else if (details.phase === "New") moonGlyph = "🌑";
  else if (details.age < 15) moonGlyph = "🌔";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 text-slate-500 transition hover:text-amber-200"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Detailed View</p>
          <h3 className="text-2xl font-serif text-amber-200">{format(date, "EEEE, MMMM do, yyyy")}</h3>
          <div className="mt-4 text-6xl" aria-hidden>
            {moonGlyph}
          </div>
          <p className="mt-2 text-sm text-slate-400">{details.phase} • {details.paksha} Paksha</p>
        </div>
        <div className="mt-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Tithi</span>
            <span className="text-amber-100">{details.tithi}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Moon Age</span>
            <span>{details.age.toFixed(1)} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Illumination</span>
            <span>{details.illumination}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Special Day</span>
            <span>{details.isFullMoon ? "Purnima" : details.isNewMoon ? "Amavasya" : details.isEkadashi ? "Ekadashi" : "—"}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          *Data approximated locally for instant calendar insights. Open detailed Panchang for precise timings.
        </p>
      </div>
    </div>
  );
};

export default MonthlyLunarView;

