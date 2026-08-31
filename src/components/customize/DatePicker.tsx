"use client";

import { useMemo, useState } from "react";
import { cx } from "@/lib/utils";

/**
 * DEPARTURE DATE PICKER
 *
 * Three months side by side with real day cells, rather than a list of month
 * names. Picking "August" tells us almost nothing — picking the 27th lets us
 * quote actual airfares, so the extra interface earns its place.
 *
 * The season ring on each date is derived from the destination's own
 * `bestMonths`, so it reflects the record rather than an invented crowd
 * forecast. A month in `bestMonths` is a good-season date; anything else is
 * flagged as off-season. We deliberately do not label these as "crowd" levels,
 * because we hold no crowd data and would be inventing it.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_KEYS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** Months per view — one on small screens, three from large up. */
const VISIBLE = 3;

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function DatePicker({
  value,
  onChange,
  bestMonths,
  compact = false,
}: {
  /** ISO yyyy-mm-dd, or empty. */
  value?: string;
  onChange: (isoDate: string) => void;
  /** Month keys the destination is actually good in. */
  bestMonths?: string[];
  /**
   * One month instead of three, for the hero panel — three months over a
   * photograph is more calendar than the space can carry honestly.
   */
  compact?: boolean;
}) {
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const [cursor, setCursor] = useState(() => startOfMonth(today.getFullYear(), today.getMonth()));

  const months = useMemo(
    () =>
      Array.from({ length: compact ? 1 : VISIBLE }, (_, i) => {
        const d = new Date(cursor.getFullYear(), cursor.getMonth() + i, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
      }),
    [cursor, compact],
  );

  // Do not let the traveller page back before the current month.
  const atStart =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const shift = (by: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + by, 1));

  const hasSeasonData = Boolean(bestMonths?.length);

  return (
    <div
      className={
        compact
          ? "mx-auto w-full max-w-md"
          : "mx-auto mt-12 max-w-5xl rounded-lg border border-border bg-surface p-5 md:p-8"
      }
    >
      {/* --- header --- */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={atStart}
          aria-label="Previous month"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-text transition-colors duration-[--duration-fast] hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={compact ? "flex-1" : "grid flex-1 gap-6 lg:grid-cols-3"}>
          {months.map((m, i) => (
            <p
              key={`${m.year}-${m.month}`}
              className={cx(
                "text-center text-h3 font-semibold text-text-strong",
                i > 0 && "hidden lg:block",
              )}
            >
              {MONTH_NAMES[m.month]} {m.year}
            </p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-text transition-colors duration-[--duration-fast] hover:border-primary hover:text-primary"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* --- month grids --- */}
      <div className={compact ? "mt-5" : "mt-8 grid gap-8 lg:grid-cols-3"}>
        {months.map((m, monthIndex) => (
          <MonthGrid
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            today={today}
            value={value}
            onChange={onChange}
            bestMonths={bestMonths}
            className={monthIndex > 0 ? "hidden lg:block" : undefined}
          />
        ))}
      </div>

      {/* --- legend --- */}
      {hasSeasonData && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 border-t border-border pt-6">
          <p className="flex items-center gap-2.5 text-label text-muted">
            <span aria-hidden="true" className="size-5 rounded-full border-2 border-secondary" />
            Good season
          </p>
          <p className="flex items-center gap-2.5 text-label text-muted">
            <span aria-hidden="true" className="size-5 rounded-full border-2 border-accent" />
            Off season
          </p>
        </div>
      )}

      {!compact && (
        <p className="mt-5 text-center text-caption text-muted">
          Season guidance comes from the destination&rsquo;s own best-travel months. Exact fares and
          availability are confirmed when we quote.
        </p>
      )}
    </div>
  );
}

function MonthGrid({
  year,
  month,
  today,
  value,
  onChange,
  bestMonths,
  className,
}: {
  year: number;
  month: number;
  today: Date;
  value?: string;
  onChange: (isoDate: string) => void;
  bestMonths?: string[];
  className?: string;
}) {
  const total = daysInMonth(year, month);
  const offset = startOfMonth(year, month).getDay();
  const inSeason = bestMonths?.includes(MONTH_KEYS[month]);
  const hasSeasonData = Boolean(bestMonths?.length);

  return (
    <div className={className}>
      <p className="sr-only" aria-hidden="false">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-y-1" role="grid" aria-label={`${MONTH_NAMES[month]} ${year}`}>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="pb-2 text-center text-caption font-medium uppercase tracking-[0.06em] text-muted"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: offset }, (_, i) => (
          <div key={`pad-${i}`} role="gridcell" />
        ))}

        {Array.from({ length: total }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const dateIso = iso(year, month, day);
          const isPast = date < today;
          const isSelected = value === dateIso;

          return (
            <div key={day} role="gridcell" className="grid place-items-center">
              <button
                type="button"
                disabled={isPast}
                onClick={() => onChange(dateIso)}
                aria-label={`${day} ${MONTH_NAMES[month]} ${year}${
                  hasSeasonData ? (inSeason ? ", good season" : ", off season") : ""
                }`}
                aria-pressed={isSelected}
                className={cx(
                  "grid size-9 place-items-center rounded-full text-label tabular-nums transition-[background-color,border-color,color] duration-[--duration-fast]",
                  isPast && "cursor-not-allowed text-muted/35",
                  !isPast && !isSelected && "border-2 hover:bg-primary/10",
                  !isPast && !isSelected && hasSeasonData
                    ? inSeason
                      ? "border-secondary text-text"
                      : "border-accent/60 text-text"
                    : !isPast && !isSelected
                      ? "border-transparent text-text"
                      : "",
                  isSelected && "border-2 border-primary bg-primary font-semibold text-primary-contrast",
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
