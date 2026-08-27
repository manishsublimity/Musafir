"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger, withMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /** Positive drifts slower than the page, negative drifts faster. -1 → 1. */
  speed?: number;
  className?: string;
  /** Scales the child so the parallax travel never reveals an edge. */
  overscan?: boolean;
}

/**
 * A scroll-linked translate on a single layer.
 *
 * Only `transform` is animated and the trigger is scrubbed, which keeps this on
 * the compositor. Nothing here reads layout during scroll.
 */
export function Parallax({ children, speed = 0.2, className, overscan = true }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild;
    if (!inner) return;

    return withMotion(inner, (g) => {
      g.fromTo(
        inner,
        { yPercent: -speed * 12 },
        {
          yPercent: speed * 12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  }, [speed]);

  useEffect(() => {
    // Late-loading media changes element heights; one refresh after mount
    // catches the common case without polling.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div ref={ref} className={cx("overflow-hidden", className)}>
      <div
        className="h-full w-full will-change-transform"
        style={overscan ? { scale: 1 + Math.abs(speed) * 0.3 } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
