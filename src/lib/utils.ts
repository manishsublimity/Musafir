/** Joins class names, dropping falsy values. Small on purpose — Tailwind v4's
 *  cascade layers make a full merge utility unnecessary here. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

/** Deterministic 0–1 pseudo-random from a string, so generated artwork is
 *  stable between server and client renders. Math.random() would hydrate-mismatch. */
export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
