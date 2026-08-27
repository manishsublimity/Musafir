"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShapeCard } from "@/components/cards/ShapeCard";
import { DottedPath, PinMark, PlayMark } from "@/components/ui/PlayMark";
import { DatePicker } from "./DatePicker";
import { STEPS, type StepDefinition, type StepOption } from "./steps";
import { track } from "@/lib/analytics";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * TRIP CUSTOMISER
 *
 * One question per screen, in the order defined by `steps.ts`, on the same
 * dark field and play-shape card language as the homepage entry point — so
 * clicking "Couple" there and landing here feels like one continuous flow
 * rather than a hand-off to a form.
 *
 * Three decisions worth noting:
 *
 * - Selection state is a single record keyed by step id, so a step can be
 *   inserted anywhere without touching the update logic.
 * - The destination and city steps take their options from real CMS data
 *   passed in as props, so the flow can never offer a place we do not sell.
 * - Nothing here submits. The final step hands the collected preferences to
 *   the enquiry form, so validation and rate limiting live in exactly one
 *   endpoint rather than being duplicated per step.
 */

export interface CityOption {
  id: string;
  label: string;
  destinationSlug: string;
  blurb?: string;
}

type Selection = Record<string, string[]>;

export function CustomizeFlow({
  destinations,
  cities,
  initialTravelWith,
}: {
  destinations: DestinationCard[];
  cities: CityOption[];
  /** Pre-selects step one so the homepage cards can deep-link into the flow. */
  initialTravelWith?: string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(initialTravelWith ? 1 : 0);
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>(
    initialTravelWith ? { travelWith: [initialTravelWith] } : {},
  );

  const step = STEPS[index];
  const chosenDestination = selection.destination?.[0];

  /** Options for the current step, from either the definition or CMS data. */
  const options: StepOption[] = useMemo(() => {
    if (step.id === "destination") {
      return destinations.map((d) => ({
        id: d.slug,
        label: d.name,
        blurb: d.tagline,
        scene: d.scene,
        image: d.image,
        imageAlt: d.alt,
      }));
    }
    if (step.id === "cities") {
      // Only cities inside the destination the traveller actually picked.
      return cities
        .filter((c) => !chosenDestination || c.destinationSlug === chosenDestination)
        .map((c) => ({ id: c.id, label: c.label, blurb: c.blurb }));
    }
    return step.options ?? [];
  }, [step, destinations, cities, chosenDestination]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const chosen = selection[step.id] ?? [];
  const canAdvance = step.optional || chosen.length > 0;
  const isLast = index === STEPS.length - 1;

  /** Steps without artwork render as compact pills instead of shape cards. */
  const isCompact = step.id === "duration";
  const isDateStep = step.id === "date";

  /** Season rings on the calendar come from the chosen destination's record. */
  const seasonMonths = destinations.find((d) => d.slug === chosenDestination)?.bestMonths;

  const paletteFor = (id: string) =>
    step.id === "destination" ? destinations.find((d) => d.slug === id)?.palette : undefined;

  const sceneFor = (option: StepOption) =>
    isCompact ? undefined : (option.scene ?? "island");

  function toggle(optionId: string) {
    setSelection((prev) => {
      const current = prev[step.id] ?? [];
      if (step.multi) {
        const next = current.includes(optionId)
          ? current.filter((v) => v !== optionId)
          : [...current, optionId];
        return { ...prev, [step.id]: next };
      }
      return { ...prev, [step.id]: [optionId] };
    });
    track("customize_option_changed", { step: step.id, value: optionId });
  }

  function advance() {
    track("customize_clicked", { step: step.id, index });
    if (isLast) {
      // Hand everything to the enquiry form as query params. Nothing is
      // submitted here — the enquiry endpoint owns validation.
      const params = new URLSearchParams();
      for (const [key, values] of Object.entries(selection)) {
        if (values.length) params.set(key, values.join(","));
      }
      router.push(`/enquiry?${params.toString()}`);
      return;
    }
    setQuery("");
    setIndex((i) => Math.min(STEPS.length - 1, i + 1));
  }

  function back() {
    setQuery("");
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="theme-sand grain relative isolate min-h-[100svh] overflow-hidden bg-background pb-44 pt-28 text-text">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 aspect-square w-[120vw] max-w-[1300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13]"
        style={{
          background: "radial-gradient(circle, var(--color-amber-400) 0%, transparent 62%)",
        }}
      />
      <span className="grain-layer" aria-hidden="true" />

      <DottedPath className="pointer-events-none absolute -left-8 top-24 -z-10 w-36 text-primary/35 md:w-52" />
      <PinMark className="pointer-events-none absolute right-8 top-28 -z-10 size-8 text-primary/30 md:right-16 md:size-10" />

      <div className="container-editorial relative z-[2]">
        <StepRail steps={STEPS} index={index} onJump={(i) => i < index && setIndex(i)} />

        <div className="mt-12 text-center">
          <p className="flex items-center justify-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-primary">
            <PlayMark className="size-4" />
            Step {index + 1} of {STEPS.length}
          </p>
          <h1 className="mt-5 text-h1 text-text-strong">{step.question}</h1>
          {step.lede && (
            <p className="mx-auto mt-4 max-w-xl text-lede text-muted">{step.lede}</p>
          )}
        </div>

        {step.searchable && (
          <div className="mx-auto mt-10 max-w-xl">
            <label htmlFor="customize-search" className="sr-only">
              {step.searchPlaceholder}
            </label>
            <div className="flex items-center gap-3 rounded-pill border border-border-strong bg-surface/80 px-5 backdrop-blur-xl transition-colors focus-within:border-primary">
              <svg
                viewBox="0 0 24 24"
                className="size-5 shrink-0 text-muted"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
                <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                id="customize-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={step.searchPlaceholder}
                className="h-14 w-full bg-transparent text-body text-text-strong outline-none placeholder:text-muted"
              />
            </div>
          </div>
        )}

        {isDateStep ? (
          <DatePicker
            value={chosen[0]}
            onChange={(isoDate) => {
              setSelection((prev) => ({ ...prev, date: [isoDate] }));
              track("customize_option_changed", { step: "date", value: isoDate });
            }}
            bestMonths={seasonMonths}
          />
        ) : filtered.length ? (
          <ul
            key={step.id}
            className={cx(
              "mx-auto mt-14 grid max-w-6xl",
              isCompact
                ? "max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
                : "grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8",
            )}
          >
            {filtered.map((option, i) => (
              <li
                key={option.id}
                // Staggered entrance, capped so a twelve-item month grid does
                // not take a second and a half to finish arriving.
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                className="motion-safe:animate-[musafir-card-in_520ms_var(--ease-expo)_both]"
              >
                {isCompact ? (
                  <CompactOption
                    label={option.label}
                    blurb={option.blurb}
                    note={option.note}
                    selected={chosen.includes(option.id)}
                    onToggle={() => toggle(option.id)}
                  />
                ) : (
                  <ShapeCard
                    label={option.label}
                    blurb={option.blurb}
                    note={option.note}
                    scene={sceneFor(option)}
                    palette={paletteFor(option.id)}
                    seed={`customize-${step.id}-${option.id}`}
                    selected={chosen.includes(option.id)}
                    onToggle={() => toggle(option.id)}
                    image={isCompact ? undefined : option.image}
                    imageAlt={option.imageAlt}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-16 text-center text-lede text-muted">
            Nothing matched that. Try a shorter search.
          </p>
        )}
      </div>

      {/* Sticky action bar. Always visible, so the traveller never has to hunt
          for the way forward at the bottom of a long grid. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/25 bg-background/92 backdrop-blur-xl">
        <div className="container-editorial flex items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden size-10 shrink-0 place-items-center rounded-full border border-primary/35 text-primary sm:grid">
              <PlayMark className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-caption uppercase tracking-[0.14em] text-muted">
                {step.question}
              </span>
              <span className="mt-0.5 block truncate text-label font-semibold text-text-strong">
                {chosen.length
                  ? isDateStep
                    ? // A date is far more useful echoed back than "1 selected".
                      new Date(chosen[0]).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : `${chosen.length} selected`
                  : step.optional
                    ? "Optional — skip if you are flexible"
                    : "Pick one to continue"}
              </span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="h-12 rounded-pill border border-border-strong px-5 text-label font-semibold transition-colors duration-[--duration-fast] hover:border-primary hover:text-primary"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={advance}
              disabled={!canAdvance}
              data-cta
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 text-label font-semibold text-primary-contrast transition-[filter,opacity] duration-[--duration-fast] hover:brightness-110 disabled:opacity-35"
            >
              <span className="hidden sm:inline">{step.cta}</span>
              <span className="sm:hidden">{isLast ? "Finish" : "Next"}</span>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Text-only option for the month and duration steps. */
function CompactOption({
  label,
  blurb,
  note,
  selected,
  onToggle,
}: {
  label: string;
  blurb?: string;
  note?: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cx(
        "group/opt relative flex h-full w-full flex-col items-start rounded-lg border p-5 text-left",
        "transition-[border-color,background-color,transform] duration-[--duration-fast] ease-[--ease-expo] hover:-translate-y-1",
        selected
          ? "border-primary bg-primary/12"
          : "border-border bg-surface/80 hover:border-primary/60",
      )}
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span className="text-h3 font-bold leading-none tracking-tight">{label}</span>
        <span
          aria-hidden="true"
          className={cx(
            "grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-contrast",
            "transition-[scale,opacity] duration-[--duration-fast] ease-[--ease-spring]",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none">
            <path
              d="m5 13 4.2 4.2L19 7.4"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      {blurb && <span className="mt-2.5 text-label text-muted">{blurb}</span>}

      {note && (
        <span className="mt-3 inline-block rounded-pill bg-primary/15 px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.1em] text-primary">
          {note}
        </span>
      )}
    </button>
  );
}

function StepRail({
  steps,
  index,
  onJump,
}: {
  steps: StepDefinition[];
  index: number;
  onJump: (i: number) => void;
}) {
  return (
    <ol className="mx-auto flex max-w-3xl items-center gap-2" aria-label="Progress">
      {steps.map((step, i) => {
        const done = i < index;
        const current = i === index;
        return (
          <li key={step.id} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={!done}
              aria-current={current ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${step.question}`}
              className={cx(
                "h-1.5 w-full rounded-pill transition-[background-color,opacity] duration-[--duration-base]",
                done && "bg-primary hover:opacity-75",
                current && "bg-primary",
                !done && !current && "bg-border-strong",
                !done && "cursor-default",
              )}
            />
          </li>
        );
      })}
    </ol>
  );
}
