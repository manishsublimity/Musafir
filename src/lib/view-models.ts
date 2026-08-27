import type { Destination, Package, SceneArchetype, ScenePalette } from "./types";
import { formatSeasonRanges } from "./format";
import { countPackagesFor, getStartingPriceFor } from "./cms";

/**
 * SLIM VIEW MODELS
 *
 * Interactive sections are client components, and a client component that
 * imports from `@/lib/cms` drags the entire catalogue — every itinerary, every
 * price, every FAQ — into the browser bundle.
 *
 * Server components map records through these functions and pass the result
 * down as props, so the client only ever receives the handful of fields it
 * actually renders.
 */

export interface DestinationCard {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  domestic: boolean;
  region: string;
  scene: SceneArchetype;
  palette?: ScenePalette;
  /** Real photograph, when the CMS has one for this destination. */
  image?: string;
  alt: string;
  durationLabel: string;
  seasonLabel: string;
  /** Raw month keys, for anything that needs to reason about season. */
  bestMonths: string[];
  startingPrice: number;
  packageCount: number;
  styles: string[];
  topExperience?: string;
  bestFor?: string;
  entryType?: string;
  stayDays?: number;
}

export function toDestinationCard(destination: Destination): DestinationCard {
  const cheapest = getStartingPriceFor(destination.slug) ?? destination.startingPrice.amount;
  return {
    slug: destination.slug,
    name: destination.name,
    country: destination.country,
    tagline: destination.tagline,
    domestic: destination.domestic,
    region: destination.region,
    scene: destination.hero.scene ?? "island",
    palette: destination.hero.palette,
    image: destination.hero.src,
    alt: destination.hero.alt,
    durationLabel: `${destination.idealDurationDays[0]}–${destination.idealDurationDays[1]} days`,
    seasonLabel: formatSeasonRanges(destination.bestMonths),
    bestMonths: destination.bestMonths,
    startingPrice: cheapest,
    packageCount: countPackagesFor(destination.slug),
    styles: destination.styles,
    topExperience: destination.highlights[0],
    bestFor: destination.styles.slice(0, 2).join(" · "),
    entryType: destination.visa?.entryType,
    stayDays: destination.visa?.stayDays,
  };
}

export interface PackageCard {
  slug: string;
  destinationSlug: string;
  destinationName: string;
  title: string;
  href: string;
  days: number;
  nights: number;
  durationBucket: string;
  summary: string;
  scene: SceneArchetype;
  palette?: ScenePalette;
  alt: string;
  startingPrice: number;
  highlights: string[];
  route: string[];
  styles: string[];
  hotelCategory: string;
  seasonLabel: string;
}

export function toPackageCard(pkg: Package): PackageCard {
  return {
    slug: pkg.slug,
    destinationSlug: pkg.destinationSlug,
    destinationName: pkg.destinationName,
    title: pkg.title,
    href: `/packages/${pkg.destinationSlug}/${pkg.slug}`,
    days: pkg.days,
    nights: pkg.nights,
    durationBucket: pkg.durationBucket,
    summary: pkg.summary,
    scene: pkg.hero.scene ?? "island",
    palette: pkg.hero.palette,
    alt: pkg.hero.alt,
    startingPrice: pkg.startingPrice.amount,
    highlights: pkg.highlights.slice(0, 3),
    route: pkg.cities.map((c) => c.name),
    styles: pkg.styles,
    hotelCategory: pkg.hotelCategory,
    seasonLabel: formatSeasonRanges(pkg.bestMonths),
  };
}
