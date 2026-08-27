"use client";

import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { track } from "@/lib/analytics";
import { formatMoney, STYLE_LABELS } from "@/lib/format";
import type { PackageCard as PackageCardData } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * The package card used across listings, rails and recommendations.
 *
 * The whole card is one link with a single accessible name, rather than a card
 * containing several competing links — which is the pattern that makes travel
 * listings miserable to navigate with a keyboard or screen reader.
 */
export function PackageCard({
  data,
  className,
  layout = "vertical",
}: {
  data: PackageCardData;
  className?: string;
  layout?: "vertical" | "wide";
}) {
  return (
    <article className={cx("group/card h-full", className)}>
      <Link
        href={data.href}
        onClick={() => track("package_viewed", { package: data.slug, source: "card" })}
        className={cx(
          "flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,transform] duration-[--duration-base] ease-[--ease-expo] hover:border-border-strong",
          layout === "wide" && "sm:flex-row",
        )}
      >
        <div
          className={cx(
            "relative shrink-0 overflow-hidden",
            layout === "wide" ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[4/3]",
          )}
        >
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-[--ease-expo] group-hover/card:scale-[1.06]">
            <Scene
              scene={data.scene}
              palette={data.palette}
              seed={`pkg-${data.slug}`}
              scrim="bottom"
              className="size-full"
            />
          </div>
          <span className="sr-only">{data.alt}</span>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <span className="rounded-pill bg-background/80 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-text-strong backdrop-blur-sm">
              {data.days} Days / {data.nights} Nights
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
            {data.destinationName}
          </p>
          <h3 className="mt-2.5 text-h3 leading-tight">{data.title}</h3>

          {data.route.length > 1 && (
            <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-label text-muted">
              {data.route.map((city, i) => (
                <span key={city} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-primary/70">
                      →
                    </span>
                  )}
                  {city}
                </span>
              ))}
            </p>
          )}

          <ul className="mt-4 space-y-1.5">
            {data.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5 text-label text-muted">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <div>
              <p className="text-caption uppercase tracking-[0.1em] text-muted">From</p>
              <p className="mt-1 text-price font-semibold text-text-strong">
                {formatMoney({ amount: data.startingPrice, currency: "INR" })}
              </p>
              <p className="mt-0.5 text-caption text-muted">per person, twin sharing</p>
            </div>
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-text transition-[background-color,border-color,transform] duration-[--duration-base] ease-[--ease-expo] group-hover/card:translate-x-1 group-hover/card:border-primary group-hover/card:bg-primary group-hover/card:text-primary-contrast"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {data.styles.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
              {data.styles.slice(0, 3).map((style) => (
                <span
                  key={style}
                  className="rounded-pill border border-border px-2.5 py-1 text-caption uppercase tracking-[0.08em] text-muted"
                >
                  {STYLE_LABELS[style] ?? style}
                </span>
              ))}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
