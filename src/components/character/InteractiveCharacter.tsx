"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { CHARACTERS, type CharacterId } from "./characters";
import { useMouseTracker } from "./useMouseTracker";
import { cx as clsx } from "@/lib/utils";

/**
 * INTERACTIVE CHARACTER
 *
 * A character who watches the cursor: the figure leans and turns toward it,
 * breathes on the spot, and settles when attention moves away.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS DRAWS THE ARTWORK ONCE
 *
 * An earlier version turned the heads independently, by stacking several
 * masked copies of the same picture and giving each its own spring. It worked
 * mechanically — the heads did turn — but it looked wrong, and the reason is
 * unavoidable with this source material: the masked copies sit on top of a
 * fully opaque base copy, so the moment a head layer is offset by even a few
 * pixels you are looking at two heads at once. The result reads as a blurred
 * double image rather than a turn.
 *
 * The only clean fix is for the base layer to have nothing behind the head to
 * show through — which means artwork with the head and body on separate
 * layers, or a base plate with the head painted out. We have neither: these
 * are single flattened stills.
 *
 * So the whole figure moves as one. That is the honest treatment of a flat
 * asset, and a lean with real spring physics reads as alive without ever
 * looking broken. If head and body arrive as separate files, independent head
 * turning can come back — the tracker and the limits below would not need to
 * change, only the layer stack.
 *
 * ---------------------------------------------------------------------------
 * WHAT MAKES IT FEEL ALIVE WITHOUT LAYERS
 *
 *   - a lean toward the cursor, sprung so it has inertia rather than tracking
 *   - a small 3D turn under perspective, so the lean has depth to it
 *   - reaction that falls off with distance, so it reads as attention
 *   - a slow breath and float, so it is never perfectly still
 */

/* ------------------------------------------------------------- limits -- */

/** Peak deflection at full strength. Ceilings, not targets. */
const LIMITS = {
  x: 15,
  y: 10,
  rotate: 3,
  /** The 3D turn. Small on purpose: a flat picture shears if pushed. */
  rotateY: 5,
  rotateX: 4,
};

const SPRING = { stiffness: 110, damping: 20, mass: 1 };

/* ---------------------------------------------------------- component -- */

export function InteractiveCharacter({
  character,
  className,
}: {
  character: CharacterId;
  className?: string;
}) {
  const config = CHARACTERS[character];
  const pointer = useMouseTracker();

  // Position scaled by the distance falloff, then sprung. Multiplying before
  // the spring rather than after means the character eases as attention fades
  // instead of snapping to neutral the moment the cursor leaves.
  const dx = useSpring(
    useTransform([pointer.x, pointer.strength], ([v, s]) => (v as number) * (s as number)),
    SPRING,
  );
  const dy = useSpring(
    useTransform([pointer.y, pointer.strength], ([v, s]) => (v as number) * (s as number)),
    SPRING,
  );

  const x = useTransform(dx, (v) => v * LIMITS.x);
  const y = useTransform(dy, (v) => v * LIMITS.y);
  const rotate = useTransform(dx, (v) => v * LIMITS.rotate);
  const rotateY = useTransform(dx, (v) => v * LIMITS.rotateY);
  // Inverted: a positive tilt lifts the chin, so a cursor below needs negative.
  const rotateX = useTransform(dy, (v) => -v * LIMITS.rotateX);

  return (
    <div
      ref={pointer.ref}
      className={clsx("pointer-events-none relative select-none", className)}
      // Perspective is what makes the turn read as a figure rotating rather
      // than a picture skewing.
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative size-full"
        style={{
          x,
          y,
          rotate,
          rotateX,
          rotateY,
          // Leaning from the feet, the way a standing person does.
          transformOrigin: "50% 95%",
        }}
      >
        {/* The breath sits on its own element so it never competes with the
            lean for the transform property. */}
        <motion.div
          className="relative size-full"
          animate={{ scale: [1, 1.008, 1], translateY: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.src}
            alt={config.alt}
            draggable={false}
            className="size-full select-none object-contain object-bottom"
          />
        </motion.div>
      </motion.div>

      {/* A soft contact shadow, so they stand rather than float. It stays put
          while the figure leans over it. */}
      <span
        aria-hidden="true"
        className="absolute bottom-[1%] left-1/2 h-[2.5%] w-[52%] -translate-x-1/2 rounded-[50%] bg-ink-900/25 blur-md"
      />
    </div>
  );
}
