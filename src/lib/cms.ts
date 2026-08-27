import { internationalDestinations } from "@/content/destinations.international";
import { domesticDestinations } from "@/content/destinations.domestic";
import { australiaPackages } from "@/content/packages.australia";
import { corePackages } from "@/content/packages.core";
import { experiences as allExperiences } from "@/content/experiences";
import { guides as allGuides } from "@/content/guides";
import { bookingSignals, partners, reviews } from "@/content/trust";
import type {
  BookingSignal,
  Destination,
  DurationBucket,
  Experience,
  Package,
  Partner,
  Region,
  Review,
  TravelGuide,
  TravelStyle,
} from "./types";

/**
 * THE ONLY DOOR TO CONTENT
 *
 * Pages and components import from here and never from `@/content/*` directly.
 * Swapping the seed files for a CMS or API means rewriting this module alone —
 * make every function here `async` and await it in the (already async) server
 * components, and nothing else in the codebase changes.
 */

const destinations: Destination[] = [...internationalDestinations, ...domesticDestinations];
const packages: Package[] = [...australiaPackages, ...corePackages];

/* --------------------------------------------------------- destinations -- */

export function getDestinations(): Destination[] {
  return destinations;
}

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getTrendingDestinations(limit = 8): Destination[] {
  return [...destinations].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)).slice(0, limit);
}

export function getDomesticDestinations(): Destination[] {
  return destinations.filter((d) => d.domestic);
}

export function getInternationalDestinations(): Destination[] {
  return destinations.filter((d) => !d.domestic);
}

export function getDestinationsByRegion(region: Region): Destination[] {
  return destinations.filter((d) => d.region === region);
}

/** Destinations whose visa record is genuinely low-friction for Indian passports. */
export function getEasyEntryDestinations(): Destination[] {
  return destinations.filter(
    (d) =>
      d.visa &&
      (d.visa.entryType === "visa-free" || d.visa.entryType === "visa-on-arrival"),
  );
}

export function getDestinationsByStyle(style: TravelStyle): Destination[] {
  return destinations.filter((d) => d.styles.includes(style));
}

/* -------------------------------------------------------------- packages -- */

export function getPackages(): Package[] {
  return packages;
}

export function getPackage(destinationSlug: string, packageSlug: string): Package | undefined {
  return packages.find((p) => p.destinationSlug === destinationSlug && p.slug === packageSlug);
}

export function getPackageBySlug(packageSlug: string): Package | undefined {
  return packages.find((p) => p.slug === packageSlug);
}

export function getPackagesForDestination(destinationSlug: string): Package[] {
  return packages.filter((p) => p.destinationSlug === destinationSlug);
}

export function getFeaturedPackages(limit = 6): Package[] {
  const featured = packages.filter((p) => p.featured);
  return (featured.length ? featured : packages).slice(0, limit);
}

export function getPackagesByDuration(bucket: DurationBucket): Package[] {
  return packages.filter((p) => p.durationBucket === bucket);
}

export function getPackagesByStyle(style: TravelStyle): Package[] {
  return packages.filter((p) => p.styles.includes(style));
}

export function getHoneymoonPackages(): Package[] {
  return packages.filter((p) => p.styles.includes("honeymoon"));
}

/** The cheapest starting price across a destination's packages, for rail cards. */
export function getStartingPriceFor(destinationSlug: string): number | undefined {
  const forDestination = getPackagesForDestination(destinationSlug);
  if (!forDestination.length) return undefined;
  return Math.min(...forDestination.map((p) => p.startingPrice.amount));
}

export function countPackagesFor(destinationSlug: string): number {
  return getPackagesForDestination(destinationSlug).length;
}

/* ----------------------------------------------------------- experiences -- */

export function getExperiences(): Experience[] {
  return allExperiences;
}

export function getExperience(slug: string): Experience | undefined {
  return allExperiences.find((e) => e.slug === slug);
}

export function getExperiencesForDestination(destinationSlug: string): Experience[] {
  return allExperiences.filter((e) => e.destinationSlug === destinationSlug);
}

/** Only experiences with a three-word caption appear in the cinematic film rail. */
export function getFilmExperiences(): Experience[] {
  return allExperiences.filter((e) => e.filmWords);
}

/* ---------------------------------------------------------------- guides -- */

export function getGuides(): TravelGuide[] {
  return [...allGuides].sort(
    (a, b) => Date.parse(b.updatedAt ?? b.publishedAt) - Date.parse(a.updatedAt ?? a.publishedAt),
  );
}

export function getGuide(slug: string): TravelGuide | undefined {
  return allGuides.find((g) => g.slug === slug);
}

export function getGuidesForDestination(destinationSlug: string): TravelGuide[] {
  return allGuides.filter((g) => g.destinationSlug === destinationSlug);
}

/* ----------------------------------------------------------------- trust -- */

/**
 * Reviews are filtered here rather than at the point of use, so an unverified
 * or unconsented record cannot reach a page even if one is added to the content
 * file by mistake. This is the last line of defence, not the first.
 */
export function getReviews(): Review[] {
  return reviews.filter((r) => r.verified && r.consentOnFile);
}

export function getReviewsForPackage(packageSlug: string): Review[] {
  return getReviews().filter((r) => r.packageSlug === packageSlug);
}

export function getBookingSignals(): BookingSignal[] {
  return bookingSignals;
}

export function getPartners(): Partner[] {
  return partners;
}

/* ---------------------------------------------------------------- search -- */

export interface SearchResult {
  kind: "destination" | "package" | "experience" | "guide";
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "for", "to", "of", "and", "with", "my", "me",
  "i", "we", "trip", "trips", "tour", "tours", "package", "packages", "holiday",
  "holidays", "from", "india", "under", "day", "days", "night", "nights",
]);

function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s₹]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/** Pulls a budget ceiling out of phrases like "under ₹1 lakh" or "below 50k". */
function parseBudget(query: string): number | undefined {
  const q = query.toLowerCase();
  const lakh = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)/);
  if (lakh) return Number(lakh[1]) * 100000;
  const k = q.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (k) return Number(k[1]) * 1000;
  const plain = q.match(/₹\s*([\d,]{4,})/);
  if (plain) return Number(plain[1].replace(/,/g, ""));
  return undefined;
}

function parseNights(query: string): number | undefined {
  const m = query.toLowerCase().match(/(\d{1,2})\s*(?:day|days|night|nights)/);
  return m ? Number(m[1]) : undefined;
}

/**
 * Intent-aware search over the whole catalogue.
 *
 * Handles the query shapes people actually type — "7 day bali honeymoon",
 * "family trip under ₹1 lakh", "kashmir in december", "visa free" — by scoring
 * token overlap and then applying budget, duration, month and visa filters as
 * hard constraints rather than as more tokens.
 */
export function search(query: string, limit = 12): SearchResult[] {
  const raw = query.trim();
  if (raw.length < 2) return [];

  const tokens = tokenise(raw);
  const budget = parseBudget(raw);
  const nights = parseNights(raw);
  const lower = raw.toLowerCase();
  const wantsVisaFree = /visa[-\s]?free|no visa|easy entry/.test(lower);

  const months = [
    "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
  ] as const;
  const monthNames = [
    "january", "february", "march", "april", "may", "june", "july", "august",
    "september", "october", "november", "december",
  ];
  const monthIndex = monthNames.findIndex((m) => lower.includes(m));
  const month = monthIndex >= 0 ? months[monthIndex] : undefined;

  const scored: { score: number; result: SearchResult }[] = [];

  const scoreText = (haystack: string[], weightFirst = 3) => {
    let score = 0;
    haystack.forEach((text, i) => {
      const t = text.toLowerCase();
      for (const token of tokens) {
        if (t.includes(token)) score += i === 0 ? weightFirst : 1;
      }
    });
    return score;
  };

  for (const d of destinations) {
    if (wantsVisaFree && d.visa?.entryType !== "visa-free" && d.visa?.entryType !== "visa-on-arrival") continue;
    if (month && !d.bestMonths.includes(month)) continue;
    if (budget && d.startingPrice.amount > budget) continue;

    let score = scoreText([d.name, d.country, d.tagline, ...d.styles, ...d.highlights]);
    if (wantsVisaFree) score += 2;
    if (month) score += 2;
    if (!score) continue;

    scored.push({
      score: score + (d.weight ?? 0) / 100,
      result: {
        kind: "destination",
        title: d.name,
        subtitle: d.tagline,
        href: `/destinations/${d.slug}`,
        meta: `${d.idealDurationDays[0]}–${d.idealDurationDays[1]} days`,
      },
    });
  }

  for (const p of packages) {
    if (budget && p.startingPrice.amount > budget) continue;
    if (nights && Math.abs(p.days - nights) > 2) continue;
    if (month && !p.bestMonths.includes(month)) continue;

    let score = scoreText([p.title, p.destinationName, p.summary, ...p.styles, ...p.highlights]);
    if (nights) score += 3;
    if (budget) score += 2;
    if (!score) continue;

    scored.push({
      score,
      result: {
        kind: "package",
        title: p.title,
        subtitle: `${p.days} days · ${p.destinationName}`,
        href: `/packages/${p.destinationSlug}/${p.slug}`,
        meta: `from ₹${p.startingPrice.amount.toLocaleString("en-IN")}`,
      },
    });
  }

  for (const e of allExperiences) {
    const score = scoreText([e.name, e.destinationName, e.summary]);
    if (!score) continue;
    scored.push({
      score,
      result: {
        kind: "experience",
        title: e.name,
        subtitle: e.destinationName,
        href: `/experiences/${e.slug}`,
        meta: e.durationLabel,
      },
    });
  }

  for (const g of allGuides) {
    const score = scoreText([g.title, g.excerpt]);
    if (!score) continue;
    scored.push({
      score: score * 0.8,
      result: {
        kind: "guide",
        title: g.title,
        subtitle: "Travel guide",
        href: `/travel-guides/${g.slug}`,
        meta: `${g.readingMinutes} min read`,
      },
    });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.result);
}

/* ------------------------------------------------------ recommendations -- */

export interface RecommendationInput {
  companions?: "couple" | "family" | "friends" | "solo";
  looking?: string[];
  duration?: "3-5" | "6-8" | "9-12" | "12-plus";
  budget?: "under-50k" | "50k-1l" | "1l-2l" | "2l-plus";
}

const BUDGET_CEILING: Record<NonNullable<RecommendationInput["budget"]>, number> = {
  "under-50k": 50000,
  "50k-1l": 100000,
  "1l-2l": 200000,
  "2l-plus": Number.POSITIVE_INFINITY,
};

const DURATION_RANGE: Record<NonNullable<RecommendationInput["duration"]>, [number, number]> = {
  "3-5": [3, 5],
  "6-8": [6, 8],
  "9-12": [9, 12],
  "12-plus": [12, 40],
};

const INTEREST_STYLE: Record<string, TravelStyle[]> = {
  relaxation: ["beach", "luxury", "senior-friendly"],
  adventure: ["adventure", "friends"],
  culture: ["cultural", "family"],
  luxury: ["luxury", "honeymoon"],
  nature: ["wildlife", "adventure"],
  shopping: ["family", "friends", "weekend"],
};

/**
 * Deliberately simple and transparent: score, then explain. A traveller should
 * be able to see why a journey was suggested, which a black-box model does not
 * give them and which matters more than marginal ranking quality here.
 */
export function recommendPackages(
  input: RecommendationInput,
  limit = 6,
): { pkg: Package; reasons: string[] }[] {
  const ceiling = input.budget ? BUDGET_CEILING[input.budget] : Number.POSITIVE_INFINITY;
  const range = input.duration ? DURATION_RANGE[input.duration] : undefined;

  const wanted = new Set<TravelStyle>();
  if (input.companions) wanted.add(input.companions as TravelStyle);
  for (const interest of input.looking ?? []) {
    for (const style of INTEREST_STYLE[interest] ?? []) wanted.add(style);
  }

  const scored = packages.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    if (p.startingPrice.amount <= ceiling) {
      score += 3;
      if (input.budget) reasons.push("Within your budget");
    } else {
      score -= 4;
    }

    if (range) {
      if (p.days >= range[0] && p.days <= range[1]) {
        score += 3;
        reasons.push(`${p.days} days, the length you asked for`);
      } else {
        score -= Math.min(3, Math.abs(p.days - range[1]) / 2);
      }
    }

    const matched = p.styles.filter((s) => wanted.has(s));
    if (matched.length) {
      score += matched.length * 2;
      reasons.push(`Suits ${matched.slice(0, 2).join(" and ")} travel`);
    }

    if (p.featured) score += 0.5;

    return { pkg: p, reasons, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ pkg: p, reasons }) => ({ pkg: p, reasons }));
}
