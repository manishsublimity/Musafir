"use client";

import Image from "next/image";
import { Scene } from "@/components/media/Scene";
import { PlayMark } from "@/components/ui/PlayMark";
import type { SceneArchetype, ScenePalette } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * SHAPE CARD
 *
 * The selection card used across the whole trip flow. Built to match the brand
 * sheet: the photograph sits inside the play-shape silhouette, a thick rim of
 * the same silhouette sits behind it, and the plane mark crosses the lower edge
 * so the shape and the mark read as one object rather than two stacked layers.
 *
 * The rim is a scaled-up copy of the mask rather than a border, because a
 * border-radius cannot follow an arrowhead — only the silhouette itself can.
 *
 * The label block sits *outside* the shape, which is what keeps the layout
 * legible: text inside an arrowhead has to dodge the point, and every attempt
 * to do that ends up either cramped or off-centre.
 */
export function ShapeCard({
  label,
  blurb,
  note,
  image,
  imageAlt,
  scene,
  palette,
  seed,
  selected = false,
  onToggle,
  as = "button",
}: {
  label: string;
  blurb?: string;
  note?: string;
  /** A real photograph. Falls back to the generated scene when absent. */
  image?: string;
  imageAlt?: string;
  scene?: SceneArchetype;
  palette?: ScenePalette;
  seed: string;
  selected?: boolean;
  onToggle?: () => void;
  /** `div` when the caller wraps this in a Link instead. */
  as?: "button" | "div";
}) {
  const Tag = as;

  return (
    <Tag
      {...(as === "button"
        ? { type: "button" as const, "aria-pressed": selected, onClick: onToggle }
        : {})}
      className={cx(
        "group/shape flex w-full flex-col text-left outline-offset-4",
        as === "button" && "cursor-pointer",
      )}
    >
      {/* --- artwork in the play shape, inside a thick rim --- */}
      <span className="relative block aspect-[307/341] w-full">
        <span
          aria-hidden="true"
          className={cx(
            "play-shape absolute -inset-[7%] block transition-[background-color] duration-[--duration-base] ease-[--ease-expo]",
            selected ? "bg-primary" : "bg-secondary group-hover/shape:bg-primary",
          )}
        />

        <span className="play-shape absolute inset-0 block overflow-hidden bg-surface-raised">
          {image ? (
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              className="object-cover transition-transform duration-[900ms] ease-[--ease-expo] group-hover/shape:scale-[1.08]"
            />
          ) : scene ? (
            <Scene
              scene={scene}
              palette={palette}
              seed={seed}
              className="size-full transition-transform duration-[900ms] ease-[--ease-expo] group-hover/shape:scale-[1.08]"
            />
          ) : null}
        </span>

        {/* The plane crosses the lower edge, half on the shape and half off it,
            exactly as on the brand sheet. */}
        <PlayMark
          className={cx(
            "absolute bottom-[-5%] left-[8%] z-[3] w-[30%] text-primary drop-shadow-[0_6px_14px_rgb(16_15_14/0.25)]",
            "transition-transform duration-[--duration-base] ease-[--ease-expo] group-hover/shape:-translate-y-1",
          )}
        />

        {/* Selected tick, tucked into the shape's inner corner. */}
        <span
          aria-hidden="true"
          className={cx(
            "absolute right-[16%] top-[10%] z-[3] grid size-9 place-items-center rounded-full bg-primary text-primary-contrast shadow-[--shadow-lift]",
            "transition-[scale,opacity] duration-[--duration-fast] ease-[--ease-spring]",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none">
            <path
              d="m5 13 4.2 4.2L19 7.4"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      {/* --- label block --- */}
      <span className="mt-7 flex items-start gap-3">
        <span
          className={cx(
            "mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-[--duration-base]",
            selected
              ? "border-primary bg-primary text-primary-contrast"
              : "border-primary/40 text-primary group-hover/shape:border-primary",
          )}
        >
          <PlayMark className="size-4" />
        </span>

        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="text-h3 font-bold uppercase leading-none tracking-tight text-text-strong">
              {label}
            </span>
            <svg
              viewBox="0 0 24 24"
              className="size-4 shrink-0 text-primary transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/shape:translate-x-1"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {blurb && (
            <span className="mt-2 block text-label leading-snug text-muted">{blurb}</span>
          )}

          {note && (
            <span className="mt-2.5 inline-block rounded-pill bg-primary/12 px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.1em] text-primary">
              {note}
            </span>
          )}
        </span>
      </span>
    </Tag>
  );
}
