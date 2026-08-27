"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { DURATION, EASE, SCROLL_START, STAGGER, gsap, withMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";

type Variant = "rise" | "fade" | "clip" | "scale" | "slide-left" | "slide-right";

interface RevealProps {
  children: ReactNode;
  /** Which move this element makes as it enters. */
  variant?: Variant;
  /** Seconds of delay after the trigger fires. */
  delay?: number;
  /** When set, direct children are revealed one after another. */
  stagger?: boolean | number;
  duration?: number;
  as?: ElementType;
  className?: string;
  /** Overrides the ScrollTrigger start position. */
  start?: string;
  id?: string;
}

const FROM: Record<Variant, gsap.TweenVars> = {
  rise: { y: 40, opacity: 0 },
  fade: { opacity: 0 },
  clip: { clipPath: "inset(0 0 100% 0)", opacity: 1 },
  scale: { scale: 1.08, opacity: 0 },
  "slide-left": { x: 48, opacity: 0 },
  "slide-right": { x: -48, opacity: 0 },
};

const TO: Record<Variant, gsap.TweenVars> = {
  rise: { y: 0, opacity: 1 },
  fade: { opacity: 1 },
  clip: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
  scale: { scale: 1, opacity: 1 },
  "slide-left": { x: 0, opacity: 1 },
  "slide-right": { x: 0, opacity: 1 },
};

/**
 * The site's workhorse scroll reveal.
 *
 * `data-reveal` on the animated nodes is what the reduced-motion CSS block
 * targets, so content staged here is guaranteed to be visible even if the
 * JavaScript never runs.
 */
export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  stagger = false,
  duration,
  as: Tag = "div",
  className,
  start = SCROLL_START,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : [el];
    if (!targets.length) return;

    return withMotion(targets as Element[], (g) => {
      g.fromTo(targets, FROM[variant], {
        ...TO[variant],
        duration: duration ?? (variant === "clip" ? DURATION.slow : DURATION.slow * 0.9),
        delay,
        ease: EASE.expo,
        stagger: stagger ? (typeof stagger === "number" ? stagger : STAGGER.base) : 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    });
  }, [variant, delay, stagger, duration, start]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      className={cx(className)}
      data-reveal={variant}
    >
      {children}
    </Tag>
  );
}
