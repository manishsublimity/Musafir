"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Scene } from "@/components/media/Scene";
import { TransportIcon } from "./TransportIcon";
import { track } from "@/lib/analytics";
import { formatMinutes, TRANSPORT_LABELS } from "@/lib/format";
import { DURATION, EASE, ScrollTrigger, ensureGsap, prefersReducedMotion } from "@/lib/motion";
import type { City, ItineraryDay } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * THE ITINERARY EXPERIENCE
 *
 * Three synchronised pieces sharing one "current day" value:
 *
 *   - a vertical timeline where each day assembles itself as it enters view
 *   - a sticky route map that highlights the city you are reading about
 *   - a sticky day progress rail
 *
 * The point is that scrolling the itinerary should feel like moving through the
 * trip, so the map and the rail are driven by reading position rather than by
 * clicking. Clicking still works — it scrolls the timeline — but it is the
 * secondary interaction, not the primary one.
 *
 * Each day's reveal is a nine-beat sequence: day number, city badge, route
 * line, transport icon, image, activities, hotel, meals, CTA. Under reduced
 * motion the whole sequence collapses and every day is simply present.
 */
export function ItineraryExperience({
  days,
  cities,
  packageSlug,
}: {
  days: ItineraryDay[];
  cities: City[];
  packageSlug: string;
}) {
  const [activeDay, setActiveDay] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

  /** City order along the route, used by the map. */
  const routeCities = useMemo(() => cities.filter((c) => c.point), [cities]);

  const activeCity = useMemo(() => {
    const day = days.find((d) => d.day === activeDay);
    if (!day) return undefined;
    return routeCities.find(
      (c) => c.name.toLowerCase() === day.city.toLowerCase(),
    );
  }, [activeDay, days, routeCities]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();
    const gsap = ensureGsap();

    const context = gsap.context(() => {
      const dayEls = gsap.utils.toArray<HTMLElement>("[data-day]");

      for (const el of dayEls) {
        const dayNumber = Number(el.dataset.day);

        // Reading position drives the map and the rail.
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveDay(dayNumber);
              track("itinerary_day_viewed", { package: packageSlug, day: dayNumber });
            }
          },
        });

        if (reduced) continue;

        // The nine-beat assembly.
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        });

        timeline
          .from(el.querySelector("[data-beat='number']"), {
            opacity: 0,
            x: -24,
            duration: DURATION.slow * 0.6,
            ease: EASE.expo,
          })
          .from(
            el.querySelector("[data-beat='badge']"),
            { opacity: 0, y: 14, duration: DURATION.base, ease: EASE.expo },
            "-=0.3",
          )
          .from(
            el.querySelector("[data-beat='line']"),
            { scaleY: 0, transformOrigin: "top", duration: DURATION.slow, ease: "none" },
            "-=0.25",
          )
          .from(
            el.querySelector("[data-beat='transport']"),
            { opacity: 0, scale: 0.6, duration: DURATION.base, ease: EASE.spring },
            "-=0.5",
          )
          .from(
            el.querySelector("[data-beat='media']"),
            {
              clipPath: "inset(0 0 100% 0)",
              duration: DURATION.slow,
              ease: EASE.expo,
            },
            "-=0.55",
          )
          .from(
            el.querySelectorAll("[data-beat='activity']"),
            { opacity: 0, y: 18, stagger: 0.07, duration: DURATION.base, ease: EASE.expo },
            "-=0.45",
          )
          .from(
            el.querySelector("[data-beat='hotel']"),
            { opacity: 0, duration: DURATION.base, ease: EASE.smooth },
            "-=0.25",
          )
          .from(
            el.querySelector("[data-beat='meals']"),
            { opacity: 0, y: 10, duration: DURATION.base, ease: EASE.expo },
            "-=0.3",
          );
      }
    }, root);

    return () => context.revert();
  }, [days, packageSlug]);

  return (
    <div ref={rootRef} className="container-editorial">
      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* ------------------------------------------------------ timeline */}
        <ol className="min-w-0">
          {days.map((day, index) => (
            <li
              key={day.day}
              data-day={day.day}
              id={`day-${day.day}`}
              className="relative scroll-mt-28 pb-14"
            >
              <div className="grid gap-6 sm:grid-cols-[5.5rem_1fr] sm:gap-8">
                {/* Day number + connective line */}
                <div className="relative flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0">
                  <p
                    data-beat="number"
                    className={cx(
                      "font-[family-name:var(--font-display)] text-h2 leading-none transition-colors duration-[--duration-base]",
                      day.day === activeDay ? "text-primary" : "text-muted/50",
                    )}
                  >
                    {String(day.day).padStart(2, "0")}
                  </p>
                  <p className="text-caption uppercase tracking-[0.14em] text-muted sm:mt-2">Day</p>

                  {index < days.length - 1 && (
                    <span
                      data-beat="line"
                      aria-hidden="true"
                      className="absolute left-[2.1rem] top-24 hidden h-[calc(100%-4rem)] w-px bg-border sm:block"
                    />
                  )}
                </div>

                {/* Day body */}
                <article className="min-w-0 rounded-lg border border-border bg-surface p-6 md:p-8">
                  <header>
                    <p data-beat="badge" className="flex flex-wrap items-center gap-2">
                      <span className="rounded-pill border border-primary/40 bg-primary/10 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-primary">
                        {day.city}
                      </span>
                      {day.leg && (
                        <span
                          data-beat="transport"
                          className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-1.5 text-caption uppercase tracking-[0.08em] text-muted"
                        >
                          <TransportIcon mode={day.leg.mode} className="size-4" />
                          {TRANSPORT_LABELS[day.leg.mode]}
                          {day.leg.durationMins && ` · ${formatMinutes(day.leg.durationMins)}`}
                        </span>
                      )}
                    </p>

                    <h3 className="mt-4 text-h3">{day.title}</h3>
                    <p className="mt-3 text-body text-muted">{day.summary}</p>
                  </header>

                  {/* Route leg, drawn as a small journey diagram */}
                  {day.leg && (
                    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-border bg-surface-raised p-4 text-label">
                      <span className="font-semibold">{day.leg.from}</span>
                      <span className="flex flex-1 items-center gap-2 text-primary" aria-hidden="true">
                        <span className="h-px flex-1 bg-current opacity-40" />
                        <TransportIcon mode={day.leg.mode} className="size-4" />
                        <span className="h-px flex-1 bg-current opacity-40" />
                      </span>
                      <span className="font-semibold">{day.leg.to}</span>
                      {day.leg.note && (
                        <span className="w-full text-caption text-muted">{day.leg.note}</span>
                      )}
                    </div>
                  )}

                  {day.media && (
                    <div
                      data-beat="media"
                      className="relative mt-6 aspect-[16/9] overflow-hidden rounded-md"
                    >
                      <Scene
                        scene={day.media.scene ?? "island"}
                        palette={day.media.palette}
                        seed={`${packageSlug}-day-${day.day}`}
                        className="size-full"
                      />
                      <span className="sr-only">{day.media.alt}</span>
                    </div>
                  )}

                  {day.activities.length > 0 && (
                    <ul className="mt-7 space-y-4">
                      {day.activities.map((activity, i) => (
                        <li
                          key={`${activity.title}-${i}`}
                          data-beat="activity"
                          className="grid gap-2 border-t border-border pt-4 sm:grid-cols-[6rem_1fr] sm:gap-5"
                        >
                          <p className="text-caption uppercase tracking-[0.12em] text-muted">
                            {activity.slot}
                          </p>
                          <div className="min-w-0">
                            <p className="font-semibold">{activity.title}</p>
                            {activity.description && (
                              <p className="mt-1.5 text-label text-muted">{activity.description}</p>
                            )}
                            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted">
                              {activity.location && <span>{activity.location}</span>}
                              {activity.durationMins && (
                                <span>{formatMinutes(activity.durationMins)}</span>
                              )}
                            </p>
                            {activity.experienceSlug && (
                              <a
                                href={`/experiences/${activity.experienceSlug}`}
                                onClick={() =>
                                  track("activity_viewed", { experience: activity.experienceSlug })
                                }
                                className="mt-2 inline-flex items-center gap-1.5 text-label font-semibold text-primary underline underline-offset-4"
                              >
                                View activity
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <footer className="mt-7 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                    <p data-beat="hotel" className="text-label">
                      <span className="block text-caption uppercase tracking-[0.12em] text-muted">
                        Stay
                      </span>
                      <span className="mt-1 block">
                        {day.hotel
                          ? `${day.hotel.name} · ${day.hotel.category.replace("-", " ")}`
                          : "Overnight in transit"}
                      </span>
                    </p>
                    <p data-beat="meals" className="text-label sm:text-right">
                      <span className="block text-caption uppercase tracking-[0.12em] text-muted">
                        Meals included
                      </span>
                      <span className="mt-1 block capitalize">
                        {day.meals.filter((m) => m !== "none").join(", ") || "None"}
                      </span>
                    </p>
                  </footer>
                </article>
              </div>
            </li>
          ))}
        </ol>

        {/* ------------------------------------------------- sticky column */}
        <aside className="sticky top-24 hidden lg:block">
          <RouteMap cities={routeCities} activeCityName={activeCity?.name} />
          <DayProgress days={days} activeDay={activeDay} />
        </aside>
      </div>
    </div>
  );
}

/**
 * The route map. The path draws itself once on mount, then the active pin is
 * driven by whichever day is being read.
 */
function RouteMap({
  cities,
  activeCityName,
}: {
  cities: City[];
  activeCityName?: string;
}) {
  if (cities.length < 2) return null;

  const path = cities
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.point!.x} ${c.point!.y}`)
    .join(" ");

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">Your route</p>

      <svg
        viewBox="0 0 100 100"
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`Route: ${cities.map((c) => c.name).join(" to ")}`}
      >
        <path
          d={path}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="route-draw"
          opacity="0.55"
        />
        {cities.map((city) => {
          const active = city.name === activeCityName;
          return (
            <g key={city.slug}>
              {active && (
                <circle
                  cx={city.point!.x}
                  cy={city.point!.y}
                  r="2"
                  fill="var(--color-primary)"
                  opacity="0.5"
                  className="motion-loop"
                  style={{
                    transformOrigin: `${city.point!.x}px ${city.point!.y}px`,
                    animation: "musafir-pulse-ring 2.4s var(--ease-smooth) infinite",
                  }}
                />
              )}
              <circle
                cx={city.point!.x}
                cy={city.point!.y}
                r={active ? 2 : 1.3}
                fill={active ? "var(--color-primary)" : "var(--color-muted)"}
                className="transition-all duration-[--duration-base] ease-[--ease-expo]"
              />
              <text
                x={city.point!.x + 3.2}
                y={city.point!.y + 1.2}
                fontSize="3.4"
                fill="currentColor"
                opacity={active ? 1 : 0.55}
                className="select-none transition-opacity duration-[--duration-base]"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>

      {activeCityName && (
        <p aria-live="polite" className="mt-3 text-label">
          <span className="text-muted">You are here — </span>
          <span className="font-semibold">{activeCityName}</span>
        </p>
      )}
    </div>
  );
}

function DayProgress({ days, activeDay }: { days: ItineraryDay[]; activeDay: number }) {
  const percent = ((activeDay - 1) / Math.max(1, days.length - 1)) * 100;

  return (
    <div className="mt-5 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between text-caption uppercase tracking-[0.12em] text-muted">
        <span>Day 01</span>
        <span>Day {String(days.length).padStart(2, "0")}</span>
      </div>

      <div className="relative mt-3 h-1.5 rounded-pill bg-border-strong">
        <span
          className="absolute inset-y-0 left-0 rounded-pill bg-primary transition-[width] duration-[--duration-base] ease-[--ease-expo]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-5 max-h-72 space-y-1 overflow-y-auto">
        {days.map((day) => (
          <li key={day.day}>
            <a
              href={`#day-${day.day}`}
              className={cx(
                "flex items-baseline gap-3 rounded-sm px-2 py-1.5 text-label transition-colors duration-[--duration-fast]",
                day.day === activeDay
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted hover:text-text",
              )}
              aria-current={day.day === activeDay ? "true" : undefined}
            >
              <span className="tabular-nums opacity-70">
                {String(day.day).padStart(2, "0")}
              </span>
              <span className="truncate">{day.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
