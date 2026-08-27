"use client";

import { useEffect, useRef } from "react";
import { Scene } from "@/components/media/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * SECTION 14 — SEE YOURSELF THERE
 *
 * Motion identity: *the dissolve*. A single pinned frame in which four lines
 * replace each other as you scroll, the image slowly scaling behind them. No
 * cards, no grid, no chrome — the only section on the page with nothing to
 * click until the last line arrives.
 *
 * Under reduced motion the lines render as a plain stacked sequence, which
 * still reads as the same short piece of writing.
 */

const LINES = [
  "Imagine waking up here.",
  "Imagine this view, every morning.",
  "Imagine not checking the time once.",
  "Now make it real.",
];

export function SeeYourselfThere() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      const cta = section.querySelector("[data-cta-block]");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=" + window.innerHeight * 3,
          // Pin an inner element, never the <section> itself. ScrollTrigger
          // wraps whatever it pins in a .pin-spacer, and if that were the
          // section, React would later try to remove it from <main> while its
          // real parent had become the spacer — throwing "removeChild: the
          // node to be removed is not a child of this node" on navigation.
          pin: section.querySelector("[data-pin-target]"),
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      lines.forEach((line, index) => {
        timeline.fromTo(
          line,
          { opacity: 0, y: 34, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: EASE.expo },
          index * 1.4,
        );
        // Every line except the last dissolves again to make room.
        if (index < lines.length - 1) {
          timeline.to(
            line,
            { opacity: 0, y: -28, filter: "blur(6px)", duration: 0.8, ease: "power2.in" },
            index * 1.4 + 1.1,
          );
        }
      });

      // The image creeps closer for the whole sequence.
      timeline.fromTo(
        "[data-backdrop]",
        { scale: 1.02 },
        { scale: 1.16, ease: "none", duration: lines.length * 1.4 },
        0,
      );

      if (cta) {
        timeline.fromTo(
          cta,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: EASE.expo },
          (lines.length - 1) * 1.4 + 0.6,
        );
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="See yourself there"
      className="theme-sand relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background text-text"
    >
      <div data-pin-target className="relative flex min-h-[100svh] w-full items-center justify-center">
      <div data-backdrop className="absolute inset-0 will-change-transform">
        <Scene scene="beach" seed="see-yourself-there" className="size-full" />
      </div>
      <span aria-hidden="true" className="absolute inset-0 bg-background/70" />

      <div className="container-editorial relative z-[2] text-center">
        {/* Motion-enabled: lines are stacked and cross-faded in place.
            Reduced motion: they flow normally, one under another. */}
        <div className="relative mx-auto flex min-h-[6em] max-w-4xl flex-col items-center justify-center gap-6 motion-safe:block motion-safe:min-h-[4.5em]">
          {LINES.map((line, i) => (
            <p
              key={line}
              data-line
              className="font-[family-name:var(--font-display)] text-h1 leading-[1.05] text-text-strong motion-safe:absolute motion-safe:inset-0 motion-safe:flex motion-safe:items-center motion-safe:justify-center"
              style={{ zIndex: LINES.length - i }}
            >
              {line}
            </p>
          ))}
        </div>

        <div data-cta-block className="mt-14 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/plan-my-trip" size="lg" arrow>
            Start planning
          </ButtonLink>
          <ButtonLink href="/destinations" variant="outline" size="lg">
            Browse destinations
          </ButtonLink>
        </div>
      </div>
      </div>
    </section>
  );
}
