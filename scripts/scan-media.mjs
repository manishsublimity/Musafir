/**
 * MEDIA INDEX GENERATOR
 *
 * Scans `public/media` and writes the list of files that are actually there
 * into `src/content/media-index.generated.ts`, keyed by filename stem.
 *
 * ---------------------------------------------------------------------------
 * WHY A GENERATED INDEX RATHER THAN JUST WRITING THE PATHS IN
 *
 * The Pixabay manifest names every file the flow wants — `bali.mp4`,
 * `kerala.jpg` — but it is a sourcing plan, not the assets. Writing those
 * paths straight into the content records would point eighteen destinations at
 * files that do not exist yet, and a broken image is worse than the generated
 * artwork it would replace.
 *
 * So the content asks this index what exists instead of asserting what should.
 * Drop `kerala.jpg` into `public/media/images/`, run dev or build, and Kerala
 * has a photograph; delete it and Kerala falls back to its scene. Nothing has
 * to be edited either way, and the site can never reference a file that is not
 * on disk.
 *
 * Runs from `predev` and `prebuild`, so the index cannot go stale unnoticed.
 * The output is committed, so a clean checkout builds without running it first.
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";

const ROOT = process.cwd();
const IMAGE_DIR = join(ROOT, "public", "media", "images");
const VIDEO_DIR = join(ROOT, "public", "media", "videos");
const OUT = join(ROOT, "src", "content", "media-index.generated.ts");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm"]);

/** filename stem -> public URL, for every file of an accepted type. */
function scan(dir, publicPrefix, allowed) {
  if (!existsSync(dir)) return {};
  const out = {};
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const { name, ext } = parse(entry.name);
    if (!allowed.has(ext.toLowerCase())) continue;
    // Last one wins only if a stem is duplicated across extensions, which is a
    // content mistake rather than something to resolve silently.
    if (out[name]) {
      console.warn(`[media] duplicate stem "${name}" in ${dir} — keeping ${out[name]}`);
      continue;
    }
    out[name] = `${publicPrefix}/${entry.name}`;
  }
  return out;
}

const images = scan(IMAGE_DIR, "/media/images", IMAGE_EXT);
const videos = scan(VIDEO_DIR, "/media/videos", VIDEO_EXT);

const body = `// GENERATED FILE — do not edit.
// Written by scripts/scan-media.mjs from whatever is in public/media.
// Regenerate with \`npm run media\` (also runs automatically before dev and build).

/** Filename stem to public URL, for every image present in public/media/images. */
export const MEDIA_IMAGES: Record<string, string> = ${JSON.stringify(images, null, 2)};

/** Filename stem to public URL, for every clip present in public/media/videos. */
export const MEDIA_VIDEOS: Record<string, string> = ${JSON.stringify(videos, null, 2)};
`;

mkdirSync(join(ROOT, "src", "content"), { recursive: true });
writeFileSync(OUT, body);

const n = Object.keys(images).length;
const m = Object.keys(videos).length;
console.log(`[media] ${n} image${n === 1 ? "" : "s"}, ${m} video${m === 1 ? "" : "s"} -> ${OUT}`);
