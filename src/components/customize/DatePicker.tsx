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

/** Matches RoomPicker: cream on `/customize`, frosted glass over the hero. */
export type DatePickerTone = "surface" | "glass";

const TONE = {
  surface: {
    shell: "rounded-lg border border-border bg-surface p-5 md:p-8",
    nav: "border-border text-text hover:border-primary hover:text-primary",
    month: "text-text-strong",
    weekday: "text-muted",
    day: "text-text",
    past: "text-muted/35",
    hover: "hover:bg-primary/10",
    selected: "border-primary bg-primary text-primary-contrast",
    inSeason: "border-secondary",
    offSeason: "border-accent/60",
    rule: "border-border",
    legend: "text-muted",
  },
  glass: {
    shell: "rounded-2xl border border-sand-50/18 bg-ink-900/62 p-4 shadow-[0_18px_50px_-12px_rgb(16_15_14/0.6)] md:p-5",
    nav: "border-sand-50/35 text-sand-50 hover:border-amber-400 hover:text-amber-300",
    month: "text-sand-50",
    weekday: "text-sand-100/70",
    day: "text-sand-50",
    past: "text-sand-50/25",
    hover: "hover:bg-sand-50/15",
    selected: "border-amber-400 bg-amber-400 text-ink-900",
    inSeason: "border-sand-50/45",
    offSeason: "border-sand-50/20",
    rule: "border-sand-50/15",
    legend: "text-sand-100/80",
  },
} as const;

type Tone = (typeof TONE)[DatePickerTone];

export function DatePicker({
  value,
  onChange,
  bestMonths,
  compact = false,
  tone = "surface",
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
  tone?: DatePickerTone;
}) {
  const t = TONE[tone];
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
      className={cx(
        compact ? "mx-auto w-full max-w-md" : "mx-auto mt-12 max-w-5xl",
        // Over photography the calendar always needs its own surface, compact
        // or not — a bare grid of dates on open footage is unreadable at any
        // scrim strength. On the standalone page the shell is only for the
        // full three-month view; the compact one there sits on the page's own
        // surface already.
        (t === TONE.glass || !compact) && t.shell,
      )}
    >
      {/* --- header --- */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={atStart}
          aria-label="Previous month"
          className={cx("grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-[--duration-fast] disabled:pointer-events-none disabled:opacity-30", t.nav)}
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
                "text-center text-h3 font-semibold", t.month,
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
          className={cx("grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-[--duration-fast]", t.nav)}
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
            t={t}
            className={monthIndex > 0 ? "hidden lg:block" : undefined}
          />
        ))}
      </div>

      {/* --- legend --- */}
      {hasSeasonData && (
        <div className={cx("mt-6 flex flex-wrap items-center justify-center gap-8 border-t pt-5", t.rule)}>
          <p className={cx("flex items-center gap-2.5 text-label", t.legend)}>
            <span aria-hidden="true" className={cx("size-5 rounded-full border-2", t.inSeason)} />
            Good season
          </p>
          <p className={cx("flex items-center gap-2.5 text-label", t.legend)}>
            <span aria-hidden="true" className={cx("size-5 rounded-full border-2", t.offSeason)} />
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
  t,
  className,
}: {
  year: number;
  month: number;
  today: Date;
  value?: string;
  onChange: (isoDate: string) => void;
  bestMonths?: string[];
  t: Tone;
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
            className={cx("pb-2 text-center text-caption font-medium uppercase tracking-[0.06em]", t.weekday)}
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
                  isPast && cx("cursor-not-allowed", t.past),
                  !isPast && !isSelected && cx("border-2", t.hover),
                  !isPast && !isSelected && hasSeasonData
                    ? cx(inSeason ? t.inSeason : t.offSeason, t.day)
                    : !isPast && !isSelected
                      ? cx("border-transparent", t.day)
                      : "",
                  isSelected && cx("border-2 font-semibold", t.selected),
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
