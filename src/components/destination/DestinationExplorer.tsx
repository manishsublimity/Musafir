"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Scene } from "@/components/media/Scene";
import { EmptyState } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  ENTRY_TYPE_LABELS,
  formatCompactINR,
  MONTH_ORDER,
  monthLabel,
  REGION_LABELS,
  STYLE_LABELS,
} from "@/lib/format";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * DESTINATION DISCOVERY
 *
 * Filters are applied as hard constraints and combined with AND, which is what
 * people expect and what most travel filters get wrong. The result count is
 * always visible so an over-constrained search is obvious before the traveller
 * concludes we do not sell anything.
 *
 * Map mode plots the results by coordinate rather than drawing borders — the
 * same decision as the homepage, for the same reason.
 */

type Mode = "grid" | "map";

const BUDGETS = [
  { id: "any", label: "Any budget", max: Number.POSITIVE_INFINITY },
  { id: "under-50k", label: "Under ₹50K", max: 50000 },
  { id: "50k-1l", label: "₹50K – ₹1L", max: 100000 },
  { id: "1l-2l", label: "₹1L – ₹2L", max: 200000 },
];

const DURATIONS = [
  { id: "any", label: "Any length", test: () => true },
  { id: "short", label: "Up to 5 days", test: (d: DestinationCard) => parseInt(d.durationLabel) <= 5 },
  { id: "week", label: "6 – 8 days", test: (d: DestinationCard) => parseInt(d.durationLabel) >= 6 && parseInt(d.durationLabel) <= 8 },
  { id: "long", label: "9+ days", test: (d: DestinationCard) => parseInt(d.durationLabel) >= 9 },
];

export function DestinationExplorer({ destinations }: { destinations: DestinationCard[] }) {
  const [mode, setMode] = useState<Mode>("grid");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("any");
  const [style, setStyle] = useState("any");
  const [budget, setBudget] = useState("any");
  const [duration, setDuration] = useState("any");
  const [season, setSeason] = useState("any");
  const [visaFree, setVisaFree] = useState(false);

  const regions = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.region))),
    [destinations],
  );
  const styles = useMemo(
    () => Array.from(new Set(destinations.flatMap((d) => d.styles))),
    [destinations],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const budgetMax = BUDGETS.find((b) => b.id === budget)?.max ?? Number.POSITIVE_INFINITY;
    const durationTest = DURATIONS.find((d) => d.id === duration)?.test ?? (() => true);

    return destinations.filter((d) => {
      if (q && !`${d.name} ${d.country} ${d.tagline}`.toLowerCase().includes(q)) return false;
      if (region !== "any" && d.region !== region) return false;
      if (style !== "any" && !d.styles.includes(style)) return false;
      if (d.startingPrice > budgetMax) return false;
      if (!durationTest(d)) return false;
      if (season !== "any" && !d.seasonLabel.toLowerCase().includes(season.toLowerCase())) return false;
      if (visaFree && d.entryType !== "visa-free" && d.entryType !== "visa-on-arrival") return false;
      return true;
    });
  }, [destinations, query, region, style, budget, duration, season, visaFree]);

  const reset = () => {
    setQuery("");
    setRegion("any");
    setStyle("any");
    setBudget("any");
    setDuration("any");
    setSeason("any");
    setVisaFree(false);
  };

  return (
    <div className="container-editorial relative z-[2] pb-[clamp(4rem,8vw,7rem)]">
      {/* ------------------------------------------------------- toolbar */}
      <div className="sticky top-16 z-30 -mx-[clamp(1.25rem,5vw,4rem)] mt-12 border-y border-border bg-background/95 px-[clamp(1.25rem,5vw,4rem)] py-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[14rem] flex-1 items-center gap-2 rounded-pill border border-border bg-surface px-4">
            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <label htmlFor="dest-search" className="sr-only">
              Search destinations
            </label>
            <input
              id="dest-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations"
              className="h-11 w-full bg-transparent text-label outline-none placeholder:text-muted"
            />
          </div>

          <Select label="Region" value={region} onChange={setRegion}>
            <option value="any">Any region</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {REGION_LABELS[r] ?? r}
              </option>
            ))}
          </Select>

          <Select label="Trip style" value={style} onChange={setStyle}>
            <option value="any">Any style</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {STYLE_LABELS[s] ?? s}
              </option>
            ))}
          </Select>

          <Select label="Duration" value={duration} onChange={setDuration}>
            {DURATIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </Select>

          <Select label="Budget" value={budget} onChange={setBudget}>
            {BUDGETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </Select>

          <Select label="Season" value={season} onChange={setSeason}>
            <option value="any">Any month</option>
            {MONTH_ORDER.map((m) => (
              <option key={m} value={monthLabel(m)}>
                {monthLabel(m)}
              </option>
            ))}
          </Select>

          <button
            type="button"
            aria-pressed={visaFree}
            onClick={() => {
              setVisaFree((v) => !v);
              track("filter_used", { filter: "visa-free", value: String(!visaFree) });
            }}
            className={cx(
              "h-11 rounded-pill border px-4 text-label font-medium transition-colors duration-[--duration-fast]",
              visaFree
                ? "border-primary bg-primary text-primary-contrast"
                : "border-border text-muted hover:border-border-strong hover:text-text",
            )}
          >
            Easy entry only
          </button>

          <div
            role="group"
            aria-label="View mode"
            className="ml-auto flex rounded-pill border border-border p-1"
          >
            {(["grid", "map"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={cx(
                  "h-9 rounded-pill px-4 text-label font-medium capitalize transition-colors duration-[--duration-fast]",
                  mode === m ? "bg-primary text-primary-contrast" : "text-muted hover:text-text",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="mt-3 text-label text-muted">
          {results.length} of {destinations.length} destinations
        </p>
      </div>

      {/* -------------------------------------------------------- results */}
      {results.length === 0 ? (
        <EmptyState
          className="mt-16"
          title="We couldn't find that exact journey."
          body="Those filters together rule everything out. Loosen one — usually budget or season — or tell us what you are after and we will build it."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="h-12 rounded-pill border border-border-strong px-6 text-label font-semibold"
              >
                Clear filters
              </button>
              <ButtonLink href="/plan-my-trip" arrow>
                Plan my trip
              </ButtonLink>
            </div>
          }
        />
      ) : mode === "grid" ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination) => (
            <li key={destination.slug}>
              <Link
                href={`/destinations/${destination.slug}`}
                onClick={() => track("destination_viewed", { destination: destination.slug, source: "explorer" })}
                className="group/card flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,transform] duration-[--duration-base] ease-[--ease-expo] hover:-translate-y-1 hover:border-border-strong"
              >
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Scene
                    scene={destination.scene}
                    palette={destination.palette}
                    seed={`explore-${destination.slug}`}
                    scrim="bottom"
                    className="size-full transition-transform duration-[900ms] ease-[--ease-expo] group-hover/card:scale-[1.06]"
                  />
                  {destination.entryType && (
                    <span className="absolute left-4 top-4 rounded-pill bg-background/80 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.08em] text-text-strong backdrop-blur-sm">
                      {ENTRY_TYPE_LABELS[destination.entryType]}
                    </span>
                  )}
                </span>

                <span className="flex flex-1 flex-col p-6">
                  <span className="text-caption uppercase tracking-[0.12em] text-muted">
                    {destination.domestic ? "India" : destination.country}
                  </span>
                  <span className="mt-2 text-h3">{destination.name}</span>
                  <span className="mt-2 text-label text-muted">{destination.tagline}</span>

                  <span className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <span className="text-label text-muted">
                      {destination.durationLabel}
                      <span className="mt-1 block text-caption">{destination.seasonLabel}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-caption uppercase tracking-[0.1em] text-muted">From</span>
                      <span className="mt-1 block text-price font-semibold text-text-strong">
                        {formatCompactINR(destination.startingPrice)}
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <MapMode results={results} />
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s/g, "-")}`;
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          track("filter_used", { filter: label, value: e.target.value });
        }}
        className="h-11 rounded-pill border border-border bg-surface px-4 text-label text-text outline-none transition-colors duration-[--duration-fast] focus-visible:border-primary"
      >
        {children}
      </select>
    </>
  );
}

/**
 * Map mode: results on the left, plotted points on the right. Points come from
 * a rough region centroid rather than precise coordinates, which is honest
 * about what this view is for — orientation, not navigation.
 */
function MapMode({ results }: { results: DestinationCard[] }) {
  const REGION_POINT: Record<string, { x: number; y: number }> = {
    india: { x: 70, y: 52 },
    asia: { x: 78, y: 55 },
    "middle-east": { x: 62, y: 48 },
    europe: { x: 51, y: 30 },
    scandinavia: { x: 53, y: 18 },
    africa: { x: 54, y: 66 },
    oceania: { x: 88, y: 80 },
    americas: { x: 25, y: 45 },
  };

  const [active, setActive] = useState(results[0]?.slug);

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <ul className="max-h-[70svh] space-y-3 overflow-y-auto pr-2">
        {results.map((destination) => (
          <li key={destination.slug}>
            <Link
              href={`/destinations/${destination.slug}`}
              onMouseEnter={() => setActive(destination.slug)}
              onFocus={() => setActive(destination.slug)}
              className={cx(
                "flex items-center gap-4 rounded-md border p-3 transition-colors duration-[--duration-fast]",
                active === destination.slug ? "border-primary bg-primary/6" : "border-border hover:border-border-strong",
              )}
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-sm">
                <Scene
                  scene={destination.scene}
                  palette={destination.palette}
                  seed={`map-${destination.slug}`}
                  className="size-full"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{destination.name}</span>
                <span className="block truncate text-label text-muted">
                  {REGION_LABELS[destination.region]} · from {formatCompactINR(destination.startingPrice)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sticky top-40 rounded-lg border border-border bg-surface p-5">
        <svg viewBox="0 0 100 100" className="h-auto w-full" role="img" aria-label="Destinations plotted by region">
          <g stroke="currentColor" strokeWidth="0.1" opacity="0.12">
            {[20, 40, 60, 80].map((v) => (
              <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} />
            ))}
            {[20, 40, 60, 80].map((v) => (
              <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" />
            ))}
          </g>
          {results.map((destination, i) => {
            const base = REGION_POINT[destination.region] ?? { x: 50, y: 50 };
            // Deterministic fan-out so co-located destinations do not stack.
            const angle = (i * 137.5 * Math.PI) / 180;
            const radius = 4 + (i % 3) * 2.5;
            const x = base.x + Math.cos(angle) * radius;
            const y = base.y + Math.sin(angle) * radius;
            const isActive = destination.slug === active;
            return (
              <g key={destination.slug}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 2 : 1.2}
                  fill={isActive ? "var(--color-primary)" : "var(--color-muted)"}
                  className="transition-all duration-[--duration-base]"
                />
                {isActive && (
                  <text x={x + 3} y={y + 1} fontSize="3.2" fill="currentColor" className="select-none">
                    {destination.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <p className="mt-4 text-caption text-muted">
          Positions are indicative regional groupings, not survey coordinates.
        </p>
      </div>
    </div>
  );
}
