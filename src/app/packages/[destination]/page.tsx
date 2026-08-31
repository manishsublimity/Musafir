import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBackdrop } from "@/components/media/Frame";
import { PackageExplorer } from "@/components/package/PackageExplorer";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { getDestination, getDestinations, getPackagesForDestination } from "@/lib/cms";
import { formatMoney, formatSeasonRanges, STYLE_LABELS } from "@/lib/format";
import { metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export function generateStaticParams() {
  // Only destinations that actually have packages get a listing page.
  return getDestinations()
    .filter((d) => getPackagesForDestination(d.slug).length > 0)
    .map((d) => ({ destination: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ destination: string }>;
}): Promise<Metadata> {
  const { destination } = await params;
  const record = getDestination(destination);
  if (!record) return {};

  const packages = getPackagesForDestination(destination);
  const from = packages.length
    ? Math.min(...packages.map((p) => p.startingPrice.amount))
    : record.startingPrice.amount;

  return metadataFrom({
    title: `${record.name} Packages from ₹${from.toLocaleString("en-IN")}`,
    description: `${packages.length} ${record.name} holiday packages with day-by-day itineraries, flights, hotels and transfers. Ideal duration ${record.idealDurationDays[0]}–${record.idealDurationDays[1]} days.`,
    canonical: `/packages/${record.slug}`,
    keywords: [`${record.name.toLowerCase()} packages`, `${record.name.toLowerCase()} tour package price`],
  });
}

export default async function DestinationPackagesPage({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const record = getDestination(destination);
  if (!record) notFound();

  const packages = getPackagesForDestination(destination).map(toPackageCard);
  if (!packages.length) notFound();

  const from = Math.min(...packages.map((p) => p.startingPrice));

  return (
    <>
      <section
        aria-label={`${record.name} packages`}
        className="theme-sand relative flex min-h-[62svh] flex-col justify-end overflow-hidden bg-background pb-14 pt-32 text-text"
      >
        <HeroBackdrop media={record.hero} seed={`pkglist-${record.slug}`} scrim="bottom" />

        <div className="container-editorial relative z-[2]">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Packages", href: "/packages" },
              { name: record.name, href: `/packages/${record.slug}` },
            ]}
            className="text-muted"
          />

          <SplitText
            as="h1"
            immediate
            lines={[`${record.name} packages`]}
            className="mt-8 text-h1 text-text-strong"
          />

          <dl className="mt-9 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-7 sm:grid-cols-4">
            <Stat label="Journeys" value={String(packages.length)} />
            <Stat
              label="Ideal duration"
              value={`${record.idealDurationDays[0]}–${record.idealDurationDays[1]} days`}
            />
            <Stat label="Travel season" value={formatSeasonRanges(record.bestMonths)} />
            <Stat
              label="Starting from"
              value={formatMoney({ amount: from, currency: "INR" })}
              emphasis
            />
          </dl>

          <p className="mt-6 flex flex-wrap gap-2">
            {record.styles.slice(0, 4).map((style) => (
              <span
                key={style}
                className="rounded-pill border border-border px-3 py-1.5 text-caption uppercase tracking-[0.08em] text-muted"
              >
                Best for {STYLE_LABELS[style] ?? style}
              </span>
            ))}
          </p>
        </div>
      </section>

      <Section theme="day" ariaLabel="Packages" padded={false} className="pb-[clamp(4rem,8vw,7rem)] pt-4">
        <div className="container-editorial">
          <PackageExplorer packages={packages} />

          <div className="mt-16 rounded-lg border border-border bg-surface p-8 text-center md:p-12">
            <h2 className="mx-auto max-w-2xl text-h2">
              None of these quite right?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lede text-muted">
              Every itinerary here started as a custom trip. Tell us what you want and we will build
              one for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={`/customize?destination=${record.slug}`} arrow>
                Build my own
              </ButtonLink>
              <ButtonLink href={`/destinations/${record.slug}`} variant="secondary">
                About {record.name}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
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
            ? "mt-2 text-price font-semibold text-primary"
            : "mt-2 text-label font-medium text-text-strong"
        }
      >
        {value}
      </dd>
    </div>
  );
}
