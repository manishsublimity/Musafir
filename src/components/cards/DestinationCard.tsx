"use client";

import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { track } from "@/lib/analytics";
import { formatCompactINR, STYLE_LABELS } from "@/lib/format";
import type { DestinationCard as DestinationCardData } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * The tall cinematic destination card used in the trending rail.
 *
 * Its motion identity is *depth*: the artwork scales behind a fixed frame on
 * hover while the detail panel rises from below the fold of the card, so the
 * card feels like a window rather than a tile.
 */
export function DestinationCard({
  data,
  className,
  expanded = false,
}: {
  data: DestinationCardData;
  className?: string;
  expanded?: boolean;
}) {
  return (
    <article className={cx("group/dest relative h-full", className)}>
      <Link
        href={`/destinations/${data.slug}`}
        onClick={() => track("destination_viewed", { destination: data.slug, source: "rail" })}
        className="relative flex h-full flex-col justify-end overflow-hidden rounded-lg"
      >
        <div className="absolute inset-0 transition-transform duration-[1000ms] ease-[--ease-expo] group-hover/dest:scale-[1.07]">
          <Scene
            scene={data.scene}
            palette={data.palette}
            seed={`dest-${data.slug}`}
            className="size-full"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-[--duration-slow] group-hover/dest:from-background group-hover/dest:via-background/60"
        />
        <span className="sr-only">{data.alt}</span>

        <div className="relative z-[2] p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                {data.domestic ? "India" : data.country}
              </p>
              <h3 className="mt-2 text-h2 leading-[0.95] text-text-strong transition-transform duration-[--duration-slow] ease-[--ease-expo] group-hover/dest:-translate-y-1">
                {data.name}
              </h3>
            </div>
            <span
              aria-hidden="true"
              className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-border-strong text-text-strong transition-all duration-[--duration-base] ease-[--ease-expo] group-hover/dest:translate-x-1 group-hover/dest:border-primary group-hover/dest:bg-primary group-hover/dest:text-primary-contrast"
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

          {/* Package count is always visible — it is the strongest proof that
              the destination is actually offered, not just illustrated. */}
          <p className="mt-3 text-label text-muted">
            {data.packageCount > 0
              ? `${data.packageCount} ${data.packageCount === 1 ? "journey" : "journeys"} · from ${formatCompactINR(data.startingPrice)}`
              : data.tagline}
          </p>

          <div
            className={cx(
              "grid transition-[grid-template-rows,opacity] duration-[--duration-slow] ease-[--ease-expo]",
              expanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 group-hover/dest:grid-rows-[1fr] group-hover/dest:opacity-100 group-focus-within/dest:grid-rows-[1fr] group-focus-within/dest:opacity-100",
            )}
          >
            <div className="overflow-hidden">
              <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-border pt-5 text-muted">
                <Detail label="Best for" value={data.styles.slice(0, 2).map((s) => STYLE_LABELS[s] ?? s).join(" · ")} />
                <Detail label="Ideal duration" value={data.durationLabel} />
                <Detail label="Best season" value={data.seasonLabel} />
                <Detail label="Top experience" value={data.topExperience ?? "—"} />
              </dl>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-1 truncate text-label font-medium capitalize">{value}</dd>
    </div>
  );
}
