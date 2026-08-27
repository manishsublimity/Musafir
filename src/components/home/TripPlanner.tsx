"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Scene } from "@/components/media/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Primitives";
import { track } from "@/lib/analytics";
import { formatCompactINR, STYLE_LABELS } from "@/lib/format";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * SECTION 02 — TRIP PLANNER
 *
 * Motion identity: *response*. Nothing here scroll-animates; the section reacts
 * to the traveller instead. Changing the destination cross-fades the backdrop,
 * swaps the headline figures and re-sorts the nearby suggestions, all without a
 * navigation — so the planner feels like a tool rather than a form.
 */

const TRIP_TYPES = ["couple", "family", "friends", "solo", "luxury", "adventure"] as const;

const BUDGETS = [
  { id: "under-50k", label: "Under ₹50K" },
  { id: "50k-1l", label: "₹50K – ₹1L" },
  { id: "1l-2l", label: "₹1L – ₹2L" },
  { id: "2l-plus", label: "₹2L+" },
] as const;

export function TripPlanner({ destinations }: { destinations: DestinationCard[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState(destinations[0]?.slug ?? "");
  const [travellers, setTravellers] = useState(2);
  const [tripType, setTripType] = useState<string>("couple");
  const [budget, setBudget] = useState<string>("50k-1l");
  const [startDate, setStartDate] = useState("");

  const active = useMemo(
    () => destinations.find((d) => d.slug === slug) ?? destinations[0],
    [destinations, slug],
  );

  /** Suggestions are "more like this" — same region, excluding the current pick. */
  const nearby = useMemo(() => {
    if (!active) return [];
    const sameRegion = destinations.filter(
      (d) => d.slug !== active.slug && d.region === active.region,
    );
    const rest = destinations.filter(
      (d) => d.slug !== active.slug && d.region !== active.region,
    );
    return [...sameRegion, ...rest].slice(0, 4);
  }, [destinations, active]);

  if (!active) return null;

  const submit = () => {
    track("plan_trip_clicked", { source: "planner", destination: active.slug, tripType, budget });
    const params = new URLSearchParams({
      destination: active.slug,
      travellers: String(travellers),
      style: tripType,
      budget,
      ...(startDate ? { start: startDate } : {}),
    });
    router.push(`/plan-my-trip?${params.toString()}`);
  };

  return (
    <section
      id="plan"
      aria-label="Plan your trip"
      className="theme-sand grain relative isolate overflow-hidden bg-background py-[clamp(4rem,9vw,8rem)]"
    >
      {/* Backdrop cross-fades between destinations as the selection changes. */}
      <div className="absolute inset-0 -z-10">
        {destinations.map((destination) => (
          <div
            key={destination.slug}
            aria-hidden="true"
            className={cx(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-[--ease-expo] motion-reduce:transition-none",
              destination.slug === active.slug ? "opacity-100" : "opacity-0",
            )}
          >
            <Scene
              scene={destination.scene}
              palette={destination.palette}
              seed={`planner-${destination.slug}`}
              className="size-full"
            />
          </div>
        ))}
        <span aria-hidden="true" className="absolute inset-0 bg-background/85" />
      </div>
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <div className="max-w-2xl">
          <Eyebrow>Start here</Eyebrow>
          <h2 className="mt-5 text-h2">Where do you want to go?</h2>
          <p className="mt-5 text-lede text-muted">
            Tell us four things and we will come back with journeys that actually fit — not a
            catalogue to wade through.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="rounded-lg border border-border bg-surface/80 p-6 backdrop-blur-xl md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Going to" htmlFor="planner-destination">
                <select
                  id="planner-destination"
                  value={slug}
                  onChange={(event) => {
                    setSlug(event.target.value);
                    track("filter_used", { filter: "destination", value: event.target.value });
                  }}
                  className="h-12 w-full rounded-md border border-border bg-surface px-4 text-label text-text outline-none transition-colors duration-[--duration-fast] focus-visible:border-primary"
                >
                  <optgroup label="International">
                    {destinations
                      .filter((d) => !d.domestic)
                      .map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="India">
                    {destinations
                      .filter((d) => d.domestic)
                      .map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </Field>

              <Field label="Travel dates" htmlFor="planner-date">
                <input
                  id="planner-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-surface px-4 text-label text-text outline-none transition-colors duration-[--duration-fast] focus-visible:border-primary"
                />
              </Field>

              <Field label="Travellers" htmlFor="planner-travellers">
                <div className="flex h-12 items-center justify-between rounded-md border border-border bg-surface px-2">
                  <Stepper
                    label="Remove a traveller"
                    onClick={() => setTravellers((v) => Math.max(1, v - 1))}
                    disabled={travellers <= 1}
                  >
                    −
                  </Stepper>
                  <output id="planner-travellers" className="text-label font-semibold tabular-nums">
                    {travellers} {travellers === 1 ? "traveller" : "travellers"}
                  </output>
                  <Stepper
                    label="Add a traveller"
                    onClick={() => setTravellers((v) => Math.min(20, v + 1))}
                    disabled={travellers >= 20}
                  >
                    +
                  </Stepper>
                </div>
              </Field>

              <Field label="Budget per person" htmlFor="planner-budget">
                <select
                  id="planner-budget"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-surface px-4 text-label text-text outline-none transition-colors duration-[--duration-fast] focus-visible:border-primary"
                >
                  {BUDGETS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset className="mt-7">
              <legend className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                Trip type
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {TRIP_TYPES.map((type) => {
                  const selected = tripType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setTripType(type)}
                      className={cx(
                        "h-11 rounded-pill border px-4 text-label font-medium transition-[background-color,border-color,color] duration-[--duration-fast] ease-[--ease-expo]",
                        selected
                          ? "border-primary bg-primary text-primary-contrast"
                          : "border-border text-muted hover:border-border-strong hover:text-text",
                      )}
                    >
                      {STYLE_LABELS[type]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={submit}
                data-cta
                className="inline-flex h-14 items-center gap-2.5 rounded-pill bg-primary px-8 text-body font-semibold text-primary-contrast transition-[filter] duration-[--duration-fast] hover:brightness-110"
              >
                Show my trips
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="text-label text-muted">No payment, no obligation — just a real itinerary.</p>
            </div>
          </div>

          {/* Live preview of the chosen destination */}
          <aside
            aria-live="polite"
            className="rounded-lg border border-border bg-surface/80 p-6 backdrop-blur-xl md:p-8"
          >
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              {active.domestic ? "India" : active.country}
            </p>
            <h3 className="mt-2 text-h2 leading-[0.95]">{active.name}</h3>
            <p className="mt-3 text-body text-muted">{active.tagline}</p>

            <dl className="mt-7 space-y-4 border-t border-border pt-6">
              <Stat label="Ideal duration" value={active.durationLabel} />
              <Stat label="Best season" value={active.seasonLabel} />
              <Stat
                label="Journeys available"
                value={active.packageCount ? `${active.packageCount}` : "Built to order"}
              />
              <Stat label="Starting from" value={formatCompactINR(active.startingPrice)} emphasis />
            </dl>

            <ButtonLink
              href={`/destinations/${active.slug}`}
              variant="secondary"
              className="mt-7 w-full"
              arrow
              still
            >
              Explore {active.name}
            </ButtonLink>

            {nearby.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                  You might also like
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {nearby.map((suggestion) => (
                    <li key={suggestion.slug}>
                      <button
                        type="button"
                        onClick={() => setSlug(suggestion.slug)}
                        className="rounded-pill border border-border px-3.5 py-2 text-label text-muted transition-colors duration-[--duration-fast] hover:border-border-strong hover:text-text"
                      >
                        {suggestion.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-caption font-semibold uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Stepper({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-lede leading-none text-text transition-colors duration-[--duration-fast] hover:border-border-strong disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-label text-muted">{label}</dt>
      <dd
        className={cx(
          "text-right font-semibold",
          emphasis ? "text-price text-primary" : "text-label text-text",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
