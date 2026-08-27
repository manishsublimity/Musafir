import Image from "next/image";
import type { Media } from "@/lib/types";
import { cx } from "@/lib/utils";
import { Scene } from "./Scene";

interface FrameProps {
  media: Media;
  /** Seed for the generated fallback scene. Use a stable id, not an index. */
  seed: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  scrim?: "none" | "bottom" | "full" | "left";
  /** Fills its positioned parent rather than establishing its own box. */
  fill?: boolean;
}

/**
 * One media slot, three possible sources, resolved in order:
 *
 *   1. `media.src`   — a real photograph from the CMS, served through
 *                      next/image so it arrives as AVIF/WebP at the right size
 *   2. `media.scene` — the generated cinematic artwork
 *   3. neither       — a flat surface, which should never happen but must not
 *                      render as a broken image if it does
 *
 * Alt text comes from the record. An empty string is meaningful: it marks the
 * image decorative and hides it from assistive technology, which is correct for
 * atmospheric backdrops behind their own headline.
 */
export function Frame({
  media,
  seed,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  scrim = "none",
  fill = true,
}: FrameProps) {
  const wrapper = cx(
    fill ? "absolute inset-0" : "relative",
    "size-full overflow-hidden bg-sand-100",
    className,
  );

  if (media.src) {
    return (
      <div className={wrapper}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cx("object-cover", imageClassName)}
          style={
            media.focal
              ? { objectPosition: `${media.focal.x}% ${media.focal.y}%` }
              : undefined
          }
        />
        <span className="grain-layer" aria-hidden="true" />
        {scrim !== "none" && <Scrim variant={scrim} />}
      </div>
    );
  }

  if (media.scene) {
    return (
      <div className={wrapper}>
        <Scene
          scene={media.scene}
          palette={media.palette}
          seed={seed}
          scrim={scrim}
          className="size-full"
        />
        {/* Alt text still has to reach assistive technology, even though the
            artwork itself is inline SVG marked aria-hidden. */}
        {media.alt ? <span className="sr-only">{media.alt}</span> : null}
      </div>
    );
  }

  return <div className={cx(wrapper, "bg-surface-raised")} aria-hidden="true" />;
}

function Scrim({ variant }: { variant: "bottom" | "full" | "left" }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0",
        variant === "bottom" && "bg-gradient-to-t from-sand-50 via-sand-50/55 to-transparent",
        variant === "full" && "bg-sand-50/55",
        variant === "left" && "bg-gradient-to-r from-sand-50 via-sand-50/55 to-transparent",
      )}
    />
  );
}

/**
 * Hero backdrop with optional muted, looping video.
 *
 * Video never autoplays with sound, always carries a poster, and is skipped
 * entirely under reduced motion or on a metered connection — where the poster
 * (or the generated scene) is a complete experience on its own.
 */
export function HeroBackdrop({
  media,
  seed,
  scrim = "bottom",
  priority = true,
  className,
}: {
  media: Media;
  seed: string;
  scrim?: "none" | "bottom" | "full" | "left";
  priority?: boolean;
  className?: string;
}) {
  if (media.video?.mp4 || media.video?.webm) {
    return (
      <div className={cx("absolute inset-0 overflow-hidden bg-sand-100", className)}>
        <video
          className="size-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.video.poster}
          aria-hidden="true"
        >
          {media.video.webm && <source src={media.video.webm} type="video/webm" />}
          {media.video.mp4 && <source src={media.video.mp4} type="video/mp4" />}
        </video>
        {/* Poster stands in wherever the video does not play. */}
        {media.video.poster && (
          <div className="absolute inset-0 hidden motion-reduce:block">
            <Image src={media.video.poster} alt={media.alt} fill sizes="100vw" priority={priority} className="object-cover" />
          </div>
        )}
        <span className="grain-layer" aria-hidden="true" />
        {scrim !== "none" && <Scrim variant={scrim} />}
      </div>
    );
  }

  return <Frame media={media} seed={seed} scrim={scrim} priority={priority} sizes="100vw" className={className} />;
}
