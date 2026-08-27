import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * MOTION SYSTEM
 *
 * The single place GSAP is registered and the only place timing values live in
 * JS. These mirror the CSS custom properties in `globals.css` exactly — if one
 * changes, change the other, or the site develops two motion personalities.
 */

let registered = false;

export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

/** Seconds, because GSAP works in seconds and CSS works in milliseconds. */
export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  cinematic: 1.4,
  route: 2.0,
} as const;

export const EASE = {
  smooth: "power2.out",
  expo: "expo.out",
  spring: "back.out(1.5)",
  inOut: "power3.inOut",
  /** Matches --ease-expo, cubic-bezier(0.16, 1, 0.3, 1). */
  editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/** The stagger the whole site uses for grouped reveals. */
export const STAGGER = { tight: 0.045, base: 0.08, loose: 0.12 } as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Wraps a timeline factory so that under reduced motion the elements are simply
 * made visible instead of animated. Every scroll-driven component in the site
 * goes through this, which is what makes the reduced-motion promise real rather
 * than aspirational.
 */
export function withMotion(
  targets: Element | Element[] | null,
  build: (g: typeof gsap) => gsap.core.Timeline | gsap.core.Tween | void,
): () => void {
  if (!targets) return () => {};

  if (prefersReducedMotion()) {
    const list = Array.isArray(targets) ? targets : [targets];
    gsap.set(list, { clearProps: "all", opacity: 1, x: 0, y: 0, scale: 1, clipPath: "none" });
    return () => {};
  }

  const g = ensureGsap();
  const ctx = gsap.context(() => {
    build(g);
  });
  return () => ctx.revert();
}

/** ScrollTrigger defaults used across the site so reveals feel consistent. */
export const SCROLL_START = "top 82%";
export const SCROLL_START_LATE = "top 92%";
