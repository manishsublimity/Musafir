"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Primitives";
import { ENTRY_TYPE_LABELS, formatCompactINR } from "@/lib/format";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * SECTION 04 — VISA-FREE & EASY ENTRY
 *
 * Motion identity: *the stamp*. Tiles sit at slight, deterministic rotations
 * like passport stamps and straighten as you reach them, and the detail panel
 * is inked in rather than slid in.
 *
 * The visa data itself is never asserted as timeless fact: each tile carries
 * the entry type from the CMS record, and the section footer carries the
 * disclaimer and a link to the full, source-cited visa pages.
 */
export function VisaFreeDestinations({ destinations }: { destinations: DestinationCard[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      aria-label="Visa-free and easy-entry destinations"
      className="theme-sand grain relative bg-background py-[clamp(4rem,9vw,8.5rem)] text-text"
    >
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Low friction"
            title="Just pack your bags."
            lede="Visa-free and easy-entry escapes for Indian passport holders — where the paperwork does not decide the holiday."
          />
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => {
            // Deterministic tilt: alternating, seeded by index so it never
            // changes between renders and never needs randomness.
            const tilt = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2][index % 6];
            const isActive = active === destination.slug;

            return (
              <li key={destination.slug}>
                <Link
                  href={`/destinations/${destination.slug}`}
                  onMouseEnter={() => setActive(destination.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(destination.slug)}
                  onBlur={() => setActive(null)}
                  style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
                  className={cx(
                    "group/stamp relative flex h-full flex-col rounded-md border-2 border-dashed border-border-strong bg-surface p-6",
                    "transition-[transform,border-color,box-shadow] duration-[--duration-base] ease-[--ease-spring]",
                    "rotate-[var(--tilt)] hover:rotate-0 hover:border-primary hover:shadow-[--shadow-lift] focus-visible:rotate-0",
                    "motion-reduce:rotate-0 motion-reduce:transition-none",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-h3 leading-tight">
                        {destination.name}
                      </h3>
                      <p className="mt-1 text-caption uppercase tracking-[0.12em] text-muted">
                        {destination.country}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-pill border border-primary/40 bg-primary/10 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.08em] text-primary">
                      {destination.entryType
                        ? ENTRY_TYPE_LABELS[destination.entryType]
                        : "Check rules"}
                    </span>
                  </div>

                  <div
                    className={cx(
                      "grid transition-[grid-template-rows,opacity] duration-[--duration-base] ease-[--ease-expo]",
                      isActive ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-5">
                        <Cell
                          label="Permitted stay"
                          value={destination.stayDays ? `${destination.stayDays} days` : "Varies"}
                        />
                        <Cell label="Ideal duration" value={destination.durationLabel} />
                        <Cell label="Best season" value={destination.seasonLabel} />
                        <Cell label="From" value={formatCompactINR(destination.startingPrice)} />
                      </dl>
                    </div>
                  </div>

                  <p className="mt-auto flex items-center gap-2 pt-6 text-label font-semibold text-primary">
                    Explore
                    <svg
                      viewBox="0 0 24 24"
                      className="size-3.5 transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/stamp:translate-x-1"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-label text-muted">
            Entry rules are set by each destination&rsquo;s government and change without notice.
            Every visa page on this site shows the official source and the date the rule was last
            verified — check it before you book.
          </p>
          <ButtonLink href="/visa" variant="secondary" arrow still>
            Visa assistance
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-1 text-label font-medium">{value}</dd>
    </div>
  );
}
