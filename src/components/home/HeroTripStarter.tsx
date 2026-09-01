"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Scene } from "@/components/media/Scene";
import { PlayMark } from "@/components/ui/PlayMark";
import { DatePicker } from "@/components/customize/DatePicker";
import { RoomPicker, decodeRooms } from "@/components/customize/RoomPicker";
import { STEPS, type StepOption } from "@/components/customize/steps";
import { track } from "@/lib/analytics";
import type { DestinationCard } from "@/lib/view-models";
import { AnimatePresence } from "motion/react";
import { CharacterStage, columnFor } from "@/components/character/CharacterStage";
import { SoloSelector } from "@/components/character/SoloSelector";
import { characterFor } from "@/components/character/characters";
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

  /**
   * The travelling party, once the answer resolves to one. Solo resolves only
   * after boy or girl, so there is a beat with Solo chosen and nobody on stage
   * — which is the point: the second question is what fills it.
   */
  const character = characterFor(selection.travelWith?.[0], selection.soloGender?.[0]);

  /** Steps with no artwork read better as pills than as picture cards. */
  const isTravelWith = step.id === "travelWith";
  const isPills = step.id === "duration";
  const isRooms = step.custom === "rooms";
  const isDate = step.custom === "date";
  /** Anything that cannot know when you are done needs an explicit commit. */
  const needsCta = step.multi || Boolean(step.custom) || isLast;

  const goTo = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setIndex(next);
    // Instant: a new step should already be at its first option when it slides
    // in, not glide there afterwards.
    railRef.current?.scrollTo({ left: 0, behavior: "auto" });
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

    // Changing who is coming along invalidates the boy/girl refinement — going
    // back from Solo to Couple and forward again should ask afresh.
    const updated: Selection = { ...selection, [step.id]: next };
    if (step.id === "travelWith" && optionId !== "SOLO") delete updated.soloGender;

    setSelection(updated);
    track("customize_option_changed", { step: step.id, value: optionId, source: "hero" });

    // Solo is the one answer that does not resolve on its own: it reveals the
    // boy/girl question instead of advancing, and that answer advances.
    if (step.id === "travelWith" && optionId === "SOLO") return;

    // Single-choice steps move on by themselves. The short delay lets the tick
    // register first, so the click never feels like it missed.
    if (!step.multi) window.setTimeout(() => advance(updated), 340);
  }

  function chooseSoloGender(gender: string) {
    const updated: Selection = { ...selection, soloGender: [gender] };
    setSelection(updated);
    track("customize_option_changed", { step: "soloGender", value: gender, source: "hero" });
    window.setTimeout(() => advance(updated), 340);
  }

  return (
    <>
      {/* The chosen party walks into the scene and stays for the rest of the
          flow, watching the cursor. It sits in the left gutter, standing on
          the far bank: the starter is bottom-anchored and its tallest step —
          the room picker — takes about 70% of the stage, so a centred figure
          has nowhere to stand. Desktop only; beside a full-width card on a
          phone there is no gutter to stand in. */}
      <CharacterStage
        character={character}
        className="pointer-events-none absolute bottom-[19%] left-0 z-[11] hidden items-end justify-center lg:flex"
      />

      <section
        aria-label="Start your trip"
        className="hero-trip-starter"
        data-direction={direction}
        // Width of the column the character occupies at the left, read from
        // the same function the stage sizes itself with so the two cannot
        // drift apart. Zero when nobody is on stage.
        style={{ "--character-column": character ? columnFor(character) : "0px" } as CSSProperties}
      >
        {/* Full-bleed rather than boxed: the questions sit straight on the
            footage, held legible by the stage's foot gradient instead of a card. */}
        <div className="w-full px-5 text-center md:px-10">
          {/* --- header --- */}
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 drop-shadow-[0_1px_10px_rgb(16_15_14/0.7)]">
            <p className="flex items-center gap-2.5 text-caption font-semibold uppercase tracking-[0.16em] text-amber-300">
              <PlayMark className="size-4" />
              Step {safeIndex + 1} of {steps.length}
            </p>

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
                className="rounded-pill border border-sand-50/40 px-3.5 py-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-sand-50 transition-colors duration-[--duration-fast] hover:bg-sand-50/10"
              >
                Back
              </button>
            )}
          </div>

          {/* --- question + body, re-keyed so the slide replays --- */}
          <div key={step.id} className="hero-trip-starter__panel">
            <h2 className="mt-3 text-h3 font-semibold text-sand-50 drop-shadow-[0_2px_18px_rgb(16_15_14/0.7)]">
              {step.question}
            </h2>

            {/* The room steppers and the calendar need a surface, but a solid
                cream card over the footage reads as a form pasted onto the
                picture. Frosted glass instead: it still lifts the control off
                the scene, and it belongs to the same family as the rest of the
                starter rather than interrupting it. */}
            {isRooms || isDate ? (
              <div className="mx-auto mt-4 max-h-[46vh] w-full max-w-lg overflow-y-auto text-left">
                {isRooms ? (
                  <RoomPicker
                    tone="glass"
                    value={chosen}
                    onChange={(encoded) =>
                      setSelection((prev) => ({ ...prev, rooms: encoded }))
                    }
                  />
                ) : (
                  <DatePicker
                    compact
                    tone="glass"
                    value={chosen[0]}
                    bestMonths={seasonMonths}
                    onChange={(isoDate) =>
                      setSelection((prev) => ({ ...prev, date: [isoDate] }))
                    }
                  />
                )}
              </div>
            ) : isPills ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
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
              <OptionRail railRef={railRef} label={step.question} count={options.length}>
                {options.map((option) => (
                  <MiniCard
                    key={option.id}
                    option={option}
                    selected={chosen.includes(option.id)}
                    onClick={() => choose(option.id)}
                  />
                ))}
              </OptionRail>
            )}

            {/* Solo asks one more thing before it can show anyone. */}
            <AnimatePresence>
              {isTravelWith && chosen[0] === "SOLO" && (
                <SoloSelector value={selection.soloGender?.[0]} onSelect={chooseSoloGender} />
              )}
            </AnimatePresence>

            {needsCta && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <p className="text-caption text-sand-100/80">
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
      </section>
    </>
  );
}

/**
 * Horizontal rail with a real slider affordance.
 *
 * The rail always scrolled, but with the scrollbar hidden there was nothing to
 * say so — eighteen destinations looked like six. Arrows and edge fades appear
 * only when the content genuinely overflows, and the track centres itself when
 * everything already fits, so a four-option step still reads as centred.
 */
function OptionRail({
  railRef,
  label,
  count,
  children,
}: {
  railRef: React.RefObject<HTMLDivElement | null>;
  label: string;
  /** Option count, so re-measuring keys off a primitive rather than the
      `children` array, whose identity changes on every parent render. */
  count: number;
  children: React.ReactNode;
}) {
  const [edges, setEdges] = useState({ overflowing: false, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // A pixel of slack: sub-pixel layout means scrollLeft rarely lands exactly
    // on the maximum, and a permanently-enabled arrow is worse than none.
    const max = el.scrollWidth - el.clientWidth;
    setEdges({
      overflowing: max > 1,
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft >= max - 1,
    });
  }, [railRef]);

  // Re-measure on mount, on step change (children), and whenever the stage is
  // resized — the same option count overflows at 1280 and fits at 1920.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, railRef, count]);

  const nudge = (by: number) => {
    const el = railRef.current;
    if (!el) return;
    // Instant, not smooth. The hero runs a rAF loop that reads layout every
    // frame, which starves Chrome's smooth-scroll animation: measured, a
    // smooth nudge sat still for ~750ms and then snapped to the target. A
    // click that appears to do nothing for three quarters of a second reads as
    // broken, so the rail steps immediately instead.
    el.scrollBy({ left: by * Math.max(el.clientWidth * 0.7, 200), behavior: "auto" });
  };

  return (
    // The band is inset by the character's column on BOTH sides, not just the
    // one it stands in. Insetting only the left would clear the figure but
    // shift every card right, and the rail would no longer share a centre with
    // the question above it — which is exactly what made the step look
    // off-centre. Symmetric insets cost some visible cards and buy a rail that
    // is centred on the same axis as everything else.
    <div
      className="relative mx-auto mt-4"
      style={{ width: "calc(100% - 2 * var(--character-column, 0px))" }}
    >
      <div
        ref={railRef}
        onScroll={measure}
        role="group"
        aria-label={label}
        tabIndex={edges.overflowing ? 0 : -1}
        className={cx(
          // No `scroll-smooth` here: the arrows pass `behavior: "smooth"`
          // themselves, and having both meant every programmatic scrollLeft
          // write animated too — including the reset between steps, which
          // should be instant.
          "no-scrollbar flex gap-3 overflow-x-auto px-1 pb-1",
          // Centre while everything fits; once it overflows, centring would
          // strand the first card off the left edge.
          edges.overflowing ? "justify-start" : "justify-center",
        )}
      >
        {children}
      </div>

      {edges.overflowing && (
        <>
          {/* Fades sit over the rail edges to signal "there is more this way". */}
          <span
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900/70 to-transparent transition-opacity duration-[--duration-base]",
              edges.atStart && "opacity-0",
            )}
          />
          <span
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900/70 to-transparent transition-opacity duration-[--duration-base]",
              edges.atEnd && "opacity-0",
            )}
          />

          <RailArrow side="left" disabled={edges.atStart} onClick={() => nudge(-1)} />
          <RailArrow side="right" disabled={edges.atEnd} onClick={() => nudge(1)} />
        </>
      )}
    </div>
  );
}

function RailArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Show previous options" : "Show more options"}
      className={cx(
        // 44px, so it stays a comfortable touch target on a phone.
        "absolute top-[42%] grid size-11 -translate-y-1/2 place-items-center rounded-full",
        "border border-sand-50/35 bg-ink-900/70 text-sand-50 backdrop-blur-md",
        "transition-[opacity,background-color,border-color] duration-[--duration-fast]",
        "hover:border-amber-400 hover:text-amber-300",
        "disabled:pointer-events-none disabled:opacity-0",
        side === "left" ? "left-0 md:-left-1" : "right-0 md:-right-1",
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path
          d={side === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
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
          // The cards sit straight on the footage now, so the label carries its
          // own shadow rather than relying on a card behind it.
          "drop-shadow-[0_1px_8px_rgb(16_15_14/0.85)]",
          selected ? "text-amber-300" : "text-sand-50 group-hover/mini:text-amber-300",
        )}
      >
        {option.label}
      </span>
    </button>
  );
}
