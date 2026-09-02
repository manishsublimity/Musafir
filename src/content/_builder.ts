import type {
  Destination,
  Media,
  Money,
  SceneArchetype,
  SeoMeta,
} from "@/lib/types";
import { paletteFor } from "./palettes";
import { MEDIA_IMAGES, MEDIA_VIDEOS } from "./media-index.generated";

export const inr = (amount: number): Money => ({ amount, currency: "INR" });

/** Builds a media slot backed by a generated scene until real media arrives. */
export function scene(archetype: SceneArchetype, alt: string): Media {
  return { alt, scene: archetype, palette: paletteFor(archetype) };
}

export function seo(
  title: string,
  description: string,
  canonical: string,
  keywords?: string[],
): SeoMeta {
  return { title, description, canonical, keywords };
}

type DestinationInput = Omit<Destination, "gallery" | "travelTips" | "weight"> &
  Partial<Pick<Destination, "gallery" | "travelTips" | "weight">>;

/**
 * Attaches whatever media is actually sitting in `public/media` for a slug.
 *
 * The naming follows the Pixabay sourcing manifest: `<slug>.jpg` in
 * `public/media/images`, `<slug>.mp4` in `public/media/videos`. Drop a file in
 * with the right name and the destination has a photograph or a clip on the
 * next build; take it out and the destination falls back to its generated
 * scene. Nothing here has to be edited either way.
 *
 * An explicit `src` in the record always wins. The five destinations that
 * already have photography name their files after the picture rather than the
 * slug — `swiss-alps.jpg`, `kyoto-temple.jpg` — and those stay as they are.
 */
function withMedia(slug: string, hero: Media): Media {
  const image = hero.src ?? MEDIA_IMAGES[slug];
  const clip = hero.video ?? (MEDIA_VIDEOS[slug] ? { mp4: MEDIA_VIDEOS[slug] } : undefined);
  return { ...hero, ...(image ? { src: image } : {}), ...(clip ? { video: clip } : {}) };
}

/** Fills the fields that are optional in practice so records stay readable. */
export function destination(input: DestinationInput): Destination {
  return {
    gallery: [],
    travelTips: [],
    weight: 0,
    ...input,
    hero: withMedia(input.slug, input.hero),
  };
}
