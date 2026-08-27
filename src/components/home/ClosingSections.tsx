import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHead } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/format";
import type { TravelGuide } from "@/lib/types";

/**
 * SECTIONS 16–17 — INSPIRATION & CLOSING CTA
 */

/* ------------------------------------------ 16 — TRAVEL GUIDES -- */

/**
 * Motion identity: *the page turn*. Editorial rows on a light surface, with the
 * scene artwork sitting small and square beside the text rather than behind it
 * — the only place on the homepage where words outrank the image.
 */
export function TravelInspiration({ guides }: { guides: TravelGuide[] }) {
  if (!guides.length) return null;

  return (
    <Section theme="day" ariaLabel="Travel guides">
      <div className="container-editorial">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Travel inspiration"
            title="Written to be useful, not to rank."
            lede="Planning notes from the trips we actually design — seasons, timings, costs and the things that go wrong."
            action={
              <ButtonLink href="/travel-guides" variant="secondary" arrow still>
                All guides
              </ButtonLink>
            }
          />
        </Reveal>

        <Reveal variant="rise" stagger={0.08} as="ul" className="mt-14 border-t border-border">
          {guides.slice(0, 4).map((guide) => (
            <li key={guide.slug} className="border-b border-border">
              <Link
                href={`/travel-guides/${guide.slug}`}
                className="group/guide grid gap-5 py-7 md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-8"
              >
                <span className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-md md:aspect-square md:w-full">
                  <Scene
                    scene={guide.hero.scene ?? "island"}
                    palette={guide.hero.palette}
                    seed={`guide-${guide.slug}`}
                    className="size-full transition-transform duration-[900ms] ease-[--ease-expo] group-hover/guide:scale-110"
                  />
                </span>

                <span className="min-w-0">
                  <span className="block text-caption uppercase tracking-[0.12em] text-muted">
                    {formatDate(guide.updatedAt ?? guide.publishedAt)} · {guide.readingMinutes} min
                    read
                  </span>
                  <h3 className="mt-2 text-h3 leading-tight transition-colors duration-[--duration-fast] group-hover/guide:text-primary">
                    {guide.title}
                  </h3>
                  <span className="mt-2 block max-w-2xl text-body text-muted">{guide.excerpt}</span>
                </span>

                <span
                  aria-hidden="true"
                  className="hidden size-11 shrink-0 place-items-center rounded-full border border-border transition-all duration-[--duration-base] ease-[--ease-expo] group-hover/guide:translate-x-1 group-hover/guide:border-primary group-hover/guide:bg-primary group-hover/guide:text-primary-contrast md:grid"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------------------------- 17 — FINAL CTA -- */

/**
 * Motion identity: *the wide shot*. A deep parallax pulls the artwork slowly
 * upward as the page ends, and the headline is the only element on screen —
 * the page closes on the same note it opened on.
 */
export function FinalCta() {
  return (
    <section
      aria-label="Plan your trip"
      className="theme-sand relative isolate flex min-h-[85svh] items-center overflow-hidden bg-background text-text"
    >
      <Parallax speed={0.4} className="absolute inset-0 -z-10" overscan>
        <Scene scene="mountain" seed="final-cta" className="size-full" />
      </Parallax>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/50"
      />

      <div className="container-editorial py-24 text-center">
        <SplitText
          lines={["Where will your next", "story take you?"]}
          className="mx-auto max-w-4xl text-h1 text-text-strong"
          lineClassName="text-center"
        />

        <p className="mx-auto mt-8 max-w-xl text-lede text-muted">
          Tell us the dates you can take off and who you are going with. We will come back with a
          real itinerary, not a brochure.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/plan-my-trip" size="lg" arrow>
            Plan my trip
          </ButtonLink>
          <ButtonLink href="/packages" variant="outline" size="lg">
            Explore packages
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
