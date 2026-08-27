"use client";

import { useEffect, useRef, type ElementType } from "react";
import { DURATION, EASE, SCROLL_START, gsap, withMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";

interface SplitTextProps {
  /** Each string becomes one masked line. Line breaks are an editorial choice,
   *  not something to leave to the browser, so they are authored explicitly. */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Play immediately on mount rather than waiting for scroll — for heroes. */
  immediate?: boolean;
  duration?: number;
}

/**
 * The signature headline move: each line rises out from behind a mask.
 *
 * The full text is always present in the DOM as real text nodes — the mask is
 * an overflow-hidden wrapper, not a character-splitting hack — so screen
 * readers and search crawlers see an ordinary heading.
 */
export function SplitText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
  duration = DURATION.cinematic * 0.62,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = Array.from(el.querySelectorAll<HTMLElement>("[data-line-inner]"));
    if (!inner.length) return;

    return withMotion(inner, (g) => {
      g.fromTo(
        inner,
        { yPercent: 108, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: EASE.expo,
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start: SCROLL_START, once: true } }),
        },
      );
    });
  }, [delay, stagger, immediate, duration, lines]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={cx(className)} data-reveal="split">
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className={cx("mask-line", lineClassName)}>
          <span data-line-inner className="block will-change-transform">
            {/* The trailing space is invisible (the line is a block inside an
                overflow-hidden mask) but keeps the heading's accessible name
                from running the lines together as "beginningof your forever". */}
            {line}
            {i < lines.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
