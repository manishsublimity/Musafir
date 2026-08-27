"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Scene } from "@/components/media/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Primitives";
import {
  INDIA_CATEGORIES,
  project,
  type IndiaCategory,
  type IndiaPoint,
} from "@/content/india-map";
import { formatCompactINR } from "@/lib/format";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * SECTION 05 — DOMESTIC DESTINATIONS
 *
 * Motion identity: *the pin drop*. A coordinate map where hovering a point
 * pulses a ring, draws its label, and swaps a preview panel — nothing scrolls,
 * nothing slides. It reads as an instrument, which is deliberately the opposite
 * of the cinematic rails around it.
 */
export function DomesticMap({
  points,
  destinations,
}: {
  points: IndiaPoint[];
  destinations: DestinationCard[];
}) {
  const [category, setCategory] = useState<IndiaCategory | "all">("all");
  const [activeSlug, setActiveSlug] = useState<string>(points[0]?.slug ?? "");

  const visible = useMemo(
    () => (category === "all" ? points : points.filter((p) => p.categories.includes(category))),
    [points, category],
  );

  const byId = useMemo(
    () => new Map(destinations.map((d) => [d.slug, d])),
    [destinations],
  );

  // If a filter hides the active point, fall back to the first visible one so
  // the preview panel is never showing something the map no longer displays.
  const active = visible.some((p) => p.slug === activeSlug)
    ? byId.get(activeSlug)
    : byId.get(visible[0]?.slug ?? "");
  const activePoint = visible.find((p) => p.slug === active?.slug) ?? visible[0];

  return (
    <section
      aria-label="Destinations in India"
      className="theme-sand grain relative bg-background py-[clamp(4rem,9vw,8.5rem)] text-text"
    >
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Closer to home"
            title="India, in eight very different directions."
            lede="No flights over oceans, no visa queues — and landscapes that hold their own against anywhere we send people."
            action={
              <ButtonLink href="/domestic-holidays" variant="secondary" arrow still>
                Explore India
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by travel style">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </FilterChip>
          {INDIA_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-lg border border-border bg-surface/80 p-4 sm:p-8">
            <svg
              viewBox="0 0 100 100"
              className="h-auto w-full"
              role="img"
              aria-label="Map of Musafir destinations across India, plotted by coordinates"
            >
              <defs>
                <radialGradient id="india-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Graticule — real degree lines, not a decorative grid. */}
              <g stroke="currentColor" strokeWidth="0.12" opacity="0.14">
                {[0, 20, 40, 60, 80, 100].map((v) => (
                  <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} />
                ))}
                {[0, 20, 40, 60, 80, 100].map((v) => (
                  <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" />
                ))}
              </g>

              <circle cx="45" cy="50" r="46" fill="url(#india-glow)" />

              {/* Connective lines from the active point, drawn to its neighbours. */}
              {activePoint && (
                <g stroke="var(--color-primary)" strokeWidth="0.16" opacity="0.35" strokeDasharray="1.2 1.2">
                  {visible
                    .filter((p) => p.slug !== activePoint.slug)
                    .map((p) => {
                      const a = project(activePoint.lat, activePoint.lon);
                      const b = project(p.lat, p.lon);
                      return <line key={p.slug} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
                    })}
                </g>
              )}

              {visible.map((point) => {
                const { x, y } = project(point.lat, point.lon);
                const isActive = point.slug === activePoint?.slug;
                return (
                  <g key={point.slug}>
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r="1.6"
                        fill="var(--color-primary)"
                        opacity="0.6"
                        className="motion-loop"
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                          animation: "musafir-pulse-ring 2.4s var(--ease-smooth) infinite",
                        }}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 1.5 : 1}
                      fill={isActive ? "var(--color-primary)" : "var(--color-sand-300)"}
                      className="transition-all duration-[--duration-base] ease-[--ease-expo]"
                    />
                    <text
                      x={x + 2.4}
                      y={y + 0.9}
                      fontSize="2.4"
                      fill="currentColor"
                      opacity={isActive ? 1 : 0.55}
                      className="pointer-events-none select-none transition-opacity duration-[--duration-base]"
                    >
                      {point.label}
                    </text>
                    {/* Generous invisible hit area — the visible dot is far
                        smaller than a comfortable target. */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveSlug(point.slug)}
                      onClick={() => setActiveSlug(point.slug)}
                    />
                  </g>
                );
              })}
            </svg>

            <p className="mt-4 text-caption text-muted">
              Points plotted from actual coordinates. Not a survey map and not to scale.
            </p>
          </div>

          {/* Preview panel for the active point */}
          <aside aria-live="polite" className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
            {active ? (
              <>
                <div className="relative aspect-[16/10] shrink-0">
                  <Scene
                    scene={active.scene}
                    palette={active.palette}
                    seed={`india-${active.slug}`}
                    scrim="bottom"
                    className="size-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                      {activePoint?.anchor}
                    </p>
                    <h3 className="mt-1.5 text-h2 leading-[0.95] text-text-strong">{active.name}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-body text-muted">{active.tagline}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-border pt-5">
                    <Cell label="Ideal duration" value={active.durationLabel} />
                    <Cell label="Best season" value={active.seasonLabel} />
                    <Cell
                      label="Journeys"
                      value={active.packageCount ? String(active.packageCount) : "To order"}
                    />
                    <Cell label="From" value={formatCompactINR(active.startingPrice)} />
                  </dl>

                  <Link
                    href={`/destinations/${active.slug}`}
                    data-cta
                    className="group/link mt-auto flex items-center justify-between gap-3 rounded-pill border border-border px-5 py-3.5 text-label font-semibold transition-colors duration-[--duration-fast] hover:border-primary hover:text-primary"
                  >
                    Explore {active.name}
                    <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/link:translate-x-1" fill="none" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-10 text-center">
                <p className="text-body text-muted">
                  No destinations match that style yet. Try another filter.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "h-11 rounded-pill border px-4 text-label font-medium transition-[background-color,border-color,color] duration-[--duration-fast] ease-[--ease-expo]",
        active
          ? "border-primary bg-primary text-primary-contrast"
          : "border-border text-muted hover:border-border-strong hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-1 truncate text-label font-medium">{value}</dd>
    </div>
  );
}
