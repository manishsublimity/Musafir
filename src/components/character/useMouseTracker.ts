"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, type MotionValue } from "motion/react";

/**
 * MOUSE TRACKER
 *
 * Normalised cursor position as motion values, so nothing here ever causes a
 * React render. `mousemove` fires far faster than React can reconcile, and
 * calling setState on each one is the difference between a smooth character
 * and a stuttering one — so the handler writes to motion values, and the only
 * state in this hook is `mode`, which changes when the device does.
 *
 *   x, y      -1 → 1, the cursor's position across the viewport
 *   strength  0 → 1, how strongly the character should react
 *
 * `strength` is what makes the reaction feel like attention rather than a
 * mechanical link. It falls off with the cursor's distance from the character,
 * so someone working at the far side of the page gets barely a flicker and
 * someone moving across the character gets the full turn.
 *
 * The character's position is read from a cached rect rather than measured per
 * event: `getBoundingClientRect` forces layout, and doing that on every
 * `mousemove` inside a hero that already runs its own rAF loop is exactly how
 * you lose frames. It is refreshed on resize and on scroll instead.
 */

export type PointerMode = "full" | "damped" | "off";

export interface MouseTracker {
  x: MotionValue<number>;
  y: MotionValue<number>;
  strength: MotionValue<number>;
  mode: PointerMode;
  /** Attach to the character's outer element so distance can be measured. */
  ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * A coarse pointer means touch: there is no cursor to follow, so tracking is
 * off and the character keeps only its idle life. Chasing a finger instead
 * would be worse than nothing — the character would lurch on each tap and sit
 * frozen between them.
 *
 * The damped band is 1024–1280 rather than "below 1024", because the
 * character is only rendered from 1024 up: a threshold below that could never
 * fire. These are the small laptops and trackpad tablets where the figure is
 * drawn small enough that full amplitude reads as twitchy.
 */
const DAMPED_UNTIL = 1280;

function readMode(reduced: boolean): PointerMode {
  if (typeof window === "undefined") return "off";
  if (reduced) return "off";
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!fine) return "off";
  if (window.innerWidth < DAMPED_UNTIL) return "damped";
  return "full";
}

export function useMouseTracker(): MouseTracker {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const strength = useMotionValue(0);

  // Starts "off" so the server and the first client render agree; the real
  // mode is read in the effect below, where `window` exists.
  const [mode, setMode] = useState<PointerMode>("off");

  useEffect(() => {
    setMode(readMode(reduced));
    const onResize = () => setMode(readMode(reduced));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reduced]);

  useEffect(() => {
    if (mode === "off") {
      // Settle to neutral rather than freezing wherever the cursor left off.
      x.set(0);
      y.set(0);
      strength.set(0);
      return;
    }

    // Cached geometry of the character, refreshed only when it can change.
    let centre = { x: 0, y: 0 };
    let measurePending = false;

    const measure = () => {
      measurePending = false;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // The head is what the cursor is really interacting with, and it sits
      // near the top of the artwork — measuring from the middle of a
      // full-length figure puts the origin around their knees.
      centre = { x: r.left + r.width / 2, y: r.top + r.height * 0.22 };
    };

    const scheduleMeasure = () => {
      if (measurePending) return;
      measurePending = true;
      requestAnimationFrame(measure);
    };

    measure();

    const damping = mode === "damped" ? 0.5 : 1;
    // Distance at which the character stops paying attention, as a share of
    // the viewport's diagonal.
    const reach = Math.hypot(window.innerWidth, window.innerHeight) * 0.55;

    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      x.set(nx * damping);
      y.set(ny * damping);

      const distance = Math.hypot(event.clientX - centre.x, event.clientY - centre.y);
      // 1 when the cursor is on the character, easing to a floor rather than
      // to zero — a character that goes completely inert reads as broken.
      const near = Math.max(0, 1 - distance / reach);
      strength.set(0.35 + 0.65 * near * near);
    };

    const onLeave = () => strength.set(0);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
    };
  }, [mode, x, y, strength]);

  return { x, y, strength, mode, ref };
}
