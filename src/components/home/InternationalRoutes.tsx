"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Scene } from "@/components/media/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Primitives";
import { formatCompactINR, REGION_LABELS } from "@/lib/format";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * SECTION 08 — INTERNATIONAL HOLIDAYS
 *
 * Motion identity: *the route draw*. Flight paths arc out from Mumbai and draw
 * themselves in when a region is selected, using a stroke-dashoffset animation
 * — the same visual grammar the package itinerary map uses later, so a
 * traveller who reaches a package page already recognises the language.
 *
 * Like the India map, this plots real coordinates rather than drawing borders.
 */

/** Equirectangular projection onto a 100×100 field. */
function project(lat: number, lon: number) {
  return {
    x: Math.round(((lon + 180) / 360) * 1000) / 10,
    y: Math.round(((85 - lat) / 145) * 1000) / 10,
  };
}

const ORIGIN = { label: "Mumbai", ...project(19.08, 72.88) };

const REGIONS = [
  { id: "asia", anchor: "Bangkok", ...project(13.7, 100.5) },
  { id: "middle-east", anchor: "Dubai", ...project(25.2, 55.3) },
  { id: "europe", anchor: "Zurich", ...project(47.4, 8.5) },
  { id: "scandinavia", anchor: "Tromsø", ...project(69.6, 18.9) },
  { id: "africa", anchor: "Port Louis", ...project(-20.2, 57.5) },
  { id: "oceania", anchor: "Sydney", ...project(-33.9, 151.2) },
  { id: "americas", anchor: "New York", ...project(40.7, -74.0) },
] as const;

type RegionId = (typeof REGIONS)[number]["id"];

/** A gentle great-circle-ish arc. Straight lines read as diagrams, arcs as flights. */
function arcPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  // Perpendicular offset, scaled to distance so short hops bend less.
  const lift = Math.min(18, length * 0.22);
  const nx = -dy / (length || 1);
  const ny = dx / (length || 1);
  return `M ${from.x} ${from.y} Q ${(midX + nx * lift).toFixed(1)} ${(midY + ny * lift).toFixed(1)}, ${to.x} ${to.y}`;
}

export function InternationalRoutes({ destinations }: { destinations: DestinationCard[] }) {
  const available = useMemo(() => {
    const set = new Set(destinations.map((d) => d.region));
    return REGIONS.filter((r) => set.has(r.id));
  }, [destinations]);

  const [region, setRegion] = useState<RegionId>(available[0]?.id ?? "asia");

  const inRegion = useMemo(
    () => destinations.filter((d) => d.region === region),
    [destinations, region],
  );

  return (
    <section
      aria-label="International holiday destinations"
      className="theme-sand grain relative bg-background py-[clamp(4rem,9vw,8.5rem)] text-text"
    >
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Beyond India"
            title="Everywhere we send people, and how far it actually is."
            lede="Pick a region to see the routes, the flying time and what a trip there costs from India."
            action={
              <ButtonLink href="/international-holidays" variant="secondary" arrow still>
                International holidays
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="overflow-hidden rounded-lg border border-border bg-surface/80 p-4 sm:p-6">
            <svg
              viewBox="0 0 100 100"
              className="h-auto w-full"
              role="img"
              aria-label="Routes from India to the regions Musafir Travels operates in"
            >
              <g stroke="currentColor" strokeWidth="0.1" opacity="0.1">
                {[10, 30, 50, 70, 90].map((v) => (
                  <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} />
                ))}
                {[10, 30, 50, 70, 90].map((v) => (
                  <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" />
                ))}
              </g>

              {available.map((r) => {
                const isActive = r.id === region;
                const d = arcPath(ORIGIN, r);
                return (
                  <g key={r.id}>
                    <path
                      d={d}
                      fill="none"
                      stroke={isActive ? "var(--color-primary)" : "currentColor"}
                      strokeWidth={isActive ? 0.42 : 0.18}
                      opacity={isActive ? 1 : 0.22}
                      strokeLinecap="round"
                      strokeDasharray={isActive ? undefined : "1 1.4"}
                      className={cx(
                        "transition-[stroke-width,opacity] duration-[--duration-base]",
                        isActive && "route-draw",
                      )}
                    />
                    <circle
                      cx={r.x}
                      cy={r.y}
                      r={isActive ? 1.4 : 0.9}
                      fill={isActive ? "var(--color-primary)" : "var(--color-sand-300)"}
                      className="transition-all duration-[--duration-base] ease-[--ease-expo]"
                    />
                    <text
                      x={r.x + 2}
                      y={r.y - 1.4}
                      fontSize="2.3"
                      fill="currentColor"
                      opacity={isActive ? 1 : 0.5}
                      className="pointer-events-none select-none"
                    >
                      {REGION_LABELS[r.id]}
                    </text>
                    <circle
                      cx={r.x}
                      cy={r.y}
                      r="4"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setRegion(r.id)}
                      onClick={() => setRegion(r.id)}
                    />
                  </g>
                );
              })}

              <circle cx={ORIGIN.x} cy={ORIGIN.y} r="1.5" fill="var(--color-secondary)" />
              <text
                x={ORIGIN.x - 1}
                y={ORIGIN.y + 4}
                fontSize="2.3"
                fill="var(--color-secondary)"
                textAnchor="end"
                className="pointer-events-none select-none"
              >
                India
              </text>
            </svg>

            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose a region">
              {available.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={r.id === region}
                  onClick={() => setRegion(r.id)}
                  className={cx(
                    "h-10 rounded-pill border px-4 text-label font-medium transition-[background-color,border-color,color] duration-[--duration-fast]",
                    r.id === region
                      ? "border-primary bg-primary text-primary-contrast"
                      : "border-border text-muted hover:border-border-strong hover:text-text",
                  )}
                >
                  {REGION_LABELS[r.id]}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite">
            <h3 className="text-h3">{REGION_LABELS[region]}</h3>
            <p className="mt-2 text-label text-muted">
              {inRegion.length} {inRegion.length === 1 ? "destination" : "destinations"} we currently
              design trips to
            </p>

            <ul className="mt-6 space-y-3">
              {inRegion.map((destination) => (
                <li key={destination.slug}>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="group/row flex items-center gap-4 overflow-hidden rounded-md border border-border bg-surface p-3 transition-colors duration-[--duration-fast] hover:border-border-strong"
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-sm">
                      <Scene
                        scene={destination.scene}
                        palette={destination.palette}
                        seed={`intl-${destination.slug}`}
                        className="size-full"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{destination.name}</span>
                      <span className="block truncate text-label text-muted">
                        {destination.durationLabel} · from {formatCompactINR(destination.startingPrice)}
                      </span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4 shrink-0 text-muted transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/row:translate-x-1 group-hover/row:text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
