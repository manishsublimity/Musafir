"use client";

import Image from "next/image";
import { useRef } from "react";
import { Scene } from "@/components/media/Scene";
import { PlayMark } from "@/components/ui/PlayMark";
import type { SceneArchetype, ScenePalette } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * SHAPE CARD
 *
 * The selection card used across the trip flow.
 *
 * The silhouette is the two exported Figma paths — `Vector 1` is the rim,
 * `Vector 2` is the photo window — baked into a shared viewBox so they align
 * at any size with no per-instance offsets.
 *
 * Layout decisions worth keeping:
 *
 * - The rim is a *ring*, not a slab. It reads as a frame around the photograph
 *   rather than competing with it, so the image stays the thing you look at.
 * - The label sits outside the shape. Text inside an arrowhead has to dodge
 *   the point, and every attempt at that ends up cramped or off-centre.
 * - Selected state is carried by the rim colour plus a tick, not by a border
 *   on the outer box — a rectangular focus ring around an arrowhead looks
 *   like a mistake.
 * - On hover the media pushes in slightly and, where a clip exists, plays.
 *   Without a clip the same gesture is a slow zoom, so the interaction is
 *   consistent whether or not footage has been supplied.
 */
export function ShapeCard({
  label,
  blurb,
  note,
  image,
  imageAlt,
  video,
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
  /** Short muted clip, played on hover. Optional. */
  video?: string;
  scene?: SceneArchetype;
  palette?: ScenePalette;
  seed: string;
  selected?: boolean;
  onToggle?: () => void;
  /** `div` when the caller wraps this in a Link instead. */
  as?: "button" | "div";
}) {
  const Tag = as;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play only while pointing at the card. Nothing autoplays on load: a grid of
  // eighteen looping clips is a bandwidth and battery problem, not a feature.
  const onEnter = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  };
  const onLeave = () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
  };

  return (
    <Tag
      {...(as === "button"
        ? { type: "button" as const, "aria-pressed": selected, onClick: onToggle }
        : {})}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={cx(
        "group/shape flex w-full flex-col text-left outline-offset-8",
        as === "button" && "cursor-pointer",
      )}
    >
      {/* --- media in the play shape --- */}
      <span className="relative block aspect-[307/341] w-full">
        {/* Rim — Vector 1. */}
        <span
          aria-hidden="true"
          className={cx(
            "play-shape-outer absolute inset-0 block transition-[background-color] duration-[--duration-base] ease-[--ease-expo]",
            selected ? "bg-primary" : "bg-primary/30 group-hover/shape:bg-primary",
          )}
        />

        {/* Photo window — Vector 2. */}
        <span className="play-shape-inner absolute inset-0 block overflow-hidden bg-surface-raised">
          {video && (
            <video
              ref={videoRef}
              className="absolute inset-0 z-[1] size-full object-cover opacity-0 transition-opacity duration-[--duration-base] group-hover/shape:opacity-100 motion-reduce:hidden"
              muted
              loop
              playsInline
              preload="none"
              poster={image}
              aria-hidden="true"
            >
              <source src={video} type="video/mp4" />
            </video>
          )}

          {image ? (
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 20vw"
              className="object-cover transition-transform duration-[900ms] ease-[--ease-expo] group-hover/shape:scale-[1.06]"
            />
          ) : scene ? (
            <Scene
              scene={scene}
              palette={palette}
              seed={seed}
              className="size-full transition-transform duration-[900ms] ease-[--ease-expo] group-hover/shape:scale-[1.06]"
            />
          ) : null}
        </span>

        {/* The plane crosses the lower edge, half on the shape and half off
            it, as on the brand sheet. */}
        <PlayMark
          className={cx(
            "absolute bottom-[-3%] left-[10%] z-[3] w-[22%] text-primary",
            "drop-shadow-[0_4px_10px_rgb(16_15_14/0.22)]",
            "transition-transform duration-[--duration-base] ease-[--ease-expo]",
            "group-hover/shape:-translate-y-1 group-hover/shape:translate-x-1",
          )}
        />

        {/* Tick, seated on the rim's flat left edge where it never covers the
            subject of the photograph. */}
        <span
          aria-hidden="true"
          className={cx(
            "absolute left-[3%] top-[8%] z-[3] grid size-8 place-items-center rounded-full bg-primary text-primary-contrast shadow-[--shadow-lift]",
            "transition-[scale,opacity] duration-[--duration-fast] ease-[--ease-spring]",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none">
            <path
              d="m5 13 4.2 4.2L19 7.4"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      {/* --- label --- */}
      <span className="mt-5 block">
        <span className="flex items-baseline gap-2">
          <span
            className={cx(
              "text-h3 font-bold leading-none tracking-tight transition-colors duration-[--duration-fast]",
              selected ? "text-primary" : "text-text-strong group-hover/shape:text-primary",
            )}
          >
            {label}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="size-3.5 shrink-0 translate-y-px text-primary opacity-0 transition-[opacity,transform] duration-[--duration-fast] ease-[--ease-expo] group-hover/shape:translate-x-1 group-hover/shape:opacity-100"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {blurb && (
          <span className="mt-1.5 block max-w-[22ch] text-label leading-snug text-muted">
            {blurb}
          </span>
        )}

        {note && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-primary/12 px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.1em] text-primary">
            <PlayMark className="size-3" />
            {note}
          </span>
        )}
      </span>
    </Tag>
  );
}
