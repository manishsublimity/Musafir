"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Scene } from "@/components/media/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, ScrollTrigger, ensureGsap, prefersReducedMotion } from "@/lib/motion";
import type { SceneArchetype } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * SECTION 07 — ADVENTURES WORTH CHASING
 *
 * Motion identity: *the reel*. The section pins and the panels move sideways
 * under a fixed frame, one full viewport at a time, with a single enormous word
 * per panel. It is the only pinned section on the page — pinning twice would
 * make the homepage feel stuck rather than cinematic.
 *
 * Under reduced motion the pin is never created and the panels simply stack
 * vertically, which is a complete, readable version of the same content.
 */

export interface ReelPanel {
  slug: string;
  name: string;
  destinationName: string;
  words: [string, string, string];
  scene: SceneArchetype;
  summary: string;
}

export function AdventureReel({ panels }: { panels: ReelPanel[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const pinTarget = section?.querySelector<HTMLElement>("[data-pin-target]");
    if (!section || !track || !pinTarget) return;
    if (prefersReducedMotion()) return;
    // Horizontal pinning on a narrow screen fights the browser's own gestures;
    // the stacked layout is the better mobile experience anyway.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const gsap = ensureGsap();
    const context = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          // Pin a dedicated wrapper — never the <section>, which React owns
          // and would later fail to remove once ScrollTrigger had wrapped it
          // in a .pin-spacer, and never the track, which carries the x tween.
          pin: pinTarget,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each panel's word stack rises as that panel reaches centre frame.
      const panelEls = gsap.utils.toArray<HTMLElement>("[data-reel-panel]");
      panelEls.forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll("[data-reel-word]"),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: EASE.expo,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 72%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, section);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [panels.length]);

  return (
    <section
      ref={sectionRef}
      aria-label="Adventures worth chasing"
      className="theme-sand relative overflow-hidden bg-background text-text"
    >
      <div data-pin-target className="relative md:h-[100svh] md:overflow-hidden">
      <div
        ref={trackRef}
        className={cx(
          "flex flex-col md:h-[100svh] md:w-max md:flex-row md:will-change-transform",
        )}
      >
        <IntroPanel />

        {panels.map((panel) => (
          <article
            key={panel.slug}
            data-reel-panel
            className="relative flex h-[85svh] w-full shrink-0 flex-col justify-end overflow-hidden md:h-[100svh] md:w-screen"
          >
            <Scene scene={panel.scene} seed={`reel-${panel.slug}`} className="absolute inset-0" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent"
            />

            <div className="container-editorial relative z-[2] pb-16 md:pb-24">
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-muted">
                {panel.destinationName}
              </p>

              <p className="mt-6" aria-label={panel.words.join(" ")}>
                {panel.words.map((word) => (
                  <span key={word} className="mask-line" aria-hidden="true">
                    <span
                      data-reel-word
                      className="block font-[family-name:var(--font-display)] text-display leading-[0.82] text-text-strong"
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </p>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-h3 text-text-strong">{panel.name}</h3>
                  <p className="mt-3 text-body text-muted">{panel.summary}</p>
                </div>
                <Link
                  href={`/experiences/${panel.slug}`}
                  data-cta
                  className="group/reel inline-flex h-14 items-center gap-3 rounded-pill border border-border-strong px-7 text-label font-semibold text-text-strong transition-colors duration-[--duration-fast] hover:bg-text hover:text-background"
                >
                  See this experience
                  <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/reel:translate-x-1" fill="none" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}

        <OutroPanel />
      </div>
      </div>
    </section>
  );
}

function IntroPanel() {
  return (
    <div className="relative flex h-[60svh] w-full shrink-0 items-center overflow-hidden md:h-[100svh] md:w-screen">
      <Scene scene="aurora" seed="reel-intro" className="absolute inset-0" />
      <span aria-hidden="true" className="absolute inset-0 bg-background/80" />
      <div className="container-editorial relative z-[2]">
        <p className="flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-muted">
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          Experiences
        </p>
        <h2 className="mt-6 max-w-3xl text-h1 text-text-strong">
          Some things you do not book. You go and get them.
        </h2>
        <p className="mt-6 max-w-lg text-lede text-muted">
          The handful of days people actually talk about afterwards — and what each one really
          takes, told honestly.
        </p>
        <p className="mt-10 hidden items-center gap-3 text-caption uppercase tracking-[0.16em] text-muted md:flex">
          Keep scrolling
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </div>
    </div>
  );
}

function OutroPanel() {
  return (
    <div className="relative flex h-[70svh] w-full shrink-0 items-center overflow-hidden bg-surface md:h-[100svh] md:w-screen">
      <div className="container-editorial relative z-[2] text-center">
        <h2 className="mx-auto max-w-3xl text-h1 text-text-strong">
          Every one of these sits inside a real itinerary.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lede text-muted">
          Pick the experience first and we will build the days around it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/experiences" size="lg" arrow>
            Explore adventure packages
          </ButtonLink>
          <ButtonLink href="/plan-my-trip" variant="outline" size="lg">
            Plan my trip
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
