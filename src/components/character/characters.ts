/**
 * CHARACTER REGISTRY
 *
 * Every character is data. The renderer reads this and nothing else, so adding
 * a party type is an edit to this file rather than to a component.
 *
 * All five assets are stills that already carry a real alpha channel, so the
 * transparency is exact and free — the browser composites it. Nothing is keyed
 * at runtime, and no colour sits behind the artwork.
 *
 * ---------------------------------------------------------------------------
 * WHY HEADS ARE CIRCLES, AND HOW THEY WERE MEASURED
 *
 * The sources are flat pictures. There is no rig, so nothing can be posed.
 * What happens instead is layering: the same artwork is drawn several times,
 * stacked, and each copy is masked down to one region and given its own
 * spring. Heads move most, the torso between them less, the base least.
 *
 * A head is a circle rather than a horizontal band because a band only works
 * when everyone's head is at the same height. In `family` the parents' heads
 * and the children's sit at four different heights, so any horizontal slice
 * catching the adults' faces also catches the children's chests.
 *
 * The circles below were measured off each asset's own alpha channel: the
 * topmost opaque row per column gives a "skyline" that dips once per person,
 * and from each dip we take the head's widest row, descend to the narrowest
 * row beneath it — the neck — and fit a circle from crown to neck. The groups
 * were then corrected by eye where figures stand shoulder to shoulder and the
 * skyline never breaks between them.
 */

/** A head, in fractions of the artwork's own width and height. */
export interface HeadRegion {
  cx: number;
  cy: number;
  /** Radius as a fraction of the artwork's WIDTH. */
  r: number;
  /** Only ever used to name the layer while debugging. */
  name?: string;
}

export interface CharacterConfig {
  /** Path under /public. */
  src: string;
  /** Intrinsic size, so layers can be laid out before the image loads. */
  width: number;
  height: number;
  alt: string;
  heads: HeadRegion[];
  /**
   * Horizontal band treated as the upper body, moving between the heads and
   * the base. Fractions of height, feathered across `feather`.
   */
  torso: { from: number; to: number; feather: number };
}

export type CharacterId = "couple" | "family" | "friends" | "soloBoy" | "soloGirl";

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  couple: {
    src: "/characters/couple.webp",
    width: 506,
    height: 1000,
    alt: "An illustrated couple",
    heads: [
      { name: "man", cx: 0.43, cy: 0.075, r: 0.17 },
      { name: "woman", cx: 0.7, cy: 0.17, r: 0.15 },
    ],
    torso: { from: 0.26, to: 0.55, feather: 0.12 },
  },

  family: {
    src: "/characters/family.webp",
    width: 1000,
    height: 1095,
    alt: "An illustrated family",
    heads: [
      { name: "father", cx: 0.283, cy: 0.1, r: 0.105 },
      { name: "mother", cx: 0.5, cy: 0.19, r: 0.095 },
      { name: "daughter", cx: 0.4, cy: 0.485, r: 0.085 },
      { name: "son", cx: 0.866, cy: 0.575, r: 0.105 },
    ],
    torso: { from: 0.3, to: 0.66, feather: 0.14 },
  },

  friends: {
    src: "/characters/friends.webp",
    width: 1300,
    height: 896,
    alt: "An illustrated group of friends",
    heads: [
      { name: "arms-folded", cx: 0.132, cy: 0.09, r: 0.065 },
      { name: "hoodie", cx: 0.308, cy: 0.155, r: 0.075 },
      { name: "leather-jacket", cx: 0.499, cy: 0.165, r: 0.065 },
      { name: "cardigan", cx: 0.702, cy: 0.135, r: 0.065 },
      { name: "dungarees", cx: 0.892, cy: 0.2, r: 0.066 },
    ],
    // Five abreast and much wider than tall, so the band sits higher and
    // shallower than it does on the portrait assets.
    torso: { from: 0.28, to: 0.6, feather: 0.13 },
  },

  soloBoy: {
    src: "/characters/solo-boy.webp",
    width: 335,
    height: 1000,
    alt: "An illustrated solo traveller",
    heads: [{ name: "traveller", cx: 0.469, cy: 0.085, r: 0.264 }],
    // One person means one head, so the torso band carries more weight here
    // than in a group: it is the only thing between his head and his feet.
    torso: { from: 0.17, to: 0.52, feather: 0.12 },
  },

  soloGirl: {
    src: "/characters/solo-girl.webp",
    width: 363,
    height: 1000,
    alt: "An illustrated solo traveller",
    heads: [{ name: "traveller", cx: 0.55, cy: 0.095, r: 0.25 }],
    torso: { from: 0.18, to: 0.53, feather: 0.12 },
  },
};

/**
 * Which character belongs to which answer. `SOLO` is deliberately absent: it
 * resolves only once the traveller has also picked boy or girl.
 */
export function characterFor(
  travelWith: string | undefined,
  soloGender: string | undefined,
): CharacterId | undefined {
  switch (travelWith) {
    case "COUPLE":
      return "couple";
    case "FAMILY":
      return "family";
    case "FRIENDS":
      return "friends";
    case "SOLO":
      if (soloGender === "BOY") return "soloBoy";
      if (soloGender === "GIRL") return "soloGirl";
      return undefined;
    default:
      return undefined;
  }
}
