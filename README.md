# Musafir Travels

An immersive travel-commerce platform for **Musafir Travels by Paridhi Jaiman** — personalised
international and domestic holidays for Indian travellers.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, GSAP/ScrollTrigger and Lenis.

---

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

> Do not run `npm run build` while `npm run dev` is running — they share `.next` and the build
> will corrupt the dev server's manifests.

---

## Architecture

### Content is data, not markup

Every page renders from the typed shapes in [`src/lib/types.ts`](src/lib/types.ts) and nothing
else. No component reaches for a hardcoded destination, price or itinerary.

[`src/lib/cms.ts`](src/lib/cms.ts) is the **only** door to content. Pages import from there, never
from `src/content/*` directly. To move to a real CMS, make those functions `async` and await them
in the (already async) server components — nothing else changes.

```
src/content/     seed data — destinations, packages, experiences, guides, legal
src/lib/cms.ts   the single data-access layer  ← swap this for an API
src/lib/types.ts the content model
```

### Design tokens

All colour, type, spacing, radius and motion values live in `@theme` in
[`src/app/globals.css`](src/app/globals.css). Nothing is hardcoded elsewhere.

The palette is derived from the logo, which uses exactly two colours — amber `#FFB403` and
charcoal `#2B2A29`. Every other value is a tint, shade or neutral of those two; no third hue is
introduced. On light surfaces the amber steps down the ramp (`--color-amber-700`) so it passes
contrast rather than switching to a different colour.

Sections carry `.theme-day` / `.theme-sand`; components only ever read semantic tokens
(`bg-surface`, `text-muted`), so the same card renders correctly in any context.

### Motion

`src/lib/motion.ts` is the only place GSAP is registered and the only place timings live in JS
(they mirror the CSS custom properties — change one, change the other).

Every scroll-driven component goes through `withMotion()`, which collapses to plain visibility
when `prefers-reduced-motion` is set. Smooth scrolling, the custom cursor and both pinned sections
all disable themselves under that preference.

**If you add a pinned ScrollTrigger:** pin an inner `[data-pin-target]` wrapper, never a
React-owned `<section>`. ScrollTrigger wraps whatever it pins in a `.pin-spacer`, and if that is
an element React expects to find under its own parent, navigation throws
`removeChild: the node to be removed is not a child of this node`. See
[`AdventureReel.tsx`](src/components/home/AdventureReel.tsx) and
[`SeeYourselfThere.tsx`](src/components/home/SeeYourselfThere.tsx).

### Imagery

`Media` slots resolve in order: real photo (`src`) → generated scene → nothing.

Where no photograph exists, [`Scene.tsx`](src/components/media/Scene.tsx) draws original layered
SVG artwork from a deterministic, memoised geometry description
([`scene-geometry.ts`](src/components/media/scene-geometry.ts)). Geometry is computed **outside**
render because the PRNG is stateful — computing it during render makes StrictMode's second pass
produce different output and the tree mismatches.

Only five destinations currently have real photography (Bali, Maldives, Dubai, Switzerland,
Japan). The rest deliberately keep the generated art rather than borrowing an unrelated photo —
mislabelled destination imagery is a trust problem on a travel site. Drop new photos in
`public/images/` and set `hero.src` on the record.

---

## Things that are deliberately empty

`src/content/trust.ts` ships with **no** reviews, booking signals or partner logos, and every
consuming component has a designed empty state rather than filler.

These are the four things a travel site is most tempted to invent and the four that do the most
damage when discovered — to the customer, to the business, and (because they are emitted as
schema.org `Review` / `AggregateRating`) to the site's standing in search.

Populate only from:

- **reviews** — post-travel feedback against a confirmed booking, with written consent to publish
  name and photo. `cms.ts` filters anything not both `verified` and `consentOnFile`.
- **bookings** — the real booking system. First names and city only.
- **partners** — a signed agreement, with `relationship` describing the actual arrangement.

`aggregateRating` is only emitted once there are verified reviews behind it.

---

## Before this goes live

- [ ] **Legal review.** The policies in `src/content/legal.ts` are readable drafts, not legal
      advice. They need checking against the Consumer Protection Act 2019, the Consumer Protection
      (E-Commerce) Rules 2020 and the DPDP Act 2023.
- [ ] **Visa data.** Records carry `lastVerified` and an official source; the UI flags anything
      older than 90 days. Re-verify before launch and set a recurring review.
- [ ] **Wire the enquiry endpoint.** `src/app/api/enquiry/route.ts` validates, rate-limits and
      spam-checks, then `TODO`s where the CRM handoff goes.
- [ ] **Rate limiting** is in-memory and single-instance. Move to Redis/KV before scaling out.
- [ ] **Analytics provider.** `src/lib/analytics.ts` is a no-op until `setAnalyticsProvider()` is
      called; events are buffered and replayed.
- [ ] **The `Ogg Medium` font cannot load.** The host sends no `Access-Control-Allow-Origin` and
      `@font-face` always requires CORS, so it falls back to a Didot/Bodoni stack. Self-hosting
      would fix it, but Ogg is licensed commercial type — that is a licensing decision.
- [ ] **The cinematic hero hotlinks third-party assets** from `raft-blast-61784561.figma.site`.
      Those URLs are not under our control and can disappear. The component is prop-driven, so
      swapping in Musafir imagery is a data change.

---

## Company facts

`src/content/site.ts` holds verified company details only. Do not add awards, accreditations,
traveller counts or partnership claims without documentary evidence — several of these values are
emitted inside schema.org markup, where an unsupportable claim is a structured-data violation as
well as a trust problem.
