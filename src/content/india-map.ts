/**
 * Map coordinates for the domestic discovery section.
 *
 * Points are plotted from real latitude and longitude onto a neutral graticule
 * rather than onto a drawn national outline. That is a deliberate choice: an
 * approximated border is a factual claim we cannot stand behind, and India's
 * depiction is legally regulated. Plotting real coordinates gives an honest,
 * recognisable geography with none of that risk.
 */

/** Bounding box used for the projection. */
const LON_MIN = 66;
const LON_MAX = 95;
const LAT_MAX = 37.5;
const LAT_MIN = 6;

export function project(lat: number, lon: number): { x: number; y: number } {
  return {
    x: Math.round(((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 1000) / 10,
    y: Math.round(((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 1000) / 10,
  };
}

export type IndiaCategory =
  | "mountains"
  | "beaches"
  | "culture"
  | "wildlife"
  | "spiritual"
  | "adventure"
  | "luxury";

export const INDIA_CATEGORIES: { id: IndiaCategory; label: string }[] = [
  { id: "mountains", label: "Mountains" },
  { id: "beaches", label: "Beaches" },
  { id: "culture", label: "Culture" },
  { id: "wildlife", label: "Wildlife" },
  { id: "spiritual", label: "Spiritual" },
  { id: "adventure", label: "Adventure" },
  { id: "luxury", label: "Luxury" },
];

export interface IndiaPoint {
  /** Matches a destination slug so the map links to a real page. */
  slug: string;
  label: string;
  /** The named place the coordinates refer to. */
  anchor: string;
  lat: number;
  lon: number;
  categories: IndiaCategory[];
}

export const indiaPoints: IndiaPoint[] = [
  { slug: "kashmir", label: "Kashmir", anchor: "Srinagar", lat: 34.08, lon: 74.8, categories: ["mountains", "luxury", "adventure"] },
  { slug: "ladakh", label: "Ladakh", anchor: "Leh", lat: 34.16, lon: 77.58, categories: ["mountains", "adventure", "spiritual"] },
  { slug: "rajasthan", label: "Rajasthan", anchor: "Jaipur", lat: 26.91, lon: 75.79, categories: ["culture", "luxury"] },
  { slug: "sikkim", label: "Sikkim & Darjeeling", anchor: "Gangtok", lat: 27.33, lon: 88.61, categories: ["mountains", "culture", "spiritual"] },
  { slug: "meghalaya", label: "Meghalaya", anchor: "Shillong", lat: 25.57, lon: 91.88, categories: ["adventure", "wildlife"] },
  { slug: "goa", label: "Goa", anchor: "Panjim", lat: 15.3, lon: 74.12, categories: ["beaches", "culture"] },
  { slug: "kerala", label: "Kerala", anchor: "Kochi", lat: 9.93, lon: 76.27, categories: ["beaches", "wildlife", "luxury", "spiritual"] },
  { slug: "andaman", label: "Andaman Islands", anchor: "Port Blair", lat: 11.62, lon: 92.73, categories: ["beaches", "adventure"] },
];
