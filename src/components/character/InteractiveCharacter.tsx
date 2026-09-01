"use client";

import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { CHARACTERS, type CharacterId, type HeadRegion } from "./characters";
import { useMouseTracker } from "./useMouseTracker";
import { cx as clsx } from "@/lib/utils";

/**
 * INTERACTIVE CHARACTER
 *
 * A character who watches the cursor. The whole figure leans toward it, the
 * heads turn further and arrive sooner, the torso sits between the two, and
 * everything settles when the cursor goes away or moves off.
 *
 * ---------------------------------------------------------------------------
 * HOW A FLAT PICTURE TURNS ITS HEAD
 *
 * These are single flattened stills. There is no separate head, body or eye
 * asset, so there is nothing to pose directly. What happens instead is
 * layering: the same image is drawn several times, stacked exactly over
 * itself, and each copy is masked to one region and given its own spring.
 * Because every layer is the same picture, the mask edges cross-fade into one
 * another instead of cutting, and it reads as one character whose head turns
 * rather than as a picture being sheared.
 *
 * The base layer is deliberately unmasked. Every masked layer above needs
 * something fully opaque behind it, or two partly-transparent copies
 * composite to less than one and the mask edges show as bands.
 *
 * This is 2.5D. It is convincing at the amplitudes below and it will shear if
 * pushed hard, which is why the ceilings are low and deliberate.
 *
 * ---------------------------------------------------------------------------
 * WHY THE MOVEMENT IS SPLIT IN TWO
 *
 * The lean belongs to the whole figure, so it is applied once on the
 * container. The turn belongs to the head, so it is applied again on the head
 * layers, on top of the lean. Keeping them separate is what makes the numbers
 * mean something: BODY is how far the character leans, HEAD is how much
 * further the head goes than the shoulders it sits on.
 *
 * The layers use different springs on purpose. Give them all the same one and
 * the character moves as a rigid board however the amplitudes are scaled.
 * Different stiffness produces follow-through — the head arrives first, the
 * torso a beat later, the body later still — and for that moment the figure
 * is genuinely turning rather than sliding.
 */

/* ------------------------------------------------------------- limits -- */

/** How far the whole figure leans at full deflection. */
const BODY = { x: 15, y: 10, rotate: 3 };

/** How much further the head goes, on top of the lean. */
const HEAD = { x: 8, y: 6, rotateX: 6, rotateY: 6 };

/** The torso is the hinge between them. */
const TORSO_SHARE = 0.45;

/** Fastest to slowest, so the body follows the head rather than leading it. */
const SPRINGS = {
  head: { stiffness: 170, damping: 17, mass: 0.7 },
  torso: { stiffness: 110, damping: 19, mass: 1 },
  body: { stiffness: 70, damping: 21, mass: 1.3 },
};

/* -------------------------------------------------------------- masks -- */

/**
 * A circle over one head. The radius is a fraction of the artwork's width, so
 * the vertical radius has to go through the aspect ratio — otherwise the
 * "circle" is an ellipse on every non-square asset.
 */
function headMask(head: HeadRegion, aspect: number) {
  const rx = head.r * 100;
  const ry = head.r * aspect * 100;
  return `radial-gradient(${rx}% ${ry}% at ${head.cx * 100}% ${head.cy * 100}%, #000 58%, transparent 80%)`;
}

/** A feathered horizontal band over the upper body. */
function torsoMask({ from, to, feather }: { from: number; to: number; feather: number }) {
  const a = Math.max(0, from - feather) * 100;
  const b = from * 100;
  const c = to * 100;
  const d = Math.min(1, to + feather) * 100;
  return `linear-gradient(to bottom, transparent ${a}%, #000 ${b}%, #000 ${c}%, transparent ${d}%)`;
}

/* -------------------------------------------------------------- hooks -- */

type Pointer = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  strength: MotionValue<number>;
};

/**
 * Cursor position scaled by the distance falloff, then sprung. Multiplying
 * before the spring rather than after means the character eases as attention
 * fades instead of snapping back to neutral when the cursor leaves.
 */
function useDeflection(pointer: Pointer, spring: { stiffness: number; damping: number; mass: number }) {
  const x = useSpring(
    useTransform([pointer.x, pointer.strength], ([v, s]) => (v as number) * (s as number)),
    spring,
  );
  const y = useSpring(
    useTransform([pointer.y, pointer.strength], ([v, s]) => (v as number) * (s as number)),
    spring,
  );
  return { x, y };
}

/* -------------------------------------------------------------- parts -- */

/**
 * One masked copy of the artwork, carrying the head's extra turn. `share`
 * scales every limit, which is how the hierarchy — head strongest, torso
 * between, base none — is expressed without repeating the transform maths.
 */
function Layer({
  src,
  alt,
  mask,
  share,
  spring,
  pointer,
  idle,
  priority,
}: {
  src: string;
  alt: string;
  mask?: string;
  share: number;
  spring: { stiffness: number; damping: number; mass: number };
  pointer: Pointer;
  /** Vertical drift in px for the idle float; 0 disables it. */
  idle: number;
  priority?: boolean;
}) {
  const d = useDeflection(pointer, spring);

  const x = useTransform(d.x, (v) => v * HEAD.x * share);
  const y = useTransform(d.y, (v) => v * HEAD.y * share);
  const rotateY = useTransform(d.x, (v) => v * HEAD.rotateY * share);
  // Inverted: a positive tilt lifts the chin, so looking down needs a negative
  // rotateX for a cursor below the character.
  const rotateX = useTransform(d.y, (v) => -v * HEAD.rotateX * share);

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      className="absolute inset-0 size-full select-none object-contain"
      style={{
        x,
        y,
        rotateX,
        rotateY,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
      // Idle life, so the character is never wholly still. Deliberately at the
      // edge of perception — a couple of pixels over several seconds — and out
      // of phase per layer, or the whole figure bobs as one block.
      animate={idle ? { translateY: [0, -idle, 0] } : undefined}
      transition={idle ? { duration: 4.5 + share * 2, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}

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
  const aspect = config.width / config.height;
  const alive = pointer.mode !== "off";

  // The lean, applied once to the whole figure.
  const body = useDeflection(pointer, SPRINGS.body);
  const bodyX = useTransform(body.x, (v) => v * BODY.x);
  const bodyY = useTransform(body.y, (v) => v * BODY.y);
  const bodyRotate = useTransform(body.x, (v) => v * BODY.rotate);

  return (
    <div
      ref={pointer.ref}
      className={clsx("pointer-events-none relative select-none", className)}
      // Perspective is what makes rotateX/rotateY read as a head turning
      // rather than a picture skewing. Without it the rotations are flat.
      style={{ perspective: 900 }}
    >
      <motion.div
        className="relative size-full"
        style={{
          x: bodyX,
          y: bodyY,
          rotate: bodyRotate,
          transformStyle: "preserve-3d",
          // Leaning from the feet, the way a standing person does.
          transformOrigin: "50% 95%",
        }}
      >
        {/* The breath sits on its own element so it cannot fight the lean for
            the transform property. 0.5% is not consciously visible; its
            absence is. */}
        <motion.div
          className="relative size-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ scale: [1, 1.005, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Base — unmasked, so every masked layer above has something solid
              behind it. It carries the lean only, no turn of its own. */}
          <Layer
            src={config.src}
            alt={config.alt}
            share={0}
            spring={SPRINGS.body}
            pointer={pointer}
            idle={alive ? 2 : 3}
            priority
          />

          {/* Upper body — the hinge between the lean and the turn. */}
          <Layer
            src={config.src}
            alt=""
            mask={torsoMask(config.torso)}
            share={TORSO_SHARE}
            spring={SPRINGS.torso}
            pointer={pointer}
            idle={alive ? 2.5 : 3.5}
          />

          {/* One layer per head, so a child's head turns like anyone else's. */}
          {config.heads.map((head) => (
            <Layer
              key={head.name ?? `${head.cx}-${head.cy}`}
              src={config.src}
              alt=""
              mask={headMask(head, aspect)}
              share={1}
              spring={SPRINGS.head}
              pointer={pointer}
              idle={alive ? 3 : 4}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* A soft contact shadow, so they stand rather than float. It stays put
          while the figure leans over it. */}
      <span
        aria-hidden="true"
        className="absolute bottom-[1%] left-1/2 h-[3%] w-[54%] -translate-x-1/2 rounded-[50%] bg-ink-900/25 blur-md"
      />
    </div>
  );
}
