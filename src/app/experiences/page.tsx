import type { Metadata } from "next";
import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { getExperiences } from "@/lib/cms";
import { formatMoney, formatSeasonRanges } from "@/lib/format";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Experiences",
  description:
    "The individual days people remember — reef dives, scenic railways, desert nights and root-bridge treks — with honest notes on what each one actually takes.",
  canonical: "/experiences",
});

export default function ExperiencesPage() {
  const experiences = getExperiences();

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Experiences", href: "/experiences" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">The days people actually talk about.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          Each one sits inside a real itinerary — and each one comes with an honest note on what it
          takes, including when we would talk you out of it.
        </p>
      </div>

      <Section theme="day" padded={false} className="py-[clamp(3rem,6vw,5rem)]">
        <div className="container-editorial">
          <Reveal variant="rise" stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience) => (
              <li key={experience.slug}>
                <Link
                  href={`/experiences/${experience.slug}`}
                  className="group/exp flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,transform] duration-[--duration-base] ease-[--ease-expo] hover:-translate-y-1 hover:border-border-strong"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Scene
                      scene={experience.hero.scene ?? "island"}
                      palette={experience.hero.palette}
                      seed={`explist-${experience.slug}`}
                      scrim="bottom"
                      className="size-full transition-transform duration-[900ms] ease-[--ease-expo] group-hover/exp:scale-[1.06]"
                    />
                    <span className="absolute inset-x-0 bottom-0 p-5">
                      <span className="text-caption font-semibold uppercase tracking-[0.12em] text-muted">
                        {experience.destinationName}
                      </span>
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-6">
                    <span className="text-h3 leading-tight">{experience.name}</span>
                    <span className="mt-3 text-body text-muted">{experience.summary}</span>

                    <span className="mt-auto flex items-end justify-between gap-4 pt-6 text-label">
                      <span className="text-muted">
                        {experience.durationLabel}
                        <span className="mt-1 block text-caption">
                          {formatSeasonRanges(experience.bestMonths)}
                        </span>
                      </span>
                      {experience.startingPrice && (
                        <span className="text-right">
                          <span className="block text-caption uppercase tracking-[0.1em] text-muted">
                            From
                          </span>
                          <span className="mt-1 block font-semibold text-text-strong">
                            {formatMoney(experience.startingPrice)}
                          </span>
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
