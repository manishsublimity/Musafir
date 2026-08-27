import type { SceneArchetype, ScenePalette } from "@/lib/types";
import { seededRandom } from "@/lib/utils";

/**
 * SCENE GEOMETRY
 *
 * Builds a complete, serialisable description of a generated scene from a seed.
 *
 * This is separated from rendering for one important reason: the pseudo-random
 * generator is *stateful*, so calling it during render means a second render
 * pass (React StrictMode, a re-render, a hydration) produces different
 * geometry and the tree mismatches. Geometry is therefore computed once per
 * seed, memoised, and rendered as inert data.
 */

export const SCENE_W = 1200;
export const SCENE_H = 800;

export type Shape =
  | { t: "path"; d: string; fill?: string; opacity?: number; stroke?: string; sw?: number }
  | { t: "rect"; x?: number; y?: number; w: number; h: number; fill: string; opacity?: number }
  | { t: "circle"; cx: number; cy: number; r: number; fill: string; opacity?: number }
  | { t: "ellipse"; cx: number; cy: number; rx: number; ry: number; fill: string; opacity?: number }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; sw: number; opacity?: number }
  | { t: "g"; fill?: string; opacity?: number; transform?: string; children: Shape[] };

export interface SceneGeometry {
  sun: { x: number; y: number };
  /** Painted beneath the landform — water bodies, gradients. */
  shapes: Shape[];
  /** Rendered with the water gradient rather than a flat fill. */
  waterRects: { y: number; h: number; opacity?: number }[];
}

const cache = new Map<string, SceneGeometry>();

export function buildScene(scene: SceneArchetype, seed: string, palette: ScenePalette): SceneGeometry {
  const key = `${scene}::${seed}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rand = seededRandom(`${scene}:${seed}`);
  const geometry: SceneGeometry = {
    sun: { x: 240 + rand() * 720, y: 200 + rand() * 180 },
    shapes: [],
    waterRects: [],
  };

  switch (scene) {
    case "mountain":
      ridges(geometry, palette, rand, false);
      break;
    case "snow":
      ridges(geometry, palette, rand, true);
      break;
    case "desert":
      dunes(geometry, palette, rand);
      break;
    case "city":
      skyline(geometry, palette, rand);
      break;
    case "forest":
      forest(geometry, palette, rand);
      break;
    case "island":
      atoll(geometry, palette, rand, false);
      break;
    case "reef":
      atoll(geometry, palette, rand, true);
      break;
    case "beach":
      shore(geometry, palette, rand);
      break;
    case "backwater":
      backwater(geometry, palette, rand);
      break;
    case "heritage":
      heritage(geometry, palette, rand);
      break;
    case "aurora":
      aurora(geometry, palette, rand);
      break;
    case "savannah":
      savannah(geometry, palette, rand);
      break;
    default:
      ridges(geometry, palette, rand, false);
  }

  cache.set(key, geometry);
  return geometry;
}

/* ------------------------------------------------------------- generators -- */

type Rand = () => number;
const W = SCENE_W;
const H = SCENE_H;

const n = (value: number) => Math.round(value * 10) / 10;

/** A jagged ridge line across the full width at a given base height. */
function ridgePath(baseY: number, amplitude: number, peaks: number, rand: Rand): string {
  const step = W / peaks;
  let d = `M -40 ${H} L -40 ${n(baseY + rand() * 20)}`;
  for (let i = 0; i <= peaks; i++) {
    const x = i * step;
    const peakY = baseY - rand() * amplitude;
    const shoulder = x + step * (0.35 + rand() * 0.2);
    d += ` L ${n(x)} ${n(peakY)} L ${n(shoulder)} ${n(peakY + amplitude * (0.25 + rand() * 0.35))}`;
  }
  return `${d} L ${W + 40} ${n(baseY)} L ${W + 40} ${H} Z`;
}

function ridges(g: SceneGeometry, p: ScenePalette, rand: Rand, snowy: boolean) {
  const layers: [number, number, number, string, number][] = [
    [430, 190, 5, p.land[2], 0.45],
    [520, 150, 7, p.land[1], 0.8],
    [610, 110, 6, p.land[0], 1],
  ];
  for (const [y, amp, peaks, fill, opacity] of layers) {
    g.shapes.push({ t: "path", d: ridgePath(y, amp, peaks, rand), fill, opacity });
  }
  if (snowy) {
    // Snow reads as a lighter ridge drawn just above the nearest one, rather
    // than as a clip — clip-path on SVG children is unreliable across browsers.
    g.shapes.push({
      t: "path",
      d: ridgePath(560, 150, 6, seededRandom(`snow:${p.glow}`)),
      fill: "#ffffff",
      opacity: 0.14,
    });
  }
}

function dunes(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const layers: [number, string, number][] = [
    [470, p.land[2], 0.5],
    [545, p.land[1], 0.8],
    [630, p.land[0], 1],
  ];
  for (const [y, fill, opacity] of layers) {
    const c1 = 200 + rand() * 200;
    const c2 = 700 + rand() * 300;
    const dip = y + 40 + rand() * 60;
    const rise = y - 30 - rand() * 50;
    g.shapes.push({
      t: "path",
      d: `M -40 ${H} L -40 ${y} C ${n(c1)} ${n(rise)}, ${n(c2)} ${n(dip)}, ${W + 40} ${y - 20} L ${W + 40} ${H} Z`,
      fill,
      opacity,
    });
  }
}

function skyline(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const towers: { x: number; w: number; h: number }[] = [];
  let x = -30;
  while (x < W + 30) {
    const w = 26 + rand() * 66;
    const h = 90 + rand() * 330;
    towers.push({ x: n(x), w: n(w), h: n(h) });
    x += w + 4 + rand() * 14;
  }
  const baseY = 660;

  g.shapes.push({
    t: "g",
    fill: p.land[2],
    opacity: 0.4,
    children: towers
      .filter((_, i) => i % 2 === 0)
      .map((t) => ({ t: "rect" as const, x: t.x + 14, y: n(baseY - t.h * 0.72), w: t.w, h: t.h, fill: p.land[2] })),
  });

  g.shapes.push({
    t: "g",
    fill: p.land[1],
    children: towers.map((t) => ({
      t: "rect" as const,
      x: t.x,
      y: n(baseY - t.h),
      w: t.w,
      h: n(t.h + 200),
      fill: p.land[1],
    })),
  });

  // One landmark tower so the silhouette has a focal point.
  const lx = W * 0.52;
  g.shapes.push({
    t: "path",
    d: `M ${lx - 26} ${baseY} L ${lx - 12} 190 L ${lx} 96 L ${lx + 12} 190 L ${lx + 26} ${baseY} Z`,
    fill: p.land[0],
  });

  const windows: Shape[] = [];
  for (const t of towers.slice(0, 26)) {
    for (let k = 0; k < 5; k++) {
      windows.push({
        t: "rect",
        x: n(t.x + 6 + rand() * Math.max(2, t.w - 14)),
        y: n(baseY - t.h + 18 + rand() * Math.max(10, t.h - 40)),
        w: 3,
        h: 6,
        fill: p.glow,
        opacity: n(0.3 + rand() * 0.7),
      });
    }
  }
  g.shapes.push({ t: "g", opacity: 0.5, children: windows });

  g.shapes.push({ t: "rect", y: baseY, w: W, h: H - baseY, fill: p.land[0] });
  g.waterRects.push({ y: baseY, h: H - baseY, opacity: 0.35 });
}

function forest(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const hill = (y: number, fill: string, opacity: number): Shape => ({
    t: "path",
    d: `M -40 ${H} L -40 ${y} C ${n(240 + rand() * 160)} ${n(y - 70 - rand() * 60)}, ${n(760 + rand() * 200)} ${y + 40}, ${W + 40} ${y - 30} L ${W + 40} ${H} Z`,
    fill,
    opacity,
  });

  g.shapes.push(hill(440, p.land[2], 0.45));
  g.shapes.push(hill(540, p.land[1], 0.85));
  g.shapes.push(hill(640, p.land[0], 1));

  const pines: Shape[] = [];
  for (let i = 0; i < 42; i++) {
    const px = n(-20 + rand() * (W + 40));
    const py = n(640 + rand() * 120);
    const s = 0.55 + rand() * 1.1;
    pines.push({
      t: "path",
      d: `M ${px} ${py} l ${n(-16 * s)} ${n(52 * s)} l ${n(32 * s)} 0 Z`,
      fill: p.land[0],
      opacity: 0.85,
    });
  }
  g.shapes.push({ t: "g", children: pines });
}

/** A palm silhouette as a transform group, so it stays one reusable shape. */
function palm(x: number, y: number, scale: number, fill: string): Shape {
  return {
    t: "g",
    fill,
    transform: `translate(${n(x)} ${n(y)}) scale(${scale.toFixed(2)})`,
    children: [
      { t: "path", d: "M -2 0 q 2 -28 6 -46 l 4 1 q -5 20 -6 45 Z", fill },
      { t: "path", d: "M 8 -46 q 22 -12 34 -3 q -20 -2 -33 8 Z", fill },
      { t: "path", d: "M 8 -46 q 18 -22 33 -20 q -20 6 -30 24 Z", fill },
      { t: "path", d: "M 6 -46 q -22 -12 -34 -3 q 20 -2 33 8 Z", fill },
      { t: "path", d: "M 6 -46 q -18 -22 -33 -20 q 20 6 30 24 Z", fill },
      { t: "path", d: "M 7 -47 q 2 -24 -2 -32 q 10 12 8 32 Z", fill },
    ],
  };
}

function atoll(g: SceneGeometry, p: ScenePalette, rand: Rand, reef: boolean) {
  const horizon = 470;
  g.waterRects.push({ y: horizon, h: H - horizon });

  // The pale lagoon shelf is what reads instantly as shallow tropical water.
  g.shapes.push({ t: "ellipse", cx: W * 0.5, cy: horizon + 180, rx: W * 0.72, ry: 140, fill: p.land[2], opacity: 0.42 });
  g.shapes.push({ t: "ellipse", cx: W * 0.5, cy: horizon + 210, rx: W * 0.5, ry: 92, fill: p.land[2], opacity: 0.5 });

  if (reef) {
    const bommies: Shape[] = [];
    for (let i = 0; i < 9; i++) {
      bommies.push({
        t: "ellipse",
        cx: n(120 + rand() * 960),
        cy: n(horizon + 90 + rand() * 200),
        rx: n(30 + rand() * 60),
        ry: n(16 + rand() * 26),
        fill: p.land[0],
      });
    }
    g.shapes.push({ t: "g", opacity: 0.4, children: bommies });
  }

  g.shapes.push({
    t: "path",
    d: `M ${W * 0.18} ${horizon + 96} Q ${W * 0.5} ${horizon + 52}, ${W * 0.82} ${horizon + 96} Q ${W * 0.5} ${horizon + 132}, ${W * 0.18} ${horizon + 96} Z`,
    fill: p.land[2],
    opacity: 0.9,
  });

  const palms: Shape[] = [];
  for (let i = 0; i < 6; i++) {
    palms.push(palm(W * 0.3 + i * 78 + rand() * 24, horizon + 92, 0.8 + rand() * 0.5, p.land[0]));
  }
  g.shapes.push({ t: "g", children: palms });

  const glints: Shape[] = [];
  for (let i = 0; i < 14; i++) {
    const y = n(horizon + 40 + rand() * 300);
    const x = n(rand() * W);
    glints.push({ t: "line", x1: x, y1: y, x2: n(x + 24 + rand() * 70), y2: y, stroke: p.glow, sw: 2 });
  }
  g.shapes.push({ t: "g", opacity: 0.28, children: glints });
}

function shore(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const horizon = 440;
  g.waterRects.push({ y: horizon, h: H - horizon });

  // Sun path on the water.
  g.shapes.push({
    t: "path",
    d: `M ${W * 0.46} ${horizon} L ${W * 0.3} ${H} L ${W * 0.7} ${H} L ${W * 0.54} ${horizon} Z`,
    fill: p.glow,
    opacity: 0.2,
  });

  g.shapes.push({
    t: "path",
    d: `M -40 ${horizon + 30} Q ${W * 0.12} ${horizon - 70}, ${W * 0.3} ${horizon + 34} L ${W * 0.3} ${H} L -40 ${H} Z`,
    fill: p.land[0],
    opacity: 0.92,
  });

  g.shapes.push({
    t: "path",
    d: `M -40 ${H} L -40 ${H - 130} Q ${W * 0.4} ${H - 205}, ${W + 40} ${H - 120} L ${W + 40} ${H} Z`,
    fill: p.land[2],
    opacity: 0.85,
  });

  const waves: Shape[] = [];
  for (let i = 0; i < 5; i++) {
    const y = n(H - 150 - i * 46 - rand() * 16);
    waves.push({
      t: "path",
      d: `M -40 ${y} Q ${W * 0.5} ${n(y - 16 - rand() * 14)}, ${W + 40} ${y}`,
      stroke: p.land[2],
      sw: 3,
    });
  }
  g.shapes.push({ t: "g", opacity: 0.4, children: waves });

  const palms: Shape[] = [];
  for (let i = 0; i < 4; i++) {
    palms.push(palm(W * 0.72 + i * 92 + rand() * 30, H - 130, 1.3 + rand() * 0.7, p.land[0]));
  }
  g.shapes.push({ t: "g", children: palms });
}

function backwater(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const horizon = 460;
  g.waterRects.push({ y: horizon, h: H - horizon });

  // Two banks converging — the signature backwater channel.
  g.shapes.push({
    t: "path",
    d: `M -40 ${horizon} L ${W * 0.42} ${horizon + 6} L ${W * 0.1} ${H} L -40 ${H} Z`,
    fill: p.land[0],
  });
  g.shapes.push({
    t: "path",
    d: `M ${W + 40} ${horizon} L ${W * 0.58} ${horizon + 6} L ${W * 0.9} ${H} L ${W + 40} ${H} Z`,
    fill: p.land[0],
  });

  const palms: Shape[] = [];
  for (let i = 0; i < 8; i++) {
    palms.push(palm(-10 + i * 58 + rand() * 20, horizon + 30 + i * 34, 0.9 + i * 0.14, p.land[1]));
  }
  for (let i = 0; i < 8; i++) {
    palms.push(palm(W + 10 - i * 58 - rand() * 20, horizon + 30 + i * 34, 0.9 + i * 0.14, p.land[1]));
  }
  g.shapes.push({ t: "g", children: palms });

  const reflections: Shape[] = [];
  for (let i = 0; i < 10; i++) {
    const y = horizon + 50 + i * 28;
    reflections.push({
      t: "line",
      x1: W * 0.44,
      y1: y,
      x2: n(W * 0.56 + rand() * 40),
      y2: y,
      stroke: p.glow,
      sw: 2,
    });
  }
  g.shapes.push({ t: "g", opacity: 0.22, children: reflections });
}

function heritage(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const baseY = 640;
  g.shapes.push({ t: "path", d: ridgePath(500, 90, 5, rand), fill: p.land[2], opacity: 0.4 });

  const wall: Shape[] = [
    { t: "rect", x: W * 0.12, y: baseY - 170, w: W * 0.76, h: 220, fill: p.land[1] },
  ];
  for (let i = 0; i < 22; i++) {
    wall.push({
      t: "rect",
      x: n(W * 0.12 + (i * W * 0.76) / 22),
      y: baseY - 192,
      w: 22,
      h: 26,
      fill: p.land[1],
    });
  }
  g.shapes.push({ t: "g", children: wall });

  const domes: Shape[] = [
    { t: "rect", x: W * 0.2, y: baseY - 260, w: 72, h: 96, fill: p.land[0] },
    { t: "path", d: `M ${W * 0.2} ${baseY - 260} q 36 -66, 72 0 Z`, fill: p.land[0] },
    { t: "rect", x: W * 0.7, y: baseY - 300, w: 86, h: 136, fill: p.land[0] },
    { t: "path", d: `M ${W * 0.7} ${baseY - 300} q 43 -78, 86 0 Z`, fill: p.land[0] },
    { t: "rect", x: W * 0.44, y: baseY - 340, w: 110, h: 176, fill: p.land[0] },
    { t: "path", d: `M ${W * 0.44} ${baseY - 340} q 55 -96, 110 0 Z`, fill: p.land[0] },
  ];
  g.shapes.push({ t: "g", children: domes });
  g.shapes.push({ t: "rect", y: baseY + 50, w: W, h: H - baseY - 50, fill: p.land[0] });
}

function aurora(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const bands: Shape[] = [];
  for (let i = 0; i < 4; i++) {
    const y = 120 + i * 62;
    const sway = 60 + rand() * 90;
    bands.push({
      t: "path",
      d: `M -60 ${y} C ${W * 0.25} ${n(y - sway)}, ${W * 0.6} ${n(y + sway)}, ${W + 60} ${n(y - sway * 0.4)}`,
      stroke: p.sky[2],
      sw: n(22 + rand() * 46),
      opacity: n(0.16 + rand() * 0.2),
    });
  }
  g.shapes.push({ t: "g", opacity: 0.55, children: bands });

  const stars: Shape[] = [];
  for (let i = 0; i < 70; i++) {
    stars.push({
      t: "circle",
      cx: n(rand() * W),
      cy: n(rand() * 420),
      r: n(rand() * 1.5 + 0.3),
      fill: "#ffffff",
    });
  }
  g.shapes.push({ t: "g", opacity: 0.65, children: stars });
  g.shapes.push({ t: "path", d: ridgePath(600, 130, 6, rand), fill: p.land[0] });
}

function savannah(g: SceneGeometry, p: ScenePalette, rand: Rand) {
  const horizon = 560;
  g.shapes.push({ t: "rect", y: horizon, w: W, h: H - horizon, fill: p.land[1] });
  g.shapes.push({
    t: "path",
    d: `M -40 ${horizon} Q ${W * 0.5} ${horizon - 34}, ${W + 40} ${horizon + 10} L ${W + 40} ${H} L -40 ${H} Z`,
    fill: p.land[0],
    opacity: 0.75,
  });

  const trees: Shape[] = [];
  for (let i = 0; i < 5; i++) {
    const x = 110 + i * 240 + rand() * 60;
    const y = horizon + 20 + rand() * 60;
    const s = 0.7 + rand() * 0.8;
    trees.push({
      t: "g",
      fill: p.land[0],
      transform: `translate(${n(x)} ${n(y)}) scale(${s.toFixed(2)})`,
      children: [
        { t: "rect", x: -4, y: -70, w: 8, h: 70, fill: p.land[0] },
        { t: "ellipse", cx: 0, cy: -76, rx: 62, ry: 17, fill: p.land[0] },
        { t: "ellipse", cx: -26, cy: -64, rx: 30, ry: 11, fill: p.land[0] },
        { t: "ellipse", cx: 28, cy: -66, rx: 26, ry: 10, fill: p.land[0] },
      ],
    });
  }
  g.shapes.push({ t: "g", children: trees });
}
