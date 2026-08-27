"use client";

import { useEffect, useRef, useState } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, SectionHead } from "@/components/ui/Primitives";
import { track } from "@/lib/analytics";
import { DURATION_LABELS } from "@/lib/format";
import { DURATION as D, EASE, gsap, prefersReducedMotion } from "@/lib/motion";
import type { PackageCard as PackageCardData } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * SECTION 06 — PACKAGES BY DURATION
 *
 * Motion identity: *the exchange*. Cards never blink out and reappear — the
 * outgoing set lifts and fades while the incoming set slides and scales into
 * place, so the change of tab reads as a deliberate swap.
 *
 * The animated indicator under the tabs is driven by measuring the active tab,
 * which keeps it correct at every breakpoint without hardcoded widths.
 */

const BUCKETS = ["2-3", "4-5", "6-7", "8-10", "11-14", "15+"] as const;
type Bucket = (typeof BUCKETS)[number];

export function PackagesByDuration({
  packagesByBucket,
}: {
  packagesByBucket: Record<string, PackageCardData[]>;
}) {
  // Open on the first bucket that actually has journeys in it.
  const firstPopulated = BUCKETS.find((b) => (packagesByBucket[b]?.length ?? 0) > 0) ?? "4-5";
  const [bucket, setBucket] = useState<Bucket>(firstPopulated);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const packages = packagesByBucket[bucket] ?? [];

  // Measure the active tab so the indicator tracks it responsively.
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const measure = () => {
      const active = container.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!active) return;
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [bucket]);

  // Animate the incoming set. The outgoing set is handled by React unmounting,
  // so this only has to stage the arrival.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const cards = Array.from(grid.children);
    if (!cards.length) return;

    const tween = gsap.fromTo(
      cards,
      { y: 32, scale: 0.97, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: D.slow * 0.75, stagger: 0.06, ease: EASE.expo },
    );
    return () => {
      tween.kill();
      gsap.set(cards, { clearProps: "all" });
    };
  }, [bucket]);

  return (
    <section
      aria-label="Packages by duration"
      className="theme-day grain relative bg-background py-[clamp(4rem,9vw,8.5rem)] text-text"
    >
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="However long you have"
            title="How many days can you actually take off?"
            lede="Start from the leave you have rather than the place you want. It is the constraint that decides everything else."
            action={
              <ButtonLink href="/packages" variant="secondary" arrow still>
                All packages
              </ButtonLink>
            }
          />
        </Reveal>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Trip duration"
          className="no-scrollbar relative mt-12 flex gap-1 overflow-x-auto border-b border-border pb-px"
        >
          {BUCKETS.map((b) => {
            const count = packagesByBucket[b]?.length ?? 0;
            const selected = b === bucket;
            return (
              <button
                key={b}
                role="tab"
                aria-selected={selected}
                aria-controls="duration-panel"
                id={`duration-tab-${b}`}
                disabled={count === 0}
                onClick={() => {
                  setBucket(b);
                  track("filter_used", { filter: "duration", value: b });
                }}
                className={cx(
                  "relative shrink-0 whitespace-nowrap px-5 py-4 text-label font-semibold transition-colors duration-[--duration-fast]",
                  selected ? "text-primary" : "text-muted hover:text-text",
                  count === 0 && "cursor-not-allowed opacity-35 hover:text-muted",
                )}
              >
                {DURATION_LABELS[b]}
                {count > 0 && (
                  <span className="ml-2 text-caption tabular-nums opacity-60">{count}</span>
                )}
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className="absolute bottom-0 h-0.5 bg-primary transition-[left,width] duration-[--duration-base] ease-[--ease-expo] motion-reduce:transition-none"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>

        <div
          id="duration-panel"
          role="tabpanel"
          aria-labelledby={`duration-tab-${bucket}`}
          className="mt-10"
        >
          {packages.length ? (
            <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.slug} data={pkg} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="We couldn't find that exact journey."
              body="Nothing sits in this length yet — but almost every itinerary can be shortened or extended. Tell us your dates and we will rebuild one around them."
              action={<ButtonLink href="/plan-my-trip" arrow>Plan my trip</ButtonLink>}
            />
          )}
        </div>
      </div>
    </section>
  );
}
