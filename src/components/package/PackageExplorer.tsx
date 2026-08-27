"use client";

import { useMemo, useState } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { EmptyState } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { DURATION_LABELS, STYLE_LABELS } from "@/lib/format";
import type { PackageCard as PackageCardData } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/** Filter toolbar + results grid, shared by every package listing page. */
export function PackageExplorer({ packages }: { packages: PackageCardData[] }) {
  const [style, setStyle] = useState("any");
  const [bucket, setBucket] = useState("any");
  const [hotel, setHotel] = useState("any");
  const [maxPrice, setMaxPrice] = useState<number>(Number.POSITIVE_INFINITY);
  const [sort, setSort] = useState("recommended");

  const styles = useMemo(
    () => Array.from(new Set(packages.flatMap((p) => p.styles))),
    [packages],
  );
  const buckets = useMemo(
    () => Array.from(new Set(packages.map((p) => p.durationBucket))),
    [packages],
  );
  const hotels = useMemo(
    () => Array.from(new Set(packages.map((p) => p.hotelCategory))),
    [packages],
  );

  const results = useMemo(() => {
    const filtered = packages.filter((p) => {
      if (style !== "any" && !p.styles.includes(style)) return false;
      if (bucket !== "any" && p.durationBucket !== bucket) return false;
      if (hotel !== "any" && p.hotelCategory !== hotel) return false;
      if (p.startingPrice > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.startingPrice - b.startingPrice);
      case "price-desc":
        return [...filtered].sort((a, b) => b.startingPrice - a.startingPrice);
      case "duration":
        return [...filtered].sort((a, b) => a.days - b.days);
      default:
        return filtered;
    }
  }, [packages, style, bucket, hotel, maxPrice, sort]);

  const reset = () => {
    setStyle("any");
    setBucket("any");
    setHotel("any");
    setMaxPrice(Number.POSITIVE_INFINITY);
  };

  return (
    <>
      <div className="sticky top-16 z-30 -mx-[clamp(1.25rem,5vw,4rem)] mt-12 border-y border-border bg-background/95 px-[clamp(1.25rem,5vw,4rem)] py-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <Select label="Travel style" value={style} onChange={setStyle}>
            <option value="any">Any style</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {STYLE_LABELS[s] ?? s}
              </option>
            ))}
          </Select>

          <Select label="Duration" value={bucket} onChange={setBucket}>
            <option value="any">Any duration</option>
            {buckets.map((b) => (
              <option key={b} value={b}>
                {DURATION_LABELS[b] ?? b}
              </option>
            ))}
          </Select>

          <Select label="Hotel category" value={hotel} onChange={setHotel}>
            <option value="any">Any stay</option>
            {hotels.map((h) => (
              <option key={h} value={h} className="capitalize">
                {h.replace("-", " ")}
              </option>
            ))}
          </Select>

          <Select
            label="Max price"
            value={String(maxPrice)}
            onChange={(v) => setMaxPrice(Number(v))}
          >
            <option value={String(Number.POSITIVE_INFINITY)}>Any price</option>
            <option value="50000">Under ₹50K</option>
            <option value="100000">Under ₹1L</option>
            <option value="200000">Under ₹2L</option>
          </Select>

          <Select label="Sort" value={sort} onChange={setSort} className="ml-auto">
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="duration">Duration</option>
          </Select>
        </div>

        <p aria-live="polite" className="mt-3 text-label text-muted">
          {results.length} of {packages.length} journeys
        </p>
      </div>

      {results.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((pkg) => (
            <PackageCard key={pkg.slug} data={pkg} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-16"
          title="We couldn't find that exact journey."
          body="Nothing matches all of those filters at once. Loosen one, or tell us what you had in mind and we will build it from scratch."
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
      )}
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const id = `pkg-filter-${label.toLowerCase().replace(/\s/g, "-")}`;
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
        className={cx(
          "h-11 rounded-pill border border-border bg-surface px-4 text-label text-text outline-none transition-colors duration-[--duration-fast] focus-visible:border-primary",
          className,
        )}
      >
        {children}
      </select>
    </>
  );
}
