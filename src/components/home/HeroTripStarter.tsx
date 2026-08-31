"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Scene } from "@/components/media/Scene";
import { PlayMark } from "@/components/ui/PlayMark";
import { DatePicker } from "@/components/customize/DatePicker";
import { RoomPicker, decodeRooms } from "@/components/customize/RoomPicker";
import { STEPS, type StepOption } from "@/components/customize/steps";
import { track } from "@/lib/analytics";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * HERO TRIP STARTER
 *
 * The whole trip questionnaire, running inside the hero rather than on a
 * separate page. It arrives once the cinematic story has finished — after the
 * bazaar panel leaves — and holds for the rest of the scroll rig, so there is
 * time to actually use it.
 *
 * Every step runs here, including rooms and the departure date. The calendar
 * drops to a single month in this context: three months over a photograph is
 * more calendar than the space can carry. Only the final submit leaves, for
 * `/enquiry`, carrying every answer in the URL.
 *
 * Motion: each step slides in from the direction of travel, so progress reads
 * as forward movement and Back reads as reversal.
 */

export interface HeroCityOption {
  id: string;
  label: string;
  destinationSlug: string;
  blurb?: string;
}

type Selection = Record<string, string[]>;

export function HeroTripStarter({
  destinations,
  cities,
}: {
  destinations: DestinationCard[];
  cities: HeroCityOption[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selection, setSelection] = useState<Selection>({});
  const railRef = useRef<HTMLDivElement>(null);

  /** Steps whose guard passes for the answers so far. */
  const steps = useMemo(
    () => STEPS.filter((s) => !s.when || s.when(selection)),
    [selection],
  );

  const safeIndex = Math.min(index, steps.length - 1);
  const step = steps[safeIndex];
  const chosenDestination = selection.destination?.[0];
  const chosen = selection[step.id] ?? [];
  const isLast = safeIndex === steps.length - 1;

  const options: StepOption[] = useMemo(() => {
    if (step.id === "destination") {
      return destinations.map((d) => ({
        id: d.slug,
        label: d.name,
        blurb: d.tagline,
        scene: d.scene,
        image: d.image,
        imageAlt: d.alt,
        video: d.video,
      }));
    }
    if (step.id === "cities") {
      return cities
        .filter((c) => !chosenDestination || c.destinationSlug === chosenDestination)
        .map((c) => ({ id: c.id, label: c.label, blurb: c.blurb }));
    }
    return step.options ?? [];
  }, [step, destinations, cities, chosenDestination]);

  const seasonMonths = destinations.find((d) => d.slug === chosenDestination)?.bestMonths;

  /** Steps with no artwork read better as pills than as picture cards. */
  const isPills = step.id === "duration";
  const isRooms = step.custom === "rooms";
  const isDate = step.custom === "date";
  /** Anything that cannot know when you are done needs an explicit commit. */
  const needsCta = step.multi || Boolean(step.custom) || isLast;

  const goTo = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setIndex(next);
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  function finish(answers: Selection) {
    track("enquiry_started", { source: "hero-starter" });
    const params = new URLSearchParams();
    for (const [key, values] of Object.entries(answers)) {
      if (values?.length) params.set(key, values.join(","));
    }
    router.push(`/enquiry?${params.toString()}`);
  }

  function advance(answers: Selection = selection) {
    // Recompute against the answers being committed — choosing "Solo" removes
    // the rooms step, and the index must not run off the end.
    const visible = STEPS.filter((s) => !s.when || s.when(answers));
    if (safeIndex >= visible.length - 1) finish(answers);
    else goTo(safeIndex + 1, 1);
  }

  function choose(optionId: string) {
    const next = step.multi
      ? chosen.includes(optionId)
        ? chosen.filter((v) => v !== optionId)
        : [...chosen, optionId]
      : [optionId];

    const updated = { ...selection, [step.id]: next };
    setSelection(updated);
    track("customize_option_changed", { step: step.id, value: optionId, source: "hero" });

    // Single-choice steps move on by themselves. The short delay lets the tick
    // register first, so the click never feels like it missed.
    if (!step.multi) window.setTimeout(() => advance(updated), 340);
  }

  return (
    <section aria-label="Start your trip" className="hero-trip-starter" data-direction={direction}>
      <div className="container-editorial">
        <div className="mx-auto max-w-4xl rounded-xl border border-sand-50/22 bg-ink-900/60 p-5 shadow-[--shadow-float] backdrop-blur-2xl md:p-7">
          {/* --- header --- */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2.5 text-caption font-semibold uppercase tracking-[0.16em] text-amber-300">
              <PlayMark className="size-4" />
              Step {safeIndex + 1} of {steps.length}
            </p>

            <div className="flex items-center gap-3">
              <ol className="flex items-center gap-1.5" aria-label="Progress">
                {steps.map((s, i) => (
                  <li
                    key={s.id}
                    aria-current={i === safeIndex ? "step" : undefined}
                    className={cx(
                      "h-1.5 rounded-pill transition-all duration-[--duration-base] ease-[--ease-expo]",
                      i === safeIndex
                        ? "w-7 bg-amber-400"
                        : i < safeIndex
                          ? "w-3 bg-amber-400/70"
                          : "w-3 bg-sand-50/25",
                    )}
                  />
                ))}
              </ol>

              {safeIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goTo(safeIndex - 1, -1)}
                  className="rounded-pill border border-sand-50/30 px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-sand-50 transition-colors duration-[--duration-fast] hover:bg-sand-50/10"
                >
                  Back
                </button>
              )}
            </div>
          </div>

          {/* --- question + body, re-keyed so the slide replays --- */}
          <div key={step.id} className="hero-trip-starter__panel">
            <h2 className="mt-4 text-h3 font-semibold text-sand-50">{step.question}</h2>

            {/* The custom steps render on cream so the calendar and steppers
                stay legible; the card rails sit straight on the glass. */}
            {isRooms || isDate ? (
              <div className="theme-day mt-5 max-h-[46vh] overflow-y-auto rounded-lg bg-background p-4 text-text md:p-5">
                {isRooms ? (
                  <RoomPicker
                    value={chosen}
                    onChange={(encoded) =>
                      setSelection((prev) => ({ ...prev, rooms: encoded }))
                    }
                  />
                ) : (
                  <DatePicker
                    compact
                    value={chosen[0]}
                    bestMonths={seasonMonths}
                    onChange={(isoDate) =>
                      setSelection((prev) => ({ ...prev, date: [isoDate] }))
                    }
                  />
                )}
              </div>
            ) : isPills ? (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {options.map((option) => (
                  <Pill
                    key={option.id}
                    option={option}
                    selected={chosen.includes(option.id)}
                    onClick={() => choose(option.id)}
                  />
                ))}
              </div>
            ) : (
              <div
                ref={railRef}
                className="no-scrollbar -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-1"
              >
                {options.map((option) => (
                  <MiniCard
                    key={option.id}
                    option={option}
                    selected={chosen.includes(option.id)}
                    onClick={() => choose(option.id)}
                  />
                ))}
              </div>
            )}

            {needsCta && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-caption text-sand-100/70">
                  {isRooms
                    ? roomSummary(chosen)
                    : chosen.length
                      ? isDate
                        ? new Date(chosen[0]).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                          })
                        : `${chosen.length} selected`
                      : step.optional
                        ? "Optional — skip if you are flexible"
                        : "Pick as many as you like"}
                </p>

                <button
                  type="button"
                  disabled={!step.optional && !chosen.length && !isRooms}
                  onClick={() => advance()}
                  data-cta
                  className="inline-flex h-11 items-center gap-2 rounded-pill bg-amber-400 px-5 text-label font-semibold text-ink-900 transition-[filter,opacity] duration-[--duration-fast] hover:brightness-110 disabled:opacity-40"
                >
                  {isLast ? "See my journey" : step.cta}
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function roomSummary(encoded: string[]) {
  const rooms = decodeRooms(encoded);
  const adults = rooms.reduce((n, r) => n + r.adults, 0);
  const kids = rooms.reduce((n, r) => n + r.children, 0);
  return `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} · ${adults} ${
    adults === 1 ? "adult" : "adults"
  }${kids ? `, ${kids} ${kids === 1 ? "child" : "children"}` : ""}`;
}

/** Text-only option, for steps with no artwork. */
function Pill({
  option,
  selected,
  onClick,
}: {
  option: StepOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        "h-12 rounded-pill border px-5 text-label font-semibold transition-[background-color,border-color,color] duration-[--duration-fast]",
        selected
          ? "border-amber-400 bg-amber-400 text-ink-900"
          : "border-sand-50/30 text-sand-50 hover:border-amber-400 hover:text-amber-300",
      )}
    >
      {option.label}
    </button>
  );
}

/** Compact shape card sized for the hero strip. */
function MiniCard({
  option,
  selected,
  onClick,
}: {
  option: StepOption;
  selected: boolean;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  };
  const stop = () => videoRef.current?.pause();

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className="group/mini w-[7.5rem] shrink-0 text-left outline-offset-4 sm:w-[8.5rem]"
    >
      <span className="relative block aspect-[307/341] w-full">
        <span
          aria-hidden="true"
          className={cx(
            "play-shape-outer absolute inset-0 block transition-[background-color] duration-[--duration-base]",
            selected ? "bg-amber-400" : "bg-sand-50/45 group-hover/mini:bg-amber-400",
          )}
        />
        <span className="play-shape-inner absolute inset-0 block overflow-hidden bg-ink-800">
          {option.video && (
            <video
              ref={videoRef}
              className="absolute inset-0 z-[1] size-full object-cover opacity-0 transition-opacity duration-[--duration-base] group-hover/mini:opacity-100 motion-reduce:hidden"
              muted
              loop
              playsInline
              preload="none"
              poster={option.image}
              aria-hidden="true"
            >
              <source src={option.video} type="video/mp4" />
            </video>
          )}

          {option.image ? (
            <Image
              src={option.image}
              alt={option.imageAlt ?? ""}
              fill
              sizes="140px"
              className="object-cover transition-transform duration-[800ms] ease-[--ease-expo] group-hover/mini:scale-[1.08]"
            />
          ) : option.scene ? (
            <Scene
              scene={option.scene}
              seed={`hero-mini-${option.id}`}
              className="size-full transition-transform duration-[800ms] ease-[--ease-expo] group-hover/mini:scale-[1.08]"
            />
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className={cx(
            "absolute left-[4%] top-[8%] z-[3] grid size-6 place-items-center rounded-full bg-amber-400 text-ink-900",
            "transition-[scale,opacity] duration-[--duration-fast] ease-[--ease-spring]",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
            <path d="m5 13 4.2 4.2L19 7.4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>

      <span
        className={cx(
          "mt-2 block truncate text-label font-semibold transition-colors duration-[--duration-fast]",
          selected ? "text-amber-300" : "text-sand-50 group-hover/mini:text-amber-300",
        )}
      >
        {option.label}
      </span>
    </button>
  );
}
