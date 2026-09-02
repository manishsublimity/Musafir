# Drop media here

Files in this folder are picked up automatically. Name a file after the slug
and the matching card gets a photograph or a hover clip on the next build. Take
the file out and the card falls back to its generated scene. No code changes
either way.

```
public/media/
  images/   <slug>.jpg   (also .png .webp .avif)
  videos/   <slug>.mp4   (also .webm)
```

`scripts/scan-media.mjs` indexes whatever is here into
`src/content/media-index.generated.ts`. It runs automatically before `dev` and
`build`; run it by hand with `npm run media`.

## Slugs

**Countries** — `australia` `bali` `maldives` `dubai` `thailand` `switzerland`
`vietnam` `japan` `mauritius` `malaysia` `kashmir` `kerala` `ladakh`
`rajasthan` `meghalaya` `andaman` `goa` `sikkim`

**Vibes** — `leisure` `nature` `attraction` `culture` `adventure`

**Party types** — `couple` `family` `friends` `solo`

Five destinations already carry photography under `/public/images` named after
the picture rather than the slug (`swiss-alps.jpg`, `kyoto-temple.jpg`,
`maldives-overwater.jpg`). Those stay where they are; an explicit `src` in the
content record always beats this folder. Adding `switzerland.jpg` here will not
override it — change the record if you want to replace one.

## Video

A clip plays on card hover, muted, from the start, and stops when the pointer
leaves. Sound is opt-in per card and only one card can be audible at a time.

Keep clips short and small. These load on hover across a rail of eighteen
destinations, so a 30MB 4K file is the wrong asset even though it will work:
5–10 seconds at 720p, silent-friendly, is the target. For anything larger,
prefer a CDN — the content record takes an absolute URL:

```ts
video: { mp4: "https://your-cdn.example.com/musafir/bali.mp4" }
```

## Provenance

Record where each file came from before committing it. For Pixabay, keep the
asset's own page URL and the download date; the licence is per-asset and
"downloaded from Pixabay" is not a record of anything. See
`docs/media-manifest.md` for the search targets this naming came from.
