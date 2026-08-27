"use client";

import { useEffect, useState } from "react";
import { Scene } from "@/components/media/Scene";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { DURATION, EASE, gsap, withMotion } from "@/lib/motion";
import type { SceneArchetype } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * SECTION 01 — CINEMATIC HERO
 *
 * The hero's motion identity is *arrival*: the backdrop settles, the headline
 * masks upward line by line, and the location indicator lands last, as though
 * the page has just touched down somewhere.
 *
 * The backdrop cycles slowly through real destinations so the first impression
 * is of a company that goes to many places rather than of one stock photograph.
 * Swap `scene` for CMS-supplied video and the same component plays footage.
 */

interface Inspiration {
  place: string;
  country: string;
  scene: SceneArchetype;
  slug: string;
}

const INSPIRATIONS: Inspiration[] = [
  { place: "Bali", country: "Indonesia", scene: "forest", slug: "bali" },
  { place: "Maldives", country: "Maldives", scene: "island", slug: "maldives" },
  { place: "Kashmir", country: "India", scene: "mountain", slug: "kashmir" },
  { place: "Australia", country: "Australia", scene: "reef", slug: "australia" },
  { place: "Switzerland", country: "Switzerland", scene: "snow", slug: "switzerland" },
];

const CYCLE_MS = 6500;

export function CinematicHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // A slow cross-fade, paused whenever the tab is hidden so a backgrounded
    // page is not repainting a full-viewport SVG forever.
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden) setIndex((i) => (i + 1) % INSPIRATIONS.length);
        schedule();
      }, CYCLE_MS);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const stage = document.querySelector("[data-hero-stage]");
    if (!stage) return;
    return withMotion(stage, (g) => {
      g.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          stagger: 0.14,
          delay: 0.55,
          ease: EASE.expo,
        },
      );
      // The backdrop settles from a slight overscale — the "camera coming to
      // rest" that gives the section its cinematic read.
      g.fromTo(
        "[data-hero-backdrop]",
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: DURATION.cinematic * 1.4, ease: EASE.expo },
      );
    });
  }, []);

  const active = INSPIRATIONS[index];

  return (
    <section
      data-hero-stage
      aria-label="Musafir Travels"
      className="theme-sand relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-background pb-14 pt-32 md:pb-20"
    >
      <div data-hero-backdrop className="absolute inset-0">
        {INSPIRATIONS.map((item, i) => (
          <div
            key={item.slug}
            aria-hidden={i !== index}
            className={cx(
              "absolute inset-0 transition-opacity duration-[1800ms] ease-[--ease-expo] motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Scene scene={item.scene} seed={`hero-${item.slug}`} className="size-full" />
          </div>
        ))}
        {/* Two scrims: one for overall legibility, one weighted to the text side. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/50"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"
        />
      </div>

      <div className="container-editorial relative z-[2]">
        <div className="max-w-4xl">
          <p
            data-hero-fade
            className="flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-muted"
          >
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
            Personalised journeys since day one
          </p>

          <SplitText
            as="h1"
            immediate
            delay={0.25}
            lines={["Your next story", "starts somewhere else."]}
            className="mt-7 text-display text-text-strong"
          />

          <p data-hero-fade className="mt-8 max-w-xl text-lede text-muted">
            Curated journeys. Beautiful stays. Seamless experiences — designed around your dates,
            your pace and the way you actually like to travel.
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/packages" size="lg" arrow>
              Explore journeys
            </ButtonLink>
            <ButtonLink href="/plan-my-trip" variant="outline" size="lg">
              Plan my trip
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-8">
          <ScrollCue />

          <div data-hero-fade aria-live="polite" className="min-w-[13rem]">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-muted">
              Current inspiration
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-h3 text-text-strong">
              {active.place}
              <span className="text-muted/60"> · {active.country}</span>
            </p>
            <div className="mt-3 flex gap-1.5" role="tablist" aria-label="Choose a destination to preview">
              {INSPIRATIONS.map((item, i) => (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Preview ${item.place}`}
                  onClick={() => setIndex(i)}
                  className={cx(
                    "h-1 rounded-pill transition-all duration-[--duration-base] ease-[--ease-expo]",
                    i === index ? "w-10 bg-primary" : "w-4 bg-text/20 hover:bg-text/40",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollCue() {
  return (
    <a
      data-hero-fade
      href="#plan"
      className="group inline-flex items-center gap-4 text-caption font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-text-strong"
    >
      <span
        aria-hidden="true"
        className="relative block h-10 w-6 overflow-hidden rounded-pill border border-border-strong"
      >
        <span
          className="motion-loop absolute left-1/2 top-2 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sand-50"
          style={{ animation: "musafir-scroll-cue 2.2s var(--ease-smooth) infinite" }}
        />
      </span>
      Scroll to explore
    </a>
  );
}
