import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHead } from "@/components/ui/Primitives";
import { promises, site } from "@/content/site";

/**
 * SECTION 15 — WHY MUSAFIR
 *
 * Motion identity: *the ledger*. Rows reveal one at a time as a numbered list
 * rather than as cards — the section is a set of commitments, and a list reads
 * as more accountable than a grid of tiles.
 *
 * Every claim here comes from `content/site.ts`, which is restricted to things
 * the business actually publishes. Nothing is added for rhythm.
 */
export function WhyMusafir() {
  return (
    <Section theme="sand" ariaLabel="Why travel with Musafir">
      <div className="container-editorial">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Why Musafir"
            title="What you are actually buying."
            lede={site.tagline}
          />
        </Reveal>

        <Reveal variant="rise" stagger={0.07} as="ol" className="mt-14 border-t border-border">
          {promises.map((promise, index) => (
            <li
              key={promise.title}
              className="group/row grid gap-3 border-b border-border py-7 md:grid-cols-[4rem_1fr_1.4fr] md:items-baseline md:gap-8"
            >
              <span className="font-[family-name:var(--font-display)] text-h3 text-primary/45 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 transition-transform duration-[--duration-base] ease-[--ease-expo] md:group-hover/row:translate-x-1">
                {promise.title}
              </h3>
              <p className="text-body text-muted">{promise.body}</p>
            </li>
          ))}
        </Reveal>

        <p className="mt-10 max-w-3xl text-label text-muted">
          Anything not listed above is not a promise we are making. Where an itinerary excludes
          something — a local taxi union leg, a peak excursion, a visa fee — it is written into the
          exclusions on the package page rather than left for you to discover on the day.
        </p>
      </div>
    </Section>
  );
}
