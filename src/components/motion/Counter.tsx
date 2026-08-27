"use client";

import { useEffect, useRef } from "react";
import { EASE, SCROLL_START, withMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Indian digit grouping. Off for years and small counts. */
  grouped?: boolean;
}

/**
 * Counts up when it scrolls into view.
 *
 * The final value is rendered on the server and only replaced once the
 * animation starts, so the real number is in the HTML for crawlers and for
 * anyone whose JavaScript never arrives.
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
  grouped = true,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (value: number) =>
      grouped ? Math.round(value).toLocaleString("en-IN") : String(Math.round(value));

    return withMotion(el, (g) => {
      const state = { value: 0 };
      g.to(state, {
        value: to,
        duration,
        ease: EASE.expo,
        onUpdate: () => {
          el.textContent = `${prefix}${format(state.value)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
      });
    });
  }, [to, prefix, suffix, duration, grouped]);

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {prefix}
      {grouped ? to.toLocaleString("en-IN") : to}
      {suffix}
    </span>
  );
}
