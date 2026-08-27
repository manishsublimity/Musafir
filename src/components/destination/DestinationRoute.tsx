"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, ensureGsap, prefersReducedMotion } from "@/lib/motion";
import type { City } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * The destination route map.
 *
 * The path draws itself as the section is scrolled — the stroke-dashoffset is
 * scrubbed rather than played, so the line literally follows the reader down
 * the page. Each city lights up as the line reaches it.
 *
 * Under reduced motion the path is simply drawn and all cities are lit.
 */
export function DestinationRoute({
  cities,
  destinationName,
}: {
  cities: City[];
  destinationName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const points = cities.filter((c) => c.point);
  const path = points
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.point!.x} ${c.point!.y}`)
    .join(" ");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      setReached(points.length);
      return;
    }

    const gsap = ensureGsap();
    const context = gsap.context(() => {
      const line = root.querySelector<SVGPathElement>("[data-route-line]");
      if (!line) return;

      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            setReached(Math.ceil(self.progress * points.length)),
        },
      });
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [points.length]);

  if (points.length < 2) return null;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="rounded-lg border border-border bg-surface/40 p-6">
        <svg
          viewBox="0 0 100 100"
          className="h-auto w-full"
          role="img"
          aria-label={`Typical route through ${destinationName}: ${points.map((c) => c.name).join(", then ")}`}
        >
          <path
            data-route-line
            d={path}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((city, i) => {
            const lit = i < reached;
            return (
              <g key={city.slug}>
                <circle
                  cx={city.point!.x}
                  cy={city.point!.y}
                  r={lit ? 2.2 : 1.4}
                  fill={lit ? "var(--color-primary)" : "var(--color-muted)"}
                  className="transition-all duration-[--duration-base] ease-[--ease-expo]"
                />
                <text
                  x={city.point!.x + 3.4}
                  y={city.point!.y + 1.2}
                  fontSize="3.4"
                  fill="currentColor"
                  opacity={lit ? 1 : 0.45}
                  className="select-none transition-opacity duration-[--duration-base]"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <ol className="space-y-3">
        {points.map((city, i) => (
          <li
            key={city.slug}
            className={cx(
              "flex gap-5 rounded-md border p-5 transition-colors duration-[--duration-base]",
              i < reached ? "border-primary/40 bg-primary/5" : "border-border",
            )}
          >
            <span
              className={cx(
                "font-[family-name:var(--font-display)] text-h3 leading-none transition-colors duration-[--duration-base]",
                i < reached ? "text-primary" : "text-muted/50",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-h3">{city.name}</span>
                {city.nights ? (
                  <span className="text-label text-muted">
                    {city.nights} {city.nights === 1 ? "night" : "nights"}
                  </span>
                ) : null}
              </span>
              {city.blurb && <span className="mt-2 block text-body text-muted">{city.blurb}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
