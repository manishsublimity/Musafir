"use client";

import { Scene } from "@/components/media/Scene";
import type { SceneArchetype, ScenePalette } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * The selection card used across every step of the customiser.
 *
 * Rendered as a real <button> with `aria-pressed`, not a styled div — the
 * whole flow is a series of choices, and each one has to be reachable and
 * announceable without a pointer.
 *
 * The tick badge is the only thing that moves on selection; the card itself
 * only changes border and tint, so a grid of twelve options does not become a
 * grid of twelve competing animations.
 */
export function ArchCard({
  label,
  blurb,
  note,
  scene,
  palette,
  seed,
  selected,
  onToggle,
  media = true,
}: {
  label: string;
  blurb?: string;
  note?: string;
  scene?: SceneArchetype;
  palette?: ScenePalette;
  seed: string;
  selected: boolean;
  onToggle: () => void;
  /** Text-only cards (months, durations) drop the artwork. */
  media?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggle}
        className={cx(
          "group/arch relative flex w-full flex-col overflow-hidden border-2 bg-surface p-3 text-left",
          "arch transition-[border-color,background-color,transform,box-shadow] duration-[--duration-fast] ease-[--ease-expo]",
          "hover:-translate-y-1 hover:shadow-[--shadow-lift]",
          selected
            ? "border-primary bg-primary/8"
            : "border-border hover:border-border-strong",
        )}
      >
        {media && scene && (
          <span className="arch-media relative block aspect-[4/5] w-full overflow-hidden">
            <Scene
              scene={scene}
              palette={palette}
              seed={seed}
              className="size-full transition-transform duration-[700ms] ease-[--ease-expo] group-hover/arch:scale-[1.06]"
            />
          </span>
        )}

        <span className="flex flex-1 flex-col items-center px-2 pb-2 pt-4 text-center">
          <span className="text-h3 font-semibold leading-tight">{label}</span>
          {blurb && <span className="mt-2 text-label text-muted">{blurb}</span>}
        </span>

        {/* Tick sits in the corner, scaling in from nothing. */}
        <span
          aria-hidden="true"
          className={cx(
            "absolute bottom-0 right-0 grid size-11 place-items-center rounded-tl-lg bg-primary text-primary-contrast",
            "transition-[scale,opacity] duration-[--duration-fast] ease-[--ease-spring]",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none">
            <path
              d="m5 13 4.2 4.2L19 7.4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {note && (
        <span className="mt-2 rounded-pill bg-secondary/25 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-primary">
          {note}
        </span>
      )}
    </div>
  );
}
