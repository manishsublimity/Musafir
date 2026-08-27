import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroBackdrop } from "@/components/media/Frame";
import { Scene } from "@/components/media/Scene";
import { PackageCard } from "@/components/cards/PackageCard";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, JsonLd, Section, SectionHead } from "@/components/ui/Primitives";
import { AnswerBlocks, FaqList, VisaPanel } from "@/components/content/ContentBlocks";
import { DestinationRoute } from "@/components/destination/DestinationRoute";
import {
  getDestination,
  getDestinations,
  getExperiencesForDestination,
  getGuidesForDestination,
  getPackagesForDestination,
} from "@/lib/cms";
import { formatSeasonRanges } from "@/lib/format";
import { destinationSchema, faqSchema, metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export function generateStaticParams() {
  return getDestinations().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return {};
  return metadataFrom(destination.seo);
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const packages = getPackagesForDestination(slug).map(toPackageCard);
  const experiences = getExperiencesForDestination(slug);
  const guides = getGuidesForDestination(slug);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: destination.name, href: `/destinations/${destination.slug}` },
  ];

  return (
    <>
      <JsonLd data={destinationSchema(destination)} />
      <JsonLd data={faqSchema(destination.faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <section
        aria-label={destination.name}
        className="theme-sand relative flex min-h-[94svh] flex-col justify-end overflow-hidden bg-background pb-16 pt-32 text-text"
      >
        <HeroBackdrop media={destination.hero} seed={`dest-hero-${destination.slug}`} scrim="bottom" />

        <div className="container-editorial relative z-[2]">
          <Breadcrumbs trail={trail} className="text-muted" />

          <SplitText
            as="h1"
            immediate
            lines={[`${destination.name},`, destination.tagline]}
            className="mt-8 max-w-4xl text-h1 text-text-strong"
          />

          <p className="mt-7 max-w-2xl text-lede text-muted">{destination.intro}</p>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            {destination.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-caption uppercase tracking-[0.12em] text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-label font-medium text-text-strong">
                  {stat.numeric ? (
                    <Counter
                      to={stat.numeric}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      className="text-price font-semibold text-primary"
                    />
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`/packages/${destination.slug}`} size="lg" arrow>
              View {destination.name} packages
            </ButtonLink>
            <ButtonLink href={`/plan-my-trip?destination=${destination.slug}`} variant="outline" size="lg">
              Plan my trip
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- answers */}
      <Section theme="sand" ariaLabel="Quick answers" className="!py-[clamp(3rem,6vw,5rem)]">
        <div className="container-editorial">
          <AnswerBlocks answers={destination.answers} />
        </div>
      </Section>

      {/* ------------------------------------------------------------- why */}
      <Section theme="day" ariaLabel={`Why ${destination.name}`}>
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead eyebrow="Why go" title={`Why ${destination.name}.`} />
          </Reveal>
          <Reveal variant="rise" stagger as="ul" className="mt-12 grid gap-6 md:grid-cols-2">
            {destination.whyPoints.map((point, i) => (
              <li key={point.title} className="rounded-lg border border-border bg-surface p-7">
                <p className="font-[family-name:var(--font-display)] text-h3 text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-h3">{point.title}</h3>
                <p className="mt-3 text-body text-muted">{point.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------------------- route + cities */}
      {destination.cities.length > 1 && (
        <Section theme="sand" ariaLabel="Route and cities">
          <div className="container-editorial">
            <Reveal variant="rise">
              <SectionHead
                eyebrow="The route"
                title="How a trip here usually joins up."
                lede="The order most itineraries follow, and roughly how long people stay in each place."
              />
            </Reveal>
            <div className="mt-14">
              <DestinationRoute cities={destination.cities} destinationName={destination.name} />
            </div>
          </div>
        </Section>
      )}

      {/* -------------------------------------------------------- packages */}
      {packages.length > 0 && (
        <Section theme="day" ariaLabel={`${destination.name} packages`}>
          <div className="container-editorial">
            <Reveal variant="rise">
              <SectionHead
                eyebrow="Ready-made journeys"
                title={`${destination.name} packages.`}
                lede="Each one can be shortened, extended or rebuilt around your dates."
                action={
                  <ButtonLink href={`/packages/${destination.slug}`} variant="secondary" arrow still>
                    All packages
                  </ButtonLink>
                }
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.slug} data={pkg} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ----------------------------------------------------- experiences */}
      {experiences.length > 0 && (
        <Section theme="sand" ariaLabel="Top experiences">
          <div className="container-editorial">
            <Reveal variant="rise">
              <SectionHead eyebrow="Things to do" title="Top experiences." />
            </Reveal>
            <Reveal variant="rise" stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map((experience) => (
                <li key={experience.slug}>
                  <Link
                    href={`/experiences/${experience.slug}`}
                    className="group/exp relative flex h-72 flex-col justify-end overflow-hidden rounded-lg"
                  >
                    <Scene
                      scene={experience.hero.scene ?? "island"}
                      seed={`exp-${experience.slug}`}
                      className="absolute inset-0 transition-transform duration-[900ms] ease-[--ease-expo] group-hover/exp:scale-[1.07]"
                    />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
                    <span className="relative z-[2] p-6">
                      <span className="block text-h3 text-text-strong">{experience.name}</span>
                      <span className="mt-2 block text-label text-muted">
                        {experience.durationLabel}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </Reveal>
          </div>
        </Section>
      )}

      {/* -------------------------------------------------- practical info */}
      <Section theme="sand" ariaLabel="Practical information">
        <div className="container-editorial grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2">Before you go.</h2>

            {destination.howToReach && (
              <div className="mt-10">
                <h3 className="text-h3">How to reach</h3>
                <p className="mt-3 text-body text-muted">{destination.howToReach}</p>
              </div>
            )}

            <div className="mt-10">
              <h3 className="text-h3">Best time to visit</h3>
              <p className="mt-3 text-body text-muted">
                {formatSeasonRanges(destination.bestMonths)} is the window we recommend for{" "}
                {destination.name}.
              </p>
            </div>

            {destination.budgetGuide && destination.budgetGuide.length > 0 && (
              <div className="mt-10">
                <h3 className="text-h3">Budget guide</h3>
                <dl className="mt-5 divide-y divide-[--color-border] border-y border-border">
                  {destination.budgetGuide.map((band) => (
                    <div key={band.label} className="py-4">
                      <dt className="font-semibold">{band.label}</dt>
                      <dd className="mt-1 text-body text-muted">
                        {band.range}
                        {band.note && <span className="mt-1 block text-label">{band.note}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {destination.travelTips.length > 0 && (
              <div className="mt-10">
                <h3 className="text-h3">Travel tips</h3>
                <ul className="mt-5 space-y-3">
                  {destination.travelTips.map((tip) => (
                    <li key={tip} className="flex gap-3 text-body text-muted">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {destination.visa ? (
              <VisaPanel visa={destination.visa} destinationName={destination.name} />
            ) : (
              <section className="rounded-lg border border-border bg-surface p-6 md:p-8">
                <h3 className="text-h3">No visa needed</h3>
                <p className="mt-3 text-body text-muted">
                  {destination.name} is within India — you need only a government photo ID for
                  domestic flights and hotel check-in.
                </p>
              </section>
            )}

            {destination.highlights.length > 0 && (
              <section className="rounded-lg border border-border bg-surface p-6 md:p-8">
                <h3 className="text-h3">Top things to do</h3>
                <ul className="mt-5 space-y-3">
                  {destination.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-body">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------------- faq */}
      {destination.faqs.length > 0 && (
        <Section theme="day" ariaLabel="Frequently asked questions">
          <div className="container-editorial">
            <Reveal variant="rise">
              <SectionHead eyebrow="Questions" title={`${destination.name}, answered.`} />
            </Reveal>
            <div className="mt-12">
              <FaqList faqs={destination.faqs} />
            </div>
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------------ guides */}
      {guides.length > 0 && (
        <Section theme="sand" ariaLabel="Travel guides">
          <div className="container-editorial">
            <SectionHead eyebrow="Read more" title="Guides for this destination." />
            <ul className="mt-12 grid gap-6 md:grid-cols-2">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/travel-guides/${guide.slug}`}
                    className="group/g block rounded-lg border border-border p-7 transition-colors duration-[--duration-fast] hover:border-border-strong"
                  >
                    <p className="text-caption uppercase tracking-[0.12em] text-muted">
                      {guide.readingMinutes} min read
                    </p>
                    <h3 className="mt-3 text-h3 transition-colors group-hover/g:text-primary">
                      {guide.title}
                    </h3>
                    <p className="mt-3 text-body text-muted">{guide.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* --------------------------------------------------------------- cta */}
      <Section theme="sand" ariaLabel="Plan this trip">
        <div className="container-editorial text-center">
          <h2 className="mx-auto max-w-2xl text-h2">
            Ready to see {destination.name} properly?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lede text-muted">
            Tell us your dates and who is coming. We will send a draft itinerary within a working
            day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`/plan-my-trip?destination=${destination.slug}`} size="lg" arrow>
              Plan my trip
            </ButtonLink>
            <ButtonLink href={`/packages/${destination.slug}`} variant="outline" size="lg">
              Browse packages
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
