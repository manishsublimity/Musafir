"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Scene } from "@/components/media/Scene";
import type { DestinationCard } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * COUNTRY CARD
 *
 * The destination card for the hero's "where do you want to go?" step.
 *
 * It is deliberately built in the language the trending rail already uses —
 * `rounded-lg`, full-bleed media scaling behind a fixed frame on hover, a
 * gradient rising from the foot, a caption eyebrow above a display-face name,
 * and the 44px circular affordance that fills amber. Same tokens, same
 * easings, same durations. The arrowhead shape used by the other steps is
 * dropped here for one reason: it masks a photograph into a point, and a
 * photograph of a country is the entire content of this step. Everywhere the
 * card is carrying artwork rather than a place, the arrowhead stays.
 *
 * ---------------------------------------------------------------------------
 * MEDIA
 *
 * The still and the clip occupy the same layer and cross-fade, so hovering
 * looks like the picture coming alive rather than a second element arriving
 * on top of it. Where no clip has been supplied the same gesture is a slow
 * zoom — the pattern the rest of the site already follows, so the interaction
 * is identical whether or not footage exists for a destination.
 *
 * Nothing preloads more than metadata, and leaving a card pauses the video and
 * rewinds it, so a rail of eighteen destinations never has eighteen videos
 * buffering.
 */

/**
 * Only one card may have audio at a time. Kept at module scope rather than in
 * React state because it has to be enforced across sibling cards that know
 * nothing about each other, and because muting a video is a DOM operation with
 * no business causing a render.
 */
let audioOwner: HTMLVideoElement | null = null;

function claimAudio(video: HTMLVideoElement) {
  if (audioOwner && audioOwner !== video) {
    audioOwner.muted = true;
  }
  audioOwner = video;
  video.muted = false;
}

function releaseAudio(video: HTMLVideoElement) {
  video.muted = true;
  if (audioOwner === video) audioOwner = null;
}

export function CountryCard({
  data,
  selected,
  onSelect,
}: {
  data: DestinationCard;
  selected: boolean;
  onSelect: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [sound, setSound] = useState(false);

  // Parallax. Motion values, so moving the pointer never renders the card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 20, mass: 0.6 };
  const dx = useSpring(px, spring);
  const dy = useSpring(py, spring);
  const mediaX = useTransform(dx, (v) => v * 8);
  const mediaY = useTransform(dy, (v) => v * 5);

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const r = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - r.left) / r.width) * 2 - 1);
    py.set(((event.clientY - r.top) / r.height) * 2 - 1);
  };

  const enter = useCallback(() => {
    setActive(true);
    px.set(0);
    py.set(0);
    const el = videoRef.current;
    if (!el || reduced) return;
    // Always from the top, so a hover is a fresh look at the place.
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, [px, py, reduced]);

  const leave = useCallback(() => {
    setActive(false);
    px.set(0);
    py.set(0);
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    releaseAudio(el);
    setSound(false);
  }, [px, py]);

  // A card unmounting mid-hover must not leave audio playing behind it.
  useEffect(() => {
    const el = videoRef.current;
    return () => {
      if (el) releaseAudio(el);
    };
  }, []);

  const toggleSound = (event: React.MouseEvent) => {
    // The card itself selects; the speaker must not.
    event.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (sound) {
      releaseAudio(el);
      setSound(false);
    } else {
      claimAudio(el);
      setSound(true);
      void el.play().catch(() => {});
    }
  };

  const hasVideo = Boolean(data.video);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      onPointerMove={onPointerMove}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={cx(
        "group/country relative aspect-[3/4] w-[clamp(9.5rem,15vw,13rem)] shrink-0 overflow-hidden rounded-lg text-left",
        "outline-offset-4 transition-[opacity,box-shadow] duration-[--duration-base] ease-[--ease-expo]",
        // The three-step legibility ladder, in the site's own terms.
        selected ? "opacity-100" : "opacity-55 hover:opacity-85 focus-visible:opacity-85",
        selected && "shadow-[--shadow-float] ring-2 ring-amber-400",
      )}
    >
      {/* --- media: still and clip share one layer --- */}
      <motion.div className="absolute inset-0" style={{ x: mediaX, y: mediaY }}>
        <div
          className={cx(
            "absolute inset-[-6%] transition-transform duration-[1000ms] ease-[--ease-expo]",
            "group-hover/country:scale-[1.07] group-focus-visible/country:scale-[1.07]",
          )}
        >
          {data.image ? (
            <Image
              src={data.image}
              alt=""
              fill
              sizes="(max-width: 768px) 40vw, 15vw"
              className={cx(
                "object-cover transition-opacity duration-[--duration-base] ease-[--ease-expo]",
                active && hasVideo ? "opacity-0" : "opacity-100",
              )}
            />
          ) : (
            <Scene
              scene={data.scene}
              palette={data.palette}
              seed={`country-${data.slug}`}
              className={cx(
                "size-full transition-opacity duration-[--duration-base]",
                active && hasVideo ? "opacity-0" : "opacity-100",
              )}
            />
          )}

          {hasVideo && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              // Metadata only. Eighteen destinations buffering at once would
              // cost more than the whole rest of the page.
              preload="metadata"
              poster={data.image}
              aria-hidden="true"
              className={cx(
                "absolute inset-0 size-full object-cover",
                "transition-[opacity,filter,transform] duration-[--duration-base] ease-[--ease-expo]",
                active ? "scale-[1.03] opacity-100 blur-0" : "scale-100 opacity-0 blur-[6px]",
              )}
            >
              <source src={data.video} type="video/mp4" />
            </video>
          )}
        </div>
      </motion.div>

      {/* --- the foot gradient the rest of the site uses --- */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/45 to-transparent transition-opacity duration-[--duration-slow] group-hover/country:via-ink-900/55"
      />

      {/* --- sound, only where there is something to hear --- */}
      {hasVideo && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={sound ? `Mute ${data.name}` : `Play sound for ${data.name}`}
          onClick={toggleSound}
          className={cx(
            "absolute right-2.5 top-2.5 z-[3] grid size-9 place-items-center rounded-full",
            "border border-sand-50/30 bg-ink-900/60 text-sand-50 backdrop-blur-md",
            "transition-[opacity,border-color,color] duration-[--duration-fast]",
            "hover:border-amber-400 hover:text-amber-300",
            active || sound ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            {sound ? (
              <path
                d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.8a7.5 7.5 0 0 1 0 10.4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            ) : (
              <path d="m16.5 9.5 4 5m0-5-4 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            )}
          </svg>
        </span>
      )}

      {/* --- name --- */}
      <span className="absolute inset-x-0 bottom-0 z-[2] block p-3.5">
        <span className="block text-caption font-semibold uppercase tracking-[0.14em] text-sand-100/75">
          {data.domestic ? "India" : data.region}
        </span>
        <span
          className={cx(
            "mt-1 block truncate font-display text-h3 leading-[1.05] transition-[transform,color] duration-[--duration-slow] ease-[--ease-expo]",
            "group-hover/country:-translate-y-0.5",
            selected ? "text-amber-300" : "text-sand-50",
          )}
        >
          {data.name}
        </span>
      </span>

      {/* --- selected tick, in the same 44px affordance the rail uses --- */}
      <span
        aria-hidden="true"
        className={cx(
          "absolute left-2.5 top-2.5 z-[3] grid size-8 place-items-center rounded-full bg-amber-400 text-ink-900",
          "transition-[scale,opacity] duration-[--duration-fast] ease-[--ease-spring]",
          selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <path
            d="m5 13 4.2 4.2L19 7.4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
