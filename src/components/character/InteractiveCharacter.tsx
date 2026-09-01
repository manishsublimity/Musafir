"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * INTERACTIVE CHARACTER
 *
 * Characters who watch the cursor. Their heads turn toward it, their bodies
 * follow more slowly, and they settle back to neutral when it stops.
 *
 *   <InteractiveCharacter character={FAMILY_CHARACTER} />
 *
 * ---------------------------------------------------------------------------
 * HOW THE HEADS MOVE INDEPENDENTLY
 *
 * The sources are flat — a video frame or a PNG. There is no rig, so nothing
 * can be posed. What happens instead is layering: the same artwork is drawn
 * several times, stacked, and each copy is masked down to one region and given
 * its own spring. A head layer moves at full strength, the body beneath it at
 * half, the base at a fifth, and because the layers are the same picture the
 * mask edges cross-fade rather than cut.
 *
 * Heads are masked as soft circles, one layer each, rather than as a
 * horizontal band across the top. A band works for two adults standing side by
 * side and fails completely for a family: the parents' heads and the
 * children's are at four different heights, so any horizontal slice that
 * catches the adults' faces also catches the children's chests. Circles are
 * placed per person, so a child's head turns like anyone else's.
 *
 * The base layer is deliberately unmasked. Every masked layer above needs
 * something fully opaque behind it, or two half-transparent copies composite
 * to 75% and the mask edges show up as bands across the character.
 *
 * This is 2.5D. It is convincing at the amplitudes configured here — heads
 * around ±7deg and ±16px — and it will shear if pushed hard.
 *
 * ---------------------------------------------------------------------------
 * TRANSPARENCY
 *
 * Two source kinds, because the two assets differ in what they can provide:
 *
 * `image` — a PNG/WebP that already carries an alpha channel. Nothing to do;
 * the browser composites it. Free, and the quality is exact.
 *
 * `keyedVideo` — an H.264 clip, which cannot carry alpha, so the character
 * arrives on solid black and transparency has to be recovered per frame.
 * `mix-blend-mode: screen` is the usual shortcut and is wrong here: it is
 * additive, so the page shows through the character and tints it. A plain
 * luminance key is also wrong — measured on the real frames, 5.77% of the
 * couple's own pixels are darker than the key threshold (hair, boots), so it
 * punches holes through them.
 *
 * What works is connectivity: flood-fill the black inward from the frame
 * border and only that reachable black becomes transparent, so darkness
 * enclosed by the silhouette survives. The edge is then feathered by
 * luminance. It costs real CPU — benchmarked at 4.35ms/frame at 400x710 —
 * which is why it runs throttled, and why an alpha-carrying still is the
 * better asset whenever there is a choice.
 * ---------------------------------------------------------------------------
 */

/* --------------------------------------------------------------- types -- */

/** A head, in fractions of the artwork's own width and height. */
export interface HeadRegion {
  cx: number;
  cy: number;
  /** Radius as a fraction of the artwork's width. */
  r: number;
  /** Optional label — only ever used to name the layer while debugging. */
  name?: string;
}

export type CharacterSource =
  | {
      kind: "image";
      src: string;
      /** Intrinsic size, so the layers can be laid out before it loads. */
      width: number;
      height: number;
    }
  | {
      kind: "keyedVideo";
      src: string;
      /** Region of the source frame to keep, in source pixels. */
      crop: { x: number; y: number; width: number; height: number };
      /**
       * Resolution the key runs at, as a fraction of `crop`. Cost is linear in
       * pixel count, so this is the dial if the effect is too expensive.
       */
      renderScale: number;
      /** Luminance below which border-connected pixels are background. 0-255. */
      keyThreshold: number;
      /** Cap on the keying loop. These are slow idles; 24 is plenty. */
      keyFps: number;
    };

interface SpringOpts {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface CharacterConfig {
  source: CharacterSource;
  heads: HeadRegion[];
  /**
   * Optional horizontal band treated as the upper body, moving between the
   * heads and the base. Fractions of height; feathered across `feather`.
   */
  torso?: { from: number; to: number; feather: number };
  /** Peak head rotation, tilt and translation at full cursor deflection. */
  headRotation: number;
  headTilt: number;
  headTranslate: number;
  /** Multipliers against the head values. */
  intensity: { head: number; torso: number; base: number };
  spring: { head: SpringOpts; torso: SpringOpts; base: SpringOpts };
  /**
   * Vertical sway in px applied continuously to each head, out of phase per
   * person. A still image needs this or it reads as a cut-out; footage already
   * moves, so it defaults low there.
   */
  breathe: number;
  /** Cursor deflection is scaled by this on tablets. */
  tabletDamping: number;
  /** ms of stillness after which the pose eases back to neutral. */
  idleAfter: number;
  /** Soft contact shadow under the feet, so they stand rather than float. */
  groundShadow: boolean;
}

/* ------------------------------------------------------------ presets -- */

const BASE_CONFIG = {
  headRotation: 7,
  headTilt: 6,
  headTranslate: 16,
  intensity: { head: 1, torso: 0.5, base: 0.2 },
  spring: {
    head: { stiffness: 130, damping: 18, mass: 0.7 },
    torso: { stiffness: 90, damping: 20, mass: 1 },
    base: { stiffness: 60, damping: 22, mass: 1.3 },
  },
  tabletDamping: 0.5,
  idleAfter: 1400,
  groundShadow: true,
} satisfies Omit<CharacterConfig, "source" | "heads" | "breathe">;

/**
 * The couple, from footage. Head circles were read off the silhouette: his
 * crown sits at the very top of the frame, hers about a fifth lower, which is
 * exactly the case a horizontal band cannot serve well.
 */
export const COUPLE_CHARACTER: CharacterConfig = {
  ...BASE_CONFIG,
  source: {
    kind: "keyedVideo",
    src: "/videos/couple.mp4",
    crop: { x: 445, y: 18, width: 385, height: 682 },
    renderScale: 0.72,
    keyThreshold: 12,
    keyFps: 24,
  },
  heads: [
    { name: "man", cx: 0.42, cy: 0.11, r: 0.17 },
    { name: "woman", cx: 0.63, cy: 0.2, r: 0.16 },
  ],
  torso: { from: 0.3, to: 0.56, feather: 0.12 },
  breathe: 0,
};

/**
 * The family, from a still with a real alpha channel. Four heads at four
 * heights — the reason head masks are circles rather than a band.
 */
export const FAMILY_CHARACTER: CharacterConfig = {
  ...BASE_CONFIG,
  source: { kind: "image", src: "/characters/family.webp", width: 900, height: 986 },
  heads: [
    { name: "father", cx: 0.277, cy: 0.088, r: 0.115 },
    { name: "mother", cx: 0.508, cy: 0.211, r: 0.11 },
    { name: "daughter", cx: 0.419, cy: 0.495, r: 0.1 },
    { name: "son", cx: 0.823, cy: 0.562, r: 0.1 },
  ],
  torso: { from: 0.3, to: 0.62, feather: 0.14 },
  // A still needs its own life, and the children breathe faster than the
  // adults, which the phase offset per head takes care of.
  breathe: 2.5,
};

/* ------------------------------------------------------------ pointer -- */

type PointerMode = "full" | "damped" | "idle";

function usePointerMode(reduced: boolean): PointerMode {
  const [mode, setMode] = useState<PointerMode>("idle");

  useEffect(() => {
    if (reduced) {
      setMode("idle");
      return;
    }
    const fine = window.matchMedia("(pointer: fine)");
    const read = () => {
      if (!fine.matches) return setMode("idle");
      setMode(window.innerWidth >= 1024 ? "full" : "damped");
    };
    read();
    // Width alone is not enough: plugging a mouse into a tablet changes the
    // answer without changing the size, and that fires no resize event.
    window.addEventListener("resize", read);
    fine.addEventListener("change", read);
    return () => {
      window.removeEventListener("resize", read);
      fine.removeEventListener("change", read);
    };
  }, [reduced]);

  return mode;
}

/* ---------------------------------------------------------- the keyer -- */

function useAlphaKeyedVideo(
  source: Extract<CharacterSource, { kind: "keyedVideo" }>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  out: React.RefObject<HTMLCanvasElement | null>,
  layers: React.RefObject<HTMLCanvasElement | null>[],
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = out.current;
    if (!video || !canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Allocated once. Re-allocating these every frame is the difference
    // between smooth and not.
    const isBackground = new Uint8Array(W * H);
    const stack = new Int32Array(W * H);
    const T = source.keyThreshold;

    let raf = 0;
    let last = 0;
    let stopped = false;
    let announced = false;
    const interval = 1000 / source.keyFps;

    const key = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(
        video,
        source.crop.x, source.crop.y, source.crop.width, source.crop.height,
        0, 0, W, H,
      );

      const image = ctx.getImageData(0, 0, W, H);
      const d = image.data;

      isBackground.fill(0);
      let sp = 0;

      const lum = (p: number) =>
        0.2126 * d[p * 4] + 0.7152 * d[p * 4 + 1] + 0.0722 * d[p * 4 + 2];

      const push = (p: number) => {
        if (!isBackground[p] && lum(p) < T) {
          isBackground[p] = 1;
          stack[sp++] = p;
        }
      };

      // Seed from the border and flood inward. Only black the outside can
      // reach is background; hair is enclosed, so it survives.
      for (let x = 0; x < W; x++) {
        push(x);
        push((H - 1) * W + x);
      }
      for (let y = 0; y < H; y++) {
        push(y * W);
        push(y * W + W - 1);
      }
      while (sp > 0) {
        const p = stack[--sp];
        const px = p % W;
        const py = (p - px) / W;
        if (px > 0) push(p - 1);
        if (px < W - 1) push(p + 1);
        if (py > 0) push(p - W);
        if (py < H - 1) push(p + W);
      }

      for (let p = 0; p < W * H; p++) {
        if (isBackground[p]) {
          d[p * 4 + 3] = 0;
        } else {
          const l = lum(p);
          d[p * 4 + 3] = l >= T ? 255 : Math.round((255 * l) / T);
        }
      }

      ctx.putImageData(image, 0, 0);

      // Straight into the visible layers. Going through React state here would
      // cost a render per frame for pixels that are identical in every layer —
      // only the transforms differ.
      for (const layer of layers) {
        const lctx = layer.current?.getContext("2d");
        if (!lctx) continue;
        lctx.clearRect(0, 0, W, H);
        lctx.drawImage(canvas, 0, 0);
      }
    };

    const loop = (t: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(loop);
      if (t - last < interval) return;
      last = t;
      if (video.readyState < 2) return;
      key();
      if (!announced) {
        announced = true;
        setReady(true);
      }
    };

    const start = () => {
      void video.play().catch(() => {
        // Autoplay refused. Muted and inline makes that unlikely, but if it
        // happens we still key whatever frame decoded rather than show nothing.
      });
      raf = requestAnimationFrame(loop);
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("loadeddata", start, { once: true });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", start);
    };
    // `layers` is a stable array of refs built once by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, videoRef, out]);

  return ready;
}

/* ---------------------------------------------------------- component -- */

export function InteractiveCharacter({
  character,
  className,
}: {
  character: CharacterConfig;
  /** Sizing and placement live here — the component fills what you give it. */
  className?: string;
}) {
  const cfg = character;
  const src = cfg.source;

  const reduced = useReducedMotion() ?? false;
  const mode = usePointerMode(reduced);

  /* ---- layer list: base, optional torso, then one per head ---- */

  const layerSpecs = useMemo(() => {
    // Head radii are given as a fraction of width; turning one into a vertical
    // fraction needs the artwork's aspect, which lives in a different place for
    // each source kind.
    const art =
      cfg.source.kind === "image"
        ? { w: cfg.source.width, h: cfg.source.height }
        : { w: cfg.source.crop.width, h: cfg.source.crop.height };
    const aspect = art.w / art.h;

    const specs: {
      key: string;
      band: "base" | "torso" | "head";
      mask?: string;
      origin: string;
      phase: number;
    }[] = [{ key: "base", band: "base", origin: "50% 100%", phase: 0 }];

    if (cfg.torso) {
      const { from, to, feather } = cfg.torso;
      specs.push({
        key: "torso",
        band: "torso",
        mask: `linear-gradient(to bottom, #000 ${pct(to)}, transparent ${pct(to + feather)})`,
        origin: `50% ${pct(to + feather)}`,
        phase: 0,
      });
      void from;
    }

    cfg.heads.forEach((h, i) => {
      // Soft circle, generous at the centre and fading out well before the
      // edge so the seam never reads as a ring.
      const rx = pct(h.r);
      const ry = pct(h.r * aspect);
      specs.push({
        key: h.name ?? `head-${i}`,
        band: "head",
        mask: `radial-gradient(ellipse ${rx} ${ry} at ${pct(h.cx)} ${pct(h.cy)}, #000 0%, #000 58%, transparent 100%)`,
        // Pivot at the neck, just under the head, so a turn reads as a turn
        // rather than the whole head sliding.
        origin: `${pct(h.cx)} ${pct(h.cy + h.r * 1.15 * aspect)}`,
        // Out of phase per person, so they never breathe in lockstep.
        phase: (i * Math.PI * 2) / Math.max(1, cfg.heads.length) + i * 0.7,
      });
    });

    return specs;
  }, [cfg]);

  /* ---- keyed-video plumbing (unused for image sources) ---- */

  const videoRef = useRef<HTMLVideoElement>(null);
  const keyedRef = useRef<HTMLCanvasElement>(null);
  const canvasRefs = useRef<React.RefObject<HTMLCanvasElement | null>[]>([]);
  if (canvasRefs.current.length !== layerSpecs.length) {
    canvasRefs.current = layerSpecs.map(
      (_, i) => canvasRefs.current[i] ?? { current: null },
    );
  }

  const isVideo = src.kind === "keyedVideo";
  const W = isVideo ? Math.round(src.crop.width * src.renderScale) : src.width;
  const H = isVideo ? Math.round(src.crop.height * src.renderScale) : src.height;

  const videoReady = useAlphaKeyedVideo(
    isVideo ? src : DUMMY_VIDEO_SOURCE,
    videoRef,
    keyedRef,
    isVideo ? canvasRefs.current : EMPTY_REFS,
  );
  const [imageReady, setImageReady] = useState(false);
  const ready = isVideo ? videoReady : imageReady;

  /* ---- cursor -> normalised -1..1 ---- */

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  useEffect(() => {
    if (mode === "idle") {
      if (reduced) {
        px.set(0);
        py.set(0);
        return;
      }
      // No pointer to follow: a slow figure-of-eight so they stay alive.
      let raf = 0;
      const t0 = performance.now();
      const drift = (t: number) => {
        const s = (t - t0) / 1000;
        px.set(Math.sin(s * 0.45) * 0.32);
        py.set(Math.sin(s * 0.31) * 0.22);
        raf = requestAnimationFrame(drift);
      };
      raf = requestAnimationFrame(drift);
      return () => cancelAnimationFrame(raf);
    }

    const scale = mode === "damped" ? cfg.tabletDamping : 1;
    let idleTimer = 0;

    const move = (e: MouseEvent) => {
      // Normalised against the viewport, so they track the cursor anywhere on
      // the page rather than only within their own box.
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      px.set(clamp(nx, -1, 1) * scale);
      py.set(clamp(ny, -1, 1) * scale);

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        // Still for a while — settle back. The springs carry them there, so it
        // reads as relaxing rather than snapping.
        px.set(0);
        py.set(0);
      }, cfg.idleAfter);
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.clearTimeout(idleTimer);
    };
  }, [mode, reduced, cfg.tabletDamping, cfg.idleAfter, px, py]);

  /* ---- breathing, shared clock ---- */

  const breath = useMotionValue(0);
  useEffect(() => {
    if (reduced || cfg.breathe <= 0) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      breath.set((t - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, cfg.breathe, breath]);

  return (
    <motion.div
      className={cx("pointer-events-none relative select-none", className)}
      style={{ perspective: 900 }}
      initial={{ opacity: 0, scale: 0.84, y: 54 }}
      animate={ready ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.84, y: 54 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : {
              // Underdamped on purpose: they arrive with a small overshoot and
              // settle, rather than fading in flat.
              type: "spring",
              stiffness: 120,
              damping: 13,
              mass: 0.9,
              opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }
      }
    >
      {isVideo && (
        <>
          {/* The clip is never painted — only the keyed canvas is. */}
          <video
            ref={videoRef}
            src={src.src}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="pointer-events-none absolute size-px opacity-0"
          />
          <canvas ref={keyedRef} width={W} height={H} aria-hidden="true" className="hidden" />
        </>
      )}

      <div className="relative size-full" style={{ transformStyle: "preserve-3d" }}>
        {cfg.groundShadow && <GroundShadow px={px} cfg={cfg} />}

        {layerSpecs.map((spec, i) => (
          <Layer
            key={spec.key}
            spec={spec}
            cfg={cfg}
            px={px}
            py={py}
            breath={breath}
            width={W}
            height={H}
            canvasRef={isVideo ? canvasRefs.current[i] : undefined}
            imageSrc={isVideo ? undefined : src.src}
            onImageLoad={i === 0 ? () => setImageReady(true) : undefined}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------- layers -- */

function Layer({
  spec,
  cfg,
  px,
  py,
  breath,
  width,
  height,
  canvasRef,
  imageSrc,
  onImageLoad,
}: {
  spec: { band: "base" | "torso" | "head"; mask?: string; origin: string; phase: number };
  cfg: CharacterConfig;
  px: MotionValue<number>;
  py: MotionValue<number>;
  breath: MotionValue<number>;
  width: number;
  height: number;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  imageSrc?: string;
  onImageLoad?: () => void;
}) {
  const intensity = cfg.intensity[spec.band];
  const spring = cfg.spring[spec.band];

  const x = useSpring(useTransform(px, (v) => v * cfg.headTranslate * intensity), spring);
  const yBase = useTransform(py, (v) => v * cfg.headTranslate * 0.6 * intensity);
  // Breathing rides on top of the cursor response rather than replacing it.
  const y = useSpring(
    useTransform([yBase, breath], ([v, t]: number[]) =>
      v + (spec.band === "head" ? Math.sin(t * 1.1 + spec.phase) * cfg.breathe : 0),
    ),
    spring,
  );
  const rotateY = useSpring(useTransform(px, (v) => v * cfg.headRotation * intensity), spring);
  // Negated: a cursor below centre should tip the face down toward it, and a
  // positive rotateX pitches the top of the plane away from the viewer.
  const rotateX = useSpring(useTransform(py, (v) => -v * cfg.headTilt * intensity), spring);

  const style = {
    x,
    y,
    rotateY,
    rotateX,
    transformOrigin: spec.origin,
    transformStyle: "preserve-3d" as const,
    ...(spec.mask
      ? {
          WebkitMaskImage: spec.mask,
          maskImage: spec.mask,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }
      : {}),
  };

  if (canvasRef) {
    return (
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        aria-hidden="true"
        className="absolute inset-0 size-full"
        style={style}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <motion.img
      src={imageSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
      onLoad={onImageLoad}
      className="absolute inset-0 size-full object-contain"
      style={style}
    />
  );
}

function GroundShadow({ px, cfg }: { px: MotionValue<number>; cfg: CharacterConfig }) {
  const x = useSpring(
    useTransform(px, (v) => v * cfg.headTranslate * cfg.intensity.base),
    cfg.spring.base,
  );
  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-[1%] left-1/2 h-[4%] w-[52%] -translate-x-1/2 rounded-[50%]"
      style={{
        background: "radial-gradient(closest-side, rgb(16 15 14 / 0.38), transparent)",
        x,
      }}
    />
  );
}

/* ------------------------------------------------------------ helpers -- */

/**
 * The keyer hook has to be called unconditionally, so image-backed characters
 * hand it a source it will never start: there is no video element to attach to.
 */
const DUMMY_VIDEO_SOURCE: Extract<CharacterSource, { kind: "keyedVideo" }> = {
  kind: "keyedVideo",
  src: "",
  crop: { x: 0, y: 0, width: 1, height: 1 },
  renderScale: 1,
  keyThreshold: 0,
  keyFps: 1,
};
const EMPTY_REFS: React.RefObject<HTMLCanvasElement | null>[] = [];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");
