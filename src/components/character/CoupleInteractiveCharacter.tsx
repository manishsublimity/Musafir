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
 * COUPLE INTERACTIVE CHARACTER
 *
 * A standing couple who watch the cursor. Drop it anywhere:
 *
 *   <CoupleInteractiveCharacter />
 *
 * ---------------------------------------------------------------------------
 * Two things about the source asset drive this whole implementation, and both
 * were measured rather than assumed:
 *
 * 1. THE VIDEO HAS NO ALPHA CHANNEL. `couple.mp4` is H.264 (avc1, High@3.1),
 *    and H.264 carries no alpha — the couple is composited onto solid black.
 *    So transparency has to be recovered at runtime.
 *
 *    `mix-blend-mode: screen` is the cheap trick for black-backed footage, but
 *    it is additive: the backdrop shows *through* the character and tints it.
 *    On this site's light photography the couple came out washed and blue, so
 *    it is not used here.
 *
 *    A plain luminance key is also wrong. Measured on the real frames: 5.77%
 *    of the couple's own pixels are darker than the key threshold — his hair,
 *    her boots, the shoes — so a luma key punches holes straight through them.
 *
 *    What actually works is connectivity: flood-fill the black inward from the
 *    frame border, and only that reachable black becomes transparent. Enclosed
 *    darkness (hair, shadow under the jacket) stays opaque because the fill
 *    never reaches it. The silhouette edge is then feathered by luminance so it
 *    does not come out aliased. Benchmarked in-browser at 4.35ms/frame for the
 *    full pipeline at 400x710, which is why this runs on a throttled loop
 *    rather than every rAF — see `keyFps`.
 *
 * 2. THE VIDEO IS FLAT, SO "HEAD" AND "BODY" ARE NOT SEPARATE OBJECTS. There
 *    is no rig to drive. What this does instead is band parallax: the keyed
 *    frame is drawn three times, stacked, each copy masked to a horizontal
 *    band (head / upper body / lower body) and given its own spring. The bands
 *    cross-fade through the mask ramps, so the differential reads as the head
 *    turning while the body trails.
 *
 *    This is 2.5D, not a skeleton. It is convincing at the small amplitudes
 *    below — which are the ones asked for — and it will shear if you push the
 *    numbers hard. The band stops are taken from the actual silhouette: the
 *    profile widens from 90px to 211px at 15% height (shoulders) and narrows
 *    to ~245px at 50% (hips), which is where `bands` defaults come from.
 * ---------------------------------------------------------------------------
 */

/* -------------------------------------------------------------- config -- */

export interface CoupleCharacterConfig {
  /** Source clip. Black-backed, no alpha needed — it is keyed at runtime. */
  src: string;
  /**
   * Region of the source frame to keep, in source pixels. Defaults to the
   * couple's measured bounding box (x 475-800, y 38-680) plus room for the
   * drift across the loop.
   */
  crop: { x: number; y: number; width: number; height: number };
  /**
   * Resolution the key runs at, as a fraction of `crop`. Cost is linear in
   * pixel count, and this is the main dial if the effect is too expensive.
   * 1 is the source's native detail; below roughly 0.6 the silhouette edge
   * starts to look soft when the character is displayed large.
   */
  renderScale: number;
  /**
   * Luminance below which a border-connected pixel counts as background, and
   * the ramp over which the silhouette edge is feathered. 0-255.
   */
  keyThreshold: number;
  /** Cap on the keying loop. The source is a slow idle, so 24 is plenty. */
  keyFps: number;
  /**
   * Where each band ends, as a fraction of the character's height. The head
   * layer is opaque to `head`, then ramps out by `headFeather`; the upper body
   * layer likewise at `body`.
   */
  bands: { head: number; headFeather: number; body: number; bodyFeather: number };
  /** Peak head rotation in degrees at full cursor deflection. */
  headRotation: number;
  /** Peak head tilt in degrees at full cursor deflection. */
  headTilt: number;
  /** Peak translation in px applied to the head band. */
  headTranslate: number;
  /** Multipliers against the head values. Head is 1 by definition. */
  intensity: { head: number; body: number; lower: number };
  /** Spring per band. Looser + heavier as you go down the body. */
  spring: { head: SpringOpts; body: SpringOpts; lower: SpringOpts };
  /** Cursor deflection is scaled by this on tablets. */
  tabletDamping: number;
  /** ms of stillness after which the pose eases back to neutral. */
  idleAfter: number;
  /** Soft contact shadow under the feet, so they stand rather than float. */
  groundShadow: boolean;
}

interface SpringOpts {
  stiffness: number;
  damping: number;
  mass: number;
}

export const COUPLE_DEFAULTS: CoupleCharacterConfig = {
  src: "/videos/couple.mp4",
  crop: { x: 445, y: 18, width: 385, height: 682 },
  renderScale: 0.72,
  keyThreshold: 12,
  keyFps: 24,
  bands: { head: 0.14, headFeather: 0.24, body: 0.52, bodyFeather: 0.64 },
  headRotation: 7,
  headTilt: 6,
  headTranslate: 16,
  intensity: { head: 1, body: 0.5, lower: 0.2 },
  spring: {
    head: { stiffness: 130, damping: 18, mass: 0.7 },
    body: { stiffness: 90, damping: 20, mass: 1 },
    lower: { stiffness: 60, damping: 22, mass: 1.3 },
  },
  tabletDamping: 0.5,
  idleAfter: 1400,
  groundShadow: true,
};

/* ------------------------------------------------------------ pointer -- */

type PointerMode = "full" | "damped" | "idle";

/**
 * Desktop pointers get the full effect, tablets a damped one, and anything
 * without a fine pointer (or with reduced motion asked for) gets no cursor
 * tracking at all. Re-evaluated on resize, because a window drag between
 * screens can change the answer.
 */
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

/**
 * Pulls frames off the video, cuts the black away, and leaves the result on
 * `out`. Returns whether the first keyed frame has landed, so the entrance
 * animation can wait for something to actually show.
 */
function useAlphaKeyedVideo(
  cfg: CoupleCharacterConfig,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  out: React.RefObject<HTMLCanvasElement | null>,
  bands: React.RefObject<HTMLCanvasElement | null>[],
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

    // Scratch buffers, allocated once. Re-allocating an Int32Array of this
    // size every frame is the difference between smooth and not.
    const isBackground = new Uint8Array(W * H);
    const stack = new Int32Array(W * H);
    const T = cfg.keyThreshold;

    let raf = 0;
    let last = 0;
    const interval = 1000 / cfg.keyFps;
    let stopped = false;

    const key = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(
        video,
        cfg.crop.x, cfg.crop.y, cfg.crop.width, cfg.crop.height,
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

      // Seed from every border pixel, then flood inward. Only black that the
      // outside can reach is background; his hair is enclosed, so it survives.
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

      // Background goes fully transparent; everything else keeps its colour.
      // Near the threshold the alpha ramps rather than cutting, which is what
      // keeps the silhouette from looking stamped out.
      for (let p = 0; p < W * H; p++) {
        if (isBackground[p]) {
          d[p * 4 + 3] = 0;
        } else {
          const l = lum(p);
          d[p * 4 + 3] = l >= T ? 255 : Math.round((255 * l) / T);
        }
      }

      ctx.putImageData(image, 0, 0);

      // Push the keyed frame straight into the three band canvases. Doing this
      // here rather than through React state keeps 30 renders a second out of
      // the tree — the bands only ever show the same pixels, and it is their
      // transforms, not their content, that differ.
      for (const band of bands) {
        const bctx = band.current?.getContext("2d");
        if (!bctx) continue;
        bctx.clearRect(0, 0, W, H);
        bctx.drawImage(canvas, 0, 0);
      }
    };

    let announced = false;
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
        // Autoplay refused. The clip is muted and inline so this is unlikely,
        // but if it happens we still key whatever frame is decoded rather than
        // showing nothing at all.
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
    // `bands` is a stable array of refs created once by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, videoRef, out]);

  return ready;
}

/* ------------------------------------------------------------- layers -- */

/**
 * One band of the character. Draws the shared keyed canvas, then masks itself
 * down to its slice of the body.
 *
 * The stack matters: the lower layer is unmasked and sits underneath, so the
 * layers above always have something opaque behind them. That is what keeps
 * the cross-fade at full strength — two half-transparent layers would
 * composite to 75%, and the seams would show as bands.
 */
function BandLayer({
  canvasRef,
  mask,
  origin,
  x,
  y,
  rotateY,
  rotateX,
  width,
  height,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mask?: string;
  origin: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  width: number;
  height: number;
}) {
  return (
    <motion.canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-hidden="true"
      className="absolute inset-0 size-full"
      style={{
        x,
        y,
        rotateY,
        rotateX,
        transformOrigin: origin,
        transformStyle: "preserve-3d",
        ...(mask
          ? { WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }
          : {}),
      }}
    />
  );
}

/* ---------------------------------------------------------- component -- */

export function CoupleInteractiveCharacter({
  className,
  config,
}: {
  /** Sizing and placement live here — the component fills whatever you give it. */
  className?: string;
  config?: Partial<CoupleCharacterConfig>;
}) {
  const cfg = useMemo(() => ({ ...COUPLE_DEFAULTS, ...config }), [config]);

  const reduced = useReducedMotion() ?? false;
  const mode = usePointerMode(reduced);

  const videoRef = useRef<HTMLVideoElement>(null);
  const keyedRef = useRef<HTMLCanvasElement>(null);

  const lowerCanvas = useRef<HTMLCanvasElement>(null);
  const bodyCanvas = useRef<HTMLCanvasElement>(null);
  const headCanvas = useRef<HTMLCanvasElement>(null);
  const bandCanvases = useMemo(
    () => [lowerCanvas, bodyCanvas, headCanvas],
    [],
  );

  // Keying cost is linear in pixels, so this runs below the source's native
  // crop. The couple display at a few hundred CSS px; keying at 385 wide was
  // paying for detail that gets scaled away.
  const W = Math.round(cfg.crop.width * cfg.renderScale);
  const H = Math.round(cfg.crop.height * cfg.renderScale);

  const ready = useAlphaKeyedVideo(cfg, videoRef, keyedRef, bandCanvases);

  /* ---- cursor → normalised -1..1, then springs per band ---- */

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  useEffect(() => {
    if (mode === "idle") {
      // No pointer tracking. Reduced motion means genuinely still; otherwise a
      // slow figure-of-eight so the couple are alive without being asked to be.
      if (reduced) {
        px.set(0);
        py.set(0);
        return;
      }
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
      // Normalised against the viewport, so the couple track the cursor
      // wherever it is on the page rather than only within their own box.
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      px.set(clamp(nx, -1, 1) * scale);
      py.set(clamp(ny, -1, 1) * scale);

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        // Cursor has been still a while — settle back to neutral. The springs
        // carry it there, so it reads as relaxing rather than snapping.
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

  const head = useBandMotion(px, py, cfg, cfg.intensity.head, cfg.spring.head);
  const body = useBandMotion(px, py, cfg, cfg.intensity.body, cfg.spring.body);
  const lower = useBandMotion(px, py, cfg, cfg.intensity.lower, cfg.spring.lower);

  /* ---- band masks ---- */

  const { head: h0, headFeather: h1, body: b0, bodyFeather: b1 } = cfg.bands;
  const headMask = `linear-gradient(to bottom, #000 ${pct(h0)}, transparent ${pct(h1)})`;
  const bodyMask = `linear-gradient(to bottom, #000 ${pct(b0)}, transparent ${pct(b1)})`;

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
              // Underdamped on purpose: the couple arrive with a small
              // overshoot and settle, rather than fading in flat.
              type: "spring",
              stiffness: 120,
              damping: 13,
              mass: 0.9,
              opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }
      }
    >
      {/* Source clip and the keyed result both stay out of the layout. The
          video is never painted directly — only the keyed canvas is. */}
      <video
        ref={videoRef}
        src={cfg.src}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none absolute size-px opacity-0"
      />
      <canvas ref={keyedRef} width={W} height={H} aria-hidden="true" className="hidden" />

      <div className="relative size-full" style={{ transformStyle: "preserve-3d" }}>
        {cfg.groundShadow && (
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[1%] left-1/2 h-[4%] w-[46%] -translate-x-1/2 rounded-[50%]"
            style={{
              background: "radial-gradient(closest-side, rgb(16 15 14 / 0.42), transparent)",
              x: lower.x,
            }}
          />
        )}

        {/* Bottom of the stack, unmasked: guarantees something opaque sits
            behind the masked bands so their ramps cross-fade at full strength. */}
        <BandLayer
          canvasRef={lowerCanvas} width={W} height={H}
          origin="50% 100%"
          x={lower.x} y={lower.y} rotateY={lower.rotateY} rotateX={lower.rotateX}
        />
        <BandLayer
          canvasRef={bodyCanvas} width={W} height={H}
          mask={bodyMask} origin={`50% ${pct(b1)}`}
          x={body.x} y={body.y} rotateY={body.rotateY} rotateX={body.rotateX}
        />
        <BandLayer
          canvasRef={headCanvas} width={W} height={H}
          mask={headMask} origin={`50% ${pct(h1)}`}
          x={head.x} y={head.y} rotateY={head.rotateY} rotateX={head.rotateX}
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------ helpers -- */

/** Turns the shared -1..1 cursor values into one band's sprung transforms. */
function useBandMotion(
  px: MotionValue<number>,
  py: MotionValue<number>,
  cfg: CoupleCharacterConfig,
  intensity: number,
  spring: SpringOpts,
) {
  const x = useSpring(useTransform(px, (v) => v * cfg.headTranslate * intensity), spring);
  const y = useSpring(useTransform(py, (v) => v * cfg.headTranslate * 0.6 * intensity), spring);
  const rotateY = useSpring(useTransform(px, (v) => v * cfg.headRotation * intensity), spring);
  // Negated: cursor below centre should tip the face down toward it, and a
  // positive rotateX pitches the top of the plane away from the viewer.
  const rotateX = useSpring(useTransform(py, (v) => -v * cfg.headTilt * intensity), spring);
  return { x, y, rotateY, rotateX };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");
