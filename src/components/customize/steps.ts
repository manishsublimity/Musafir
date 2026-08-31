import type { SceneArchetype } from "@/lib/types";

/**
 * TRIP CUSTOMISER — STEP DEFINITIONS
 *
 * The flow is data, not markup. Adding, removing or reordering a step is an
 * edit to this file; the renderer and the progress rail derive everything from
 * it, so the two can never disagree about how many steps there are.
 */

export type StepId =
  | "travelWith"
  | "rooms"
  | "destination"
  | "vibe"
  | "date"
  | "duration"
  | "cities";

/** What the traveller has answered so far, keyed by step id. */
export type Selection = Record<string, string[]>;

export interface StepOption {
  id: string;
  label: string;
  /** Shown under the label on the card. */
  blurb?: string;
  scene?: SceneArchetype;
  /** A real photograph. Takes precedence over the generated scene. */
  image?: string;
  imageAlt?: string;
  /** Small badge under the card, e.g. "Most picked". */
  note?: string;
  /** Short clip played on hover. Falls back to a slow zoom when absent. */
  video?: string;
}

export interface StepDefinition {
  id: StepId;
  question: string;
  /** Second line under the question. */
  lede?: string;
  multi: boolean;
  /** Label for the button that advances from this step. */
  cta: string;
  /** Steps the traveller may skip. */
  optional?: boolean;
  options?: StepOption[];
  /** Renders a search field above the options. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /**
   * Steps that only apply to some answers. Room allocation is meaningless for
   * a solo traveller and for a couple sharing one room, so it is only asked of
   * families and groups of friends.
   */
  when?: (selection: Selection) => boolean;
  /** Rendered by a bespoke component rather than the option grid. */
  custom?: "date" | "rooms";
}

/** Party types that actually need to divide people across rooms. */
const NEEDS_ROOMS = ["FAMILY", "FRIENDS"];

export const TRAVEL_WITH: StepOption[] = [
  { id: "COUPLE", label: "Couple", blurb: "Romantic escapes made unforgettable", scene: "island", image: "/images/couple.png", imageAlt: "A couple on a coastal viewpoint at golden hour" },
  { id: "FAMILY", label: "Family", blurb: "Memories today, treasured forever", scene: "beach", image: "/images/family.png", imageAlt: "A family together on holiday" },
  { id: "FRIENDS", label: "Friends", blurb: "Adventures are always better together", scene: "mountain", image: "/images/friends.png", imageAlt: "A group of friends travelling together" },
  { id: "SOLO", label: "Solo", blurb: "Find yourself in new places", scene: "forest", image: "/images/solo.png", imageAlt: "A solo traveller with a warm drink" },
];

export const VIBES: StepOption[] = [
  { id: "LEISURE", label: "Leisure", blurb: "Slow mornings, nothing scheduled", scene: "island" },
  { id: "NATURE", label: "Nature", blurb: "Forests, falls and open country", scene: "forest" },
  { id: "ATTRACTION", label: "Attraction", blurb: "The landmarks you came for", scene: "heritage" },
  { id: "CULTURE", label: "Culture", blurb: "Food, streets and the everyday", scene: "city" },
  { id: "ADVENTURE", label: "Adventure", blurb: "Something to be nervous about", scene: "mountain" },
];

export const DURATIONS: StepOption[] = [
  { id: "3-5", label: "3 – 5 Days", blurb: "A long weekend, done properly" },
  { id: "6-8", label: "6 – 8 Days", blurb: "The length most trips want to be", note: "Most picked" },
  { id: "9-12", label: "9 – 12 Days", blurb: "Two regions without rushing" },
  { id: "12-plus", label: "12+ Days", blurb: "The one you take leave for" },
];

export const MONTHS: StepOption[] = [
  { id: "jan", label: "January" }, { id: "feb", label: "February" },
  { id: "mar", label: "March" }, { id: "apr", label: "April" },
  { id: "may", label: "May" }, { id: "jun", label: "June" },
  { id: "jul", label: "July" }, { id: "aug", label: "August" },
  { id: "sep", label: "September" }, { id: "oct", label: "October" },
  { id: "nov", label: "November" }, { id: "dec", label: "December" },
];

export const STEPS: StepDefinition[] = [
  {
    id: "travelWith",
    question: "Who's coming along?",
    lede: "Every journey is better together.",
    multi: false,
    cta: "Choose your destination",
    options: TRAVEL_WITH,
  },
  {
    id: "rooms",
    question: "How many rooms does your group need?",
    lede: "Split the group however you actually want to sleep. You can change this later.",
    multi: false,
    cta: "Choose your destination",
    custom: "rooms",
    when: (selection) => NEEDS_ROOMS.includes(selection.travelWith?.[0] ?? ""),
  },
  {
    id: "destination",
    question: "Where do you want to go?",
    lede: "Pick one to start. You can change it at any point.",
    multi: false,
    cta: "Choose your travel vibe",
    searchable: true,
    searchPlaceholder: "Search for destinations",
  },
  {
    id: "vibe",
    question: "What's your travel vibe?",
    lede: "Pick as many as you like — it shapes what we put in the days.",
    multi: true,
    cta: "Choose your trip duration",
    options: VIBES,
  },
  {
    id: "duration",
    question: "What's the duration of your holiday?",
    lede: "Start from the leave you actually have.",
    multi: false,
    cta: "Choose when you travel",
    options: DURATIONS,
  },
  {
    id: "date",
    question: "When are you planning to depart?",
    lede: "Pick a date and we can quote real fares. Approximate is fine — you can move it later.",
    multi: false,
    cta: "Choose your cities",
    optional: true,
    custom: "date",
  },
  {
    id: "cities",
    question: "Choose the cities you want to visit",
    lede: "Pick the ones you would be disappointed to miss.",
    multi: true,
    cta: "See my journey",
    searchable: true,
    searchPlaceholder: "Find a city",
  },
];
