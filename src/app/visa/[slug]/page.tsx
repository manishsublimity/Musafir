import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, Section, SectionHead } from "@/components/ui/Primitives";
import { VisaPanel } from "@/components/content/ContentBlocks";
import { PackageCard } from "@/components/cards/PackageCard";
import { getDestination, getDestinations, getPackagesForDestination } from "@/lib/cms";
import { ENTRY_TYPE_LABELS } from "@/lib/format";
import { metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export function generateStaticParams() {
  return getDestinations()
    .filter((d) => d.visa)
    .map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination?.visa) return {};

  return metadataFrom({
    title: `${destination.name} Visa for Indians — ${ENTRY_TYPE_LABELS[destination.visa.entryType]} | Musafir Travels`,
    description: `${destination.name} visa requirements for Indian passport holders: entry type, permitted stay, documents and processing time, with the official source and the date last verified.`,
    canonical: `/visa/${destination.slug}`,
    keywords: [
      `${destination.name.toLowerCase()} visa for indians`,
      `${destination.name.toLowerCase()} visa requirements`,
    ],
  });
}

export default async function VisaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination?.visa) notFound();

  const packages = getPackagesForDestination(slug).map(toPackageCard);
  const visaAnswer = destination.answers.find((a) => a.question.toLowerCase().includes("visa"));

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs
          trail={[
            { name: "Home", href: "/" },
            { name: "Visa", href: "/visa" },
            { name: destination.name, href: `/visa/${destination.slug}` },
          ]}
        />
        <h1 className="mt-8 max-w-3xl text-h1">
          {destination.name} visa for Indian passport holders.
        </h1>

        {visaAnswer && (
          <p className="mt-6 max-w-2xl text-lede text-muted">{visaAnswer.answer}</p>
        )}
      </div>

      <Section theme="day" padded={false} className="py-[clamp(3rem,6vw,5rem)]">
        <div className="container-editorial grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <VisaPanel visa={destination.visa} destinationName={destination.name} />

          <aside className="rounded-lg border border-border bg-surface p-6 md:p-8">
            <h2 className="text-h3">How Musafir helps</h2>
            <ul className="mt-6 space-y-3">
              {[
                "A document checklist specific to your profile, not a generic list",
                "Application form review before submission",
                "Appointment booking guidance where slots are the bottleneck",
                "Covering letters and itinerary documentation for the application",
                "Honest advice on timing — we will tell you when it is too tight",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-7 border-t border-border pt-5 text-label text-muted">
              We do not charge for visa assistance on a booked package, and we never guarantee an
              outcome — the decision rests entirely with the issuing authority.
            </p>

            <ButtonLink href="/enquiry" className="mt-7 w-full" arrow still>
              Ask about this visa
            </ButtonLink>
          </aside>
        </div>
      </Section>

      {packages.length > 0 && (
        <Section theme="sand" ariaLabel={`${destination.name} packages`}>
          <div className="container-editorial">
            <SectionHead
              eyebrow="While you are here"
              title={`${destination.name} journeys.`}
              lede="Visa assistance is included with every package below."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.slug} data={pkg} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
