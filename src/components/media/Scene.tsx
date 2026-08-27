import { Fragment } from "react";
import type { SceneArchetype, ScenePalette } from "@/lib/types";
import { scenePalettes } from "@/content/palettes";
import { cx } from "@/lib/utils";
import { SCENE_H, SCENE_W, buildScene, type Shape } from "./scene-geometry";

/**
 * GENERATED CINEMATIC SCENES
 *
 * Original layered-SVG artwork, drawn from a memoised, deterministic geometry
 * description so the server and client always produce identical markup. Each
 * archetype has its own landform generator, so Ladakh and the Maldives are
 * recognisably different places rather than the same shape in two colourways.
 *
 * This exists so the product ships looking finished before the photography
 * lands. Every `Media` slot prefers a real `src`; the scene is what renders in
 * its absence — never a grey box, never a broken image.
 *
 * Everything is vector and inline: no network request, no layout shift, and it
 * scales cleanly from a 320px card to a 4K hero.
 */

interface SceneProps {
  scene: SceneArchetype;
  palette?: ScenePalette;
  /** Distinct seeds give distinct silhouettes for the same archetype. */
  seed: string;
  className?: string;
  /** Darkens part of the frame so overlaid text stays legible. */
  scrim?: "none" | "bottom" | "full" | "left";
}

export function Scene({ scene, palette, seed, className, scrim = "none" }: SceneProps) {
  const colours = palette ?? scenePalettes[scene];
  const geometry = buildScene(scene, seed, colours);
  const id = `s${hash(`${scene}:${seed}`)}`;

  return (
    <div className={cx("relative isolate size-full overflow-hidden bg-sand-100", className)}>
      <svg
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colours.sky[0]} />
            <stop offset="55%" stopColor={colours.sky[1]} />
            <stop offset="100%" stopColor={colours.sky[2]} />
          </linearGradient>
          <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colours.glow} stopOpacity="0.95" />
            <stop offset="45%" stopColor={colours.glow} stopOpacity="0.28" />
            <stop offset="100%" stopColor={colours.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colours.sky[2]} stopOpacity="0" />
            <stop offset="100%" stopColor={colours.sky[2]} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colours.land[2]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colours.land[0]} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect width={SCENE_W} height={SCENE_H} fill={`url(#${id}-sky)`} />
        <circle cx={geometry.sun.x} cy={geometry.sun.y} r={300} fill={`url(#${id}-sun)`} />

        {geometry.waterRects.map((water, i) => (
          <rect
            key={`w${i}`}
            y={water.y}
            width={SCENE_W}
            height={water.h}
            fill={`url(#${id}-water)`}
            opacity={water.opacity}
          />
        ))}

        {geometry.shapes.map((shape, i) => (
          <Fragment key={i}>{renderShape(shape, i)}</Fragment>
        ))}

        {/* Atmospheric haze pulls the far layers back and unifies the palette. */}
        <rect
          y={SCENE_H * 0.42}
          width={SCENE_W}
          height={SCENE_H * 0.34}
          fill={`url(#${id}-haze)`}
          opacity="0.55"
        />
      </svg>

      {/* Grain. Kept out of the SVG so it stays crisp at any render size. */}
      <span className="grain-layer" aria-hidden="true" />

      {scrim !== "none" && (
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute inset-0 z-[2]",
            scrim === "bottom" && "bg-gradient-to-t from-sand-50 via-sand-50/55 to-transparent",
            scrim === "full" && "bg-sand-50/55",
            scrim === "left" && "bg-gradient-to-r from-sand-50 via-sand-50/55 to-transparent",
          )}
        />
      )}
    </div>
  );
}

function renderShape(shape: Shape, key: number): React.ReactNode {
  switch (shape.t) {
    case "path":
      return (
        <path
          key={key}
          d={shape.d}
          fill={shape.fill ?? "none"}
          opacity={shape.opacity}
          stroke={shape.stroke}
          strokeWidth={shape.sw}
          strokeLinecap={shape.stroke ? "round" : undefined}
        />
      );
    case "rect":
      return (
        <rect
          key={key}
          x={shape.x}
          y={shape.y}
          width={shape.w}
          height={shape.h}
          fill={shape.fill}
          opacity={shape.opacity}
        />
      );
    case "circle":
      return <circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} opacity={shape.opacity} />;
    case "ellipse":
      return (
        <ellipse
          key={key}
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          fill={shape.fill}
          opacity={shape.opacity}
        />
      );
    case "line":
      return (
        <line
          key={key}
          x1={shape.x1}
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          stroke={shape.stroke}
          strokeWidth={shape.sw}
          strokeLinecap="round"
          opacity={shape.opacity}
        />
      );
    case "g":
      return (
        <g key={key} fill={shape.fill} opacity={shape.opacity} transform={shape.transform}>
          {shape.children.map((child, i) => renderShape(child, i))}
        </g>
      );
  }
}

function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
