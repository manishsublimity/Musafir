"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}

/**
 * A CSS-only marquee. The content is duplicated once and the track translates
 * by exactly -50%, which makes the loop seamless without any JS measuring.
 *
 * The duplicate is `aria-hidden` so assistive technology reads the list once.
 */
export function Marquee({
  children,
  speed = 42,
  reverse = false,
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={cx("group relative w-full overflow-hidden edge-fade-x", className)}>
      <div
        className={cx(
          "motion-loop flex w-max shrink-0 items-center will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `musafir-marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
