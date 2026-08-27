import type {
  Destination,
  Media,
  Money,
  SceneArchetype,
  SeoMeta,
} from "@/lib/types";
import { paletteFor } from "./palettes";

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

/** Fills the fields that are optional in practice so records stay readable. */
export function destination(input: DestinationInput): Destination {
  return {
    gallery: [],
    travelTips: [],
    weight: 0,
    ...input,
  };
}
