import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBackdrop } from "@/components/media/Frame";
import { ItineraryExperience } from "@/components/package/ItineraryExperience";
import { TripCustomiser } from "@/components/package/TripCustomiser";
import { StickyBookBar } from "@/components/package/StickyBookBar";
import { PackageCard } from "@/components/cards/PackageCard";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import {
  Breadcrumbs,
  JsonLd,
  Section,
  SectionHead,
} from "@/components/ui/Primitives";
import { getPackage, getPackages, getPackagesForDestination } from "@/lib/cms";
import { formatMoney, formatSeasonRanges, STYLE_LABELS } from "@/lib/format";
import {
  faqSchema,
  metadataFrom,
  packageSchema,
  tripSchema,
} from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";
import { AnswerBlocks, FaqList } from "@/components/content/ContentBlocks";

export function generateStaticParams() {
  return getPackages().map((p) => ({ destination: p.destinationSlug, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ destination: string; slug: string }>;
}): Promise<Metadata> {
  const { destination, slug } = await params;
  const pkg = getPackage(destination, slug);
  if (!pkg) return {};
  return metadataFrom(pkg.seo, { type: "article" });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ destination: string; slug: string }>;
}) {
  const { destination, slug } = await params;
  const pkg = getPackage(destination, slug);
  if (!pkg) notFound();

  const related = getPackagesForDestination(destination)
    .filter((p) => p.slug !== pkg.slug)
    .map(toPackageCard);

  const enquiryHref = `/enquiry?package=${pkg.slug}&destination=${pkg.destinationSlug}`;

  const trail = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: pkg.destinationName, href: `/packages/${pkg.destinationSlug}` },
    { name: pkg.title, href: `/packages/${pkg.destinationSlug}/${pkg.slug}` },
  ];

  return (
    <>
      <JsonLd data={packageSchema(pkg)} />
      <JsonLd data={tripSchema(pkg)} />
      <JsonLd data={faqSchema(pkg.faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <section
        aria-label={pkg.title}
        className="theme-sand relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-background pb-16 pt-32 text-text"
      >
        <HeroBackdrop media={pkg.hero} seed={`pkg-hero-${pkg.slug}`} scrim="bottom" />

        <div className="container-editorial relative z-[2]">
          <Breadcrumbs trail={trail} className="text-muted" />

          <p className="mt-8 flex flex-wrap items-center gap-2">
            <span className="rounded-pill border border-primary/40 bg-primary/12 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-primary">
              {pkg.days} Days / {pkg.nights} Nights
            </span>
            {pkg.styles.slice(0, 3).map((style) => (
              <span
                key={style}
                className="rounded-pill border border-border px-3 py-1.5 text-caption uppercase tracking-[0.08em] text-muted"
              >
                {STYLE_LABELS[style] ?? style}
              </span>
            ))}
          </p>

          <SplitText
            as="h1"
            immediate
            lines={[pkg.title]}
            className="mt-6 max-w-4xl text-h1 text-text-strong"
          />

          <p className="mt-6 max-w-2xl text-lede text-muted">{pkg.summary}</p>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            <Stat label="Route" value={pkg.cities.map((c) => c.name).join(" → ")} />
            <Stat label="Best season" value={formatSeasonRanges(pkg.bestMonths)} />
            <Stat label="Stay" value={pkg.hotelCategory.replace("-", " ")} />
            <Stat label="From" value={formatMoney(pkg.startingPrice)} emphasis />
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#customise" size="lg" arrow>
              Customise this trip
            </ButtonLink>
            <ButtonLink href={enquiryHref} variant="outline" size="lg">
              Book / Enquire
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- answers */}
      {pkg.answers.length > 0 && (
        <Section theme="sand" ariaLabel="Quick answers" className="!py-[clamp(3rem,6vw,5rem)]">
          <div className="container-editorial">
            <AnswerBlocks answers={pkg.answers} />
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------- highlights */}
      <Section theme="day" ariaLabel="Trip highlights">
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead
              eyebrow="What you will remember"
              title="The days this trip is built around."
            />
          </Reveal>
          <Reveal variant="rise" stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pkg.highlights.map((highlight, i) => (
              <li
                key={highlight}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <p className="font-[family-name:var(--font-display)] text-h3 text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-body">{highlight}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------------------------- itinerary */}
      <Section theme="sand" ariaLabel="Day by day itinerary" id="itinerary">
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead
              eyebrow="Day by day"
              title="How the trip actually happens."
              lede="Every day, in order, with the transfers, the timings and what is included. Nothing hidden behind an accordion."
            />
          </Reveal>
        </div>

        <div className="mt-16">
          <ItineraryExperience
            days={pkg.itinerary}
            cities={pkg.cities}
            packageSlug={pkg.slug}
          />
        </div>
      </Section>

      {/* -------------------------------------------------------- customise */}
      <Section theme="day" ariaLabel="Customise this trip" id="customise">
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead
              eyebrow="Make it yours"
              title="Make this trip yours."
              lede="Change the party size, the hotel category and the experiences. The price updates as you go, and nothing is charged until you confirm."
            />
          </Reveal>

          <div className="mt-14">
            <TripCustomiser
              pricing={pkg.pricing}
              packageSlug={pkg.slug}
              baseCategory={pkg.hotelCategory}
            />
          </div>
        </div>
      </Section>

      {/* -------------------------------------------- inclusions/exclusions */}
      <Section theme="sand" ariaLabel="What is included">
        <div className="container-editorial grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h3">What&rsquo;s included</h2>
            <ul className="mt-6 space-y-3">
              {pkg.inclusions.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-h3">What&rsquo;s not included</h2>
            <ul className="mt-6 space-y-3">
              {pkg.exclusions.map((item) => (
                <li key={item} className="flex gap-3 text-body text-muted">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-border-strong" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------------- faq */}
      {pkg.faqs.length > 0 && (
        <Section theme="day" ariaLabel="Frequently asked questions">
          <div className="container-editorial">
            <Reveal variant="rise">
              <SectionHead eyebrow="Before you book" title="Questions we get asked." />
            </Reveal>
            <div className="mt-12">
              <FaqList faqs={pkg.faqs} />
            </div>
          </div>
        </Section>
      )}

      {/* ----------------------------------------------------------- related */}
      {related.length > 0 && (
        <Section theme="sand" ariaLabel="Other journeys">
          <div className="container-editorial">
            <SectionHead
              eyebrow="Also in this destination"
              title={`More ways to see ${pkg.destinationName}.`}
              action={
                <ButtonLink href={`/packages/${pkg.destinationSlug}`} variant="secondary" arrow still>
                  All {pkg.destinationName} packages
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PackageCard key={item.slug} data={item} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <StickyBookBar
        title={pkg.title}
        price={pkg.startingPrice.amount}
        href={enquiryHref}
        packageSlug={pkg.slug}
      />
    </>
  );
}

function Stat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <dt className="text-caption uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd
        className={
          emphasis
            ? "mt-2 text-price font-semibold capitalize text-primary"
            : "mt-2 text-label font-medium capitalize text-text-strong"
        }
      >
        {value}
      </dd>
    </div>
  );
}
