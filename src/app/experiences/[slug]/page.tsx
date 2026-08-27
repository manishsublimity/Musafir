import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBackdrop } from "@/components/media/Frame";
import { PackageCard } from "@/components/cards/PackageCard";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, JsonLd, Section, SectionHead } from "@/components/ui/Primitives";
import { FaqList } from "@/components/content/ContentBlocks";
import { getExperience, getExperiences, getPackagesForDestination } from "@/lib/cms";
import { formatMoney, formatSeasonRanges } from "@/lib/format";
import { faqSchema, metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export function generateStaticParams() {
  return getExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return {};
  return metadataFrom(experience.seo, { type: "article" });
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) notFound();

  // Packages whose itinerary actually contains this experience.
  const packages = getPackagesForDestination(experience.destinationSlug)
    .filter((p) =>
      p.itinerary.some((day) => day.activities.some((a) => a.experienceSlug === experience.slug)),
    )
    .map(toPackageCard);

  return (
    <>
      <JsonLd data={faqSchema(experience.faqs)} />

      <section
        aria-label={experience.name}
        className="theme-sand relative flex min-h-[72svh] flex-col justify-end overflow-hidden bg-background pb-14 pt-32 text-text"
      >
        <HeroBackdrop media={experience.hero} seed={`exp-hero-${experience.slug}`} scrim="bottom" />

        <div className="container-editorial relative z-[2]">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Experiences", href: "/experiences" },
              { name: experience.name, href: `/experiences/${experience.slug}` },
            ]}
            className="text-muted"
          />

          {experience.filmWords && (
            <p className="mt-8 flex flex-wrap gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-primary">
              {experience.filmWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>
          )}

          <SplitText
            as="h1"
            immediate
            lines={[experience.name]}
            className="mt-5 max-w-3xl text-h1 text-text-strong"
          />

          <p className="mt-6 max-w-2xl text-lede text-muted">{experience.summary}</p>

          <dl className="mt-9 grid max-w-2xl grid-cols-2 gap-6 border-t border-border pt-7 sm:grid-cols-3">
            <div>
              <dt className="text-caption uppercase tracking-[0.12em] text-muted">Duration</dt>
              <dd className="mt-2 text-label font-medium text-text-strong">{experience.durationLabel}</dd>
            </div>
            <div>
              <dt className="text-caption uppercase tracking-[0.12em] text-muted">Best months</dt>
              <dd className="mt-2 text-label font-medium text-text-strong">
                {formatSeasonRanges(experience.bestMonths)}
              </dd>
            </div>
            {experience.startingPrice && (
              <div>
                <dt className="text-caption uppercase tracking-[0.12em] text-muted">From</dt>
                <dd className="mt-2 text-price font-semibold text-primary">
                  {formatMoney(experience.startingPrice)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <Section theme="day" ariaLabel="About this experience">
        <div className="container-prose">
          <h2 className="text-h2">What it is actually like.</h2>
          <p className="mt-6 text-lede text-muted">{experience.body}</p>

          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href={`/destinations/${experience.destinationSlug}`} variant="secondary" arrow still>
              About {experience.destinationName}
            </ButtonLink>
            <ButtonLink href={`/plan-my-trip?destination=${experience.destinationSlug}`} arrow>
              Build a trip around this
            </ButtonLink>
          </div>
        </div>
      </Section>

      {experience.faqs.length > 0 && (
        <Section theme="sand" ariaLabel="Questions">
          <div className="container-prose">
            <h2 className="text-h2">Questions.</h2>
            <div className="mt-10">
              <FaqList faqs={experience.faqs} />
            </div>
          </div>
        </Section>
      )}

      {packages.length > 0 && (
        <Section theme="sand" ariaLabel="Journeys including this experience">
          <div className="container-editorial">
            <SectionHead
              eyebrow="Included in"
              title="Journeys that build this in."
              lede="These itineraries already have this day scheduled, with the timing it actually needs."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.slug} data={pkg} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
