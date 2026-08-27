"use client";

import { useMemo, useState } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { Scene } from "@/components/media/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/Primitives";
import { track } from "@/lib/analytics";
import { STYLE_LABELS } from "@/lib/format";
import type { PackageCard as PackageCardData } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * SECTION 09 — THEMED DESTINATIONS
 *
 * Motion identity: *the mood change*. Selecting a theme repaints the whole
 * section — backdrop, copy and results — rather than filtering a grid in place.
 * The section is asking an emotional question, so the answer should look
 * different, not merely shorter.
 */

const THEMES: { id: string; line: string; scene: Parameters<typeof Scene>[0]["scene"] }[] = [
  { id: "honeymoon", line: "For the beginning of your forever.", scene: "island" },
  { id: "family", line: "One trip where nobody is bored.", scene: "beach" },
  { id: "friends", line: "The group chat, finally in one place.", scene: "city" },
  { id: "luxury", line: "Space, quiet, and someone else handling it.", scene: "island" },
  { id: "adventure", line: "The days you will still be describing in ten years.", scene: "mountain" },
  { id: "solo", line: "Your pace. Nobody waiting on you.", scene: "forest" },
  { id: "senior-friendly", line: "Views that do not require the walk.", scene: "backwater" },
  { id: "weekend", line: "Three nights is a holiday if you plan it properly.", scene: "beach" },
  { id: "wildlife", line: "Close enough that it changes how you talk about it.", scene: "savannah" },
  { id: "beach", line: "Do nothing, professionally.", scene: "island" },
  { id: "winter", line: "Snow you can actually reach.", scene: "snow" },
  { id: "cultural", line: "Places where the buildings have dates on them.", scene: "heritage" },
];

export function ThemedDestinations({ packages }: { packages: PackageCardData[] }) {
  const themesWithResults = useMemo(
    () => THEMES.filter((theme) => packages.some((p) => p.styles.includes(theme.id))),
    [packages],
  );

  const [theme, setTheme] = useState(themesWithResults[0]?.id ?? "honeymoon");
  const active = themesWithResults.find((t) => t.id === theme) ?? themesWithResults[0];

  const results = useMemo(
    () => packages.filter((p) => p.styles.includes(theme)).slice(0, 3),
    [packages, theme],
  );

  if (!active) return null;

  return (
    <section
      aria-label="Destinations by travel style"
      className="theme-sand grain relative isolate overflow-hidden bg-background py-[clamp(4rem,9vw,8.5rem)] text-text"
    >
      <div className="absolute inset-0 -z-10">
        {themesWithResults.map((t) => (
          <div
            key={t.id}
            aria-hidden="true"
            className={cx(
              "absolute inset-0 transition-opacity duration-[1100ms] ease-[--ease-expo] motion-reduce:transition-none",
              t.id === theme ? "opacity-100" : "opacity-0",
            )}
          >
            <Scene scene={t.scene} seed={`theme-${t.id}`} className="size-full" />
          </div>
        ))}
        <span aria-hidden="true" className="absolute inset-0 bg-background/85" />
      </div>
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="However you travel"
            title="Who are you going with?"
            lede="The same destination is a different holiday depending on who is standing next to you. Start from that."
          />
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Choose a travel style">
          {themesWithResults.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === theme}
              onClick={() => {
                setTheme(t.id);
                track("filter_used", { filter: "theme", value: t.id });
              }}
              className={cx(
                "h-11 rounded-pill border px-4 text-label font-medium transition-[background-color,border-color,color] duration-[--duration-fast] ease-[--ease-expo]",
                t.id === theme
                  ? "border-primary bg-primary text-primary-contrast"
                  : "border-border text-muted hover:border-border-strong hover:text-text-strong",
              )}
            >
              {STYLE_LABELS[t.id] ?? t.id}
            </button>
          ))}
        </div>

        <p
          aria-live="polite"
          className="mt-12 max-w-3xl font-[family-name:var(--font-display)] text-h1 leading-[1.02] text-text-strong"
        >
          {active.line}
        </p>

        {results.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((pkg) => (
              <PackageCard key={pkg.slug} data={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
