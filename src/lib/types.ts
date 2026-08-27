/**
 * MUSAFIR CONTENT MODEL
 *
 * Every page in this application is rendered from these shapes and nothing
 * else. No component reaches for a hardcoded destination name, price or
 * itinerary. Point `src/lib/cms.ts` at a real CMS/API that returns these types
 * and the entire site becomes dynamic without touching a single view.
 */

/* ---------------------------------------------------------------------------
 * Primitives
 * ------------------------------------------------------------------------- */

export type Currency = "INR" | "USD" | "AED" | "EUR";

/** Money is stored in minor-unit-free integers plus an explicit currency.
 *  Never format a price by hand — use `formatMoney` in `lib/format.ts`. */
export interface Money {
  amount: number;
  currency: Currency;
}

/**
 * Art archetypes drive the generated cinematic backdrops used wherever a real
 * photograph or video has not yet been supplied by the CMS. They are original
 * layered-SVG scenes, not stock imagery, so the site ships looking finished and
 * upgrades gracefully the moment real media lands.
 */
export type SceneArchetype =
  | "island"
  | "beach"
  | "mountain"
  | "snow"
  | "desert"
  | "city"
  | "forest"
  | "backwater"
  | "heritage"
  | "reef"
  | "aurora"
  | "savannah";

export interface ScenePalette {
  /** Sky / far-field gradient stops, far → near. */
  sky: [string, string, string];
  /** Landform colours, far → near. */
  land: [string, string, string];
  /** Highlight used for sun, lights, reflections. */
  glow: string;
}

/**
 * A media slot. `src` (and optionally `video`) come from the CMS. When both are
 * absent the UI falls back to the generated scene, so nothing ever renders as a
 * broken image or an empty box.
 */
export interface Media {
  src?: string;
  /** Poster is required whenever `video` is set. */
  video?: { webm?: string; mp4?: string; poster?: string };
  /** Empty string marks the image as decorative for screen readers. */
  alt: string;
  width?: number;
  height?: number;
  focal?: { x: number; y: number };
  credit?: string;
  scene?: SceneArchetype;
  palette?: ScenePalette;
}

export interface SeoMeta {
  title: string;
  description: string;
  /** Path only, e.g. `/destinations/australia`. Absolute URL is derived. */
  canonical: string;
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

/** GEO/AIO answer block: a short, quotable, self-contained answer. */
export interface AnswerBlock {
  question: string;
  /** One or two sentences. This is what an AI assistant will quote. */
  answer: string;
  /** Optional supporting detail rendered under the answer. */
  detail?: string;
}

/* ---------------------------------------------------------------------------
 * Taxonomy
 * ------------------------------------------------------------------------- */

export type Region =
  | "asia"
  | "europe"
  | "middle-east"
  | "africa"
  | "oceania"
  | "americas"
  | "scandinavia"
  | "india";

export type TravelStyle =
  | "couple"
  | "family"
  | "friends"
  | "solo"
  | "luxury"
  | "adventure"
  | "honeymoon"
  | "senior-friendly"
  | "weekend"
  | "wildlife"
  | "beach"
  | "winter"
  | "cultural";

export type Season = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

export type TransportMode = "flight" | "transfer" | "train" | "cruise" | "walk" | "ferry" | "coach";

export type HotelCategory = "3-star" | "4-star" | "5-star" | "boutique" | "resort" | "villa";

export type MealPlan = "breakfast" | "lunch" | "dinner" | "all-inclusive" | "none";

export type DurationBucket = "2-3" | "4-5" | "6-7" | "8-10" | "11-14" | "15+";

/* ---------------------------------------------------------------------------
 * Visa
 *
 * Visa rules change frequently and publishing a stale rule as fact is a real
 * liability. Every visa record therefore carries the source and the date it was
 * last verified, and the UI is required to surface both alongside a disclaimer.
 * ------------------------------------------------------------------------- */

export type VisaEntryType =
  | "visa-free"
  | "visa-on-arrival"
  | "e-visa"
  | "eta"
  | "sticker-visa"
  | "pre-approved";

export interface VisaInfo {
  /** Passport this rule applies to. Currently modelled for Indian passports. */
  passport: "IN";
  entryType: VisaEntryType;
  /** Permitted stay in days, when the entry type grants one. */
  stayDays?: number;
  processingTime?: string;
  fee?: Money | "varies";
  documents?: string[];
  notes?: string;
  /** ISO date. The UI renders "last verified on …" from this. */
  lastVerified: string;
  /** Official government/embassy source. Required — never publish without it. */
  sourceName: string;
  sourceUrl: string;
}

/* ---------------------------------------------------------------------------
 * Destination
 * ------------------------------------------------------------------------- */

export interface DestinationStat {
  label: string;
  value: string;
  /** Optional numeric form so the UI can run a count-up animation. */
  numeric?: number;
  prefix?: string;
  suffix?: string;
}

export interface City {
  name: string;
  slug: string;
  /** Rough position on the destination's own route map, 0–100 in both axes. */
  point?: { x: number; y: number };
  blurb?: string;
  nights?: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  /** e.g. "Indonesia" — shown under the name in the hero indicator. */
  country: string;
  region: Region;
  /** Domestic destinations get their own visual language across the site. */
  domestic: boolean;
  tagline: string;
  /** 2–3 sentence editorial intro. Human-written, destination-specific. */
  intro: string;
  hero: Media;
  gallery: Media[];
  stats: DestinationStat[];
  idealDurationDays: [number, number];
  startingPrice: Money;
  bestMonths: Season[];
  styles: TravelStyle[];
  cities: City[];
  highlights: string[];
  /** "Why <destination>" — 3–5 specific reasons, not marketing filler. */
  whyPoints: { title: string; body: string }[];
  experiences: string[];
  travelTips: string[];
  howToReach?: string;
  budgetGuide?: { label: string; range: string; note?: string }[];
  visa?: VisaInfo;
  faqs: Faq[];
  /** GEO/AIO structured answers surfaced near the top of the page. */
  answers: AnswerBlock[];
  seo: SeoMeta;
  /** Sort weight for "trending" rails. Higher floats to the front. */
  weight?: number;
}

/* ---------------------------------------------------------------------------
 * Package + itinerary
 * ------------------------------------------------------------------------- */

export interface ItineraryActivity {
  slot: "morning" | "afternoon" | "evening";
  title: string;
  location?: string;
  durationMins?: number;
  description?: string;
  /** Slug of a linked Experience, when one exists. */
  experienceSlug?: string;
  /** Optional paid add-on the customiser can pick up. */
  addOnId?: string;
}

export interface ItineraryLeg {
  from: string;
  to: string;
  mode: TransportMode;
  durationMins?: number;
  note?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  /** City the traveller wakes up in / spends the day in. */
  city: string;
  /** Present when the day involves moving between places. */
  leg?: ItineraryLeg;
  summary: string;
  media?: Media;
  activities: ItineraryActivity[];
  hotel?: { name: string; category: HotelCategory; nights: number; note?: string };
  meals: MealPlan[];
}

export interface PriceAddOn {
  id: string;
  label: string;
  description?: string;
  /** Per traveller unless `perBooking` is set. */
  price: Money;
  perBooking?: boolean;
  group: "hotel" | "activity" | "transfer" | "flight" | "room";
}

export interface PricingModel {
  /** Per-adult base, twin sharing. Everything else is derived from this. */
  basePerAdult: Money;
  /** Multipliers applied per hotel category. 1 = the base category. */
  hotelCategoryMultiplier: Partial<Record<HotelCategory, number>>;
  baseHotelCategory: HotelCategory;
  childPercent: number;
  infantPercent: number;
  /** e.g. 0.05 for 5% GST on tour packages. Sourced from config, not guessed. */
  taxRate: number;
  taxLabel: string;
  addOns: PriceAddOn[];
  /** Explicitly modelled so the UI never implies a price it cannot honour. */
  priceDisclaimer: string;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  destinationSlug: string;
  /** Denormalised for listing pages that render without a second lookup. */
  destinationName: string;
  nights: number;
  days: number;
  durationBucket: DurationBucket;
  hero: Media;
  gallery: Media[];
  summary: string;
  cities: City[];
  styles: TravelStyle[];
  hotelCategory: HotelCategory;
  startingPrice: Money;
  pricing: PricingModel;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  bestMonths: Season[];
  visaStatus?: VisaEntryType;
  faqs: Faq[];
  answers: AnswerBlock[];
  seo: SeoMeta;
  /** Only ever populated from verified post-travel reviews. */
  reviews?: Review[];
  featured?: boolean;
}

/* ---------------------------------------------------------------------------
 * Experiences & guides
 * ------------------------------------------------------------------------- */

export interface Experience {
  id: string;
  slug: string;
  name: string;
  destinationSlug: string;
  destinationName: string;
  /** The three-word cinematic caption used in the horizontal film section. */
  filmWords?: [string, string, string];
  hero: Media;
  summary: string;
  body: string;
  durationLabel: string;
  bestMonths: Season[];
  startingPrice?: Money;
  styles: TravelStyle[];
  faqs: Faq[];
  seo: SeoMeta;
}

export interface TravelGuide {
  id: string;
  slug: string;
  title: string;
  destinationSlug?: string;
  hero: Media;
  excerpt: string;
  /** Markdown-ish blocks kept structured so schema.org Article is accurate. */
  sections: { heading: string; body: string }[];
  author: { name: string; role: string; bio?: string };
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  faqs: Faq[];
  seo: SeoMeta;
}

/* ---------------------------------------------------------------------------
 * Trust content
 *
 * These three collections are deliberately allowed to be empty. Musafir must
 * never display an invented review, an invented booking or an invented
 * partnership, so every consuming component has a designed empty state.
 * ------------------------------------------------------------------------- */

export interface Review {
  id: string;
  travellerName: string;
  city?: string;
  destination: string;
  packageSlug?: string;
  travelStyle?: TravelStyle;
  travelDate: string;
  rating?: number;
  quote: string;
  body?: string;
  photo?: Media;
  tripPhotos?: Media[];
  /** Only `true` once the booking behind the review has been confirmed. */
  verified: boolean;
  /** Written permission to publish the traveller's name and photo. */
  consentOnFile: boolean;
}

export interface Partner {
  id: string;
  name: string;
  category: "tourism-board" | "hotel" | "airline" | "dmc" | "experience";
  logo?: Media;
  url?: string;
  /** The exact nature of the relationship. Never inflate to "partner". */
  relationship: string;
}

export interface BookingSignal {
  id: string;
  /** First name only. Full names are never published. */
  travellerFirstName: string;
  city: string;
  destination: string;
  nights: number;
  bookedAt: string;
}

/* ---------------------------------------------------------------------------
 * Personalisation & enquiry
 * ------------------------------------------------------------------------- */

export interface TripPreference {
  destinationSlug?: string;
  startDate?: string;
  endDate?: string;
  travellers: { adults: number; children: number; infants: number };
  style?: TravelStyle;
  budgetBand?: "under-50k" | "50k-1l" | "1l-2l" | "2l-plus";
  durationBand?: "3-5" | "6-8" | "9-12" | "12-plus";
  interests?: string[];
}

export interface EnquiryPayload extends TripPreference {
  name: string;
  email: string;
  phone: string;
  packageSlug?: string;
  message?: string;
  /** Timestamp the form was rendered — used for bot timing checks. */
  renderedAt: number;
  /** Honeypot. Must be empty. */
  company?: string;
}

/* ---------------------------------------------------------------------------
 * Site configuration
 * ------------------------------------------------------------------------- */

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address?: {
    street?: string;
    locality: string;
    region: string;
    postalCode?: string;
    country: string;
  };
  social: { label: string; url: string }[];
  /** Only claims that can be evidenced belong here. */
  founded?: string;
  founder?: { name: string; role: string };
}
