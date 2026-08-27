import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Section, SectionHead } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { VisaPanel } from "@/components/content/ContentBlocks";
import { getDestinations } from "@/lib/cms";
import { ENTRY_TYPE_LABELS, verificationAge } from "@/lib/format";
import { metadataFrom } from "@/lib/seo";
import { site } from "@/content/site";
import { cx } from "@/lib/utils";

export const metadata: Metadata = metadataFrom({
  title: "Visa Assistance for Indian Passport Holders | Musafir Travels",
  description:
    "Visa requirements for Indian passport holders by destination — entry type, permitted stay, documents and processing times, each with the official source and the date it was last verified.",
  canonical: "/visa",
  keywords: ["visa for indian passport", "visa free countries for indians", "visa assistance india"],
});

export default function VisaPage() {
  const destinations = getDestinations().filter((d) => d.visa);

  // Group by entry type, easiest first — that is the order people scan in.
  const ORDER = ["visa-free", "visa-on-arrival", "eta", "e-visa", "pre-approved", "sticker-visa"];
  const grouped = ORDER.map((type) => ({
    type,
    items: destinations.filter((d) => d.visa?.entryType === type),
  })).filter((g) => g.items.length > 0);

  const stalest = destinations
    .map((d) => verificationAge(d.visa!.lastVerified))
    .sort((a, b) => b.days - a.days)[0];

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Visa", href: "/visa" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">Visas, without the guesswork.</h1>
        <p className="mt-5 max-w-2xl text-lede text-muted">
          What an Indian passport actually needs for each destination we sell — with the official
          source and the date we last checked it, so you can see how fresh the information is.
        </p>
      </div>

      {/* Disclaimer sits at the top, not buried at the bottom. */}
      <Section theme="day" padded={false} className="py-10" id="disclaimer">
        <div className="container-editorial">
          <div className="rounded-lg border border-accent/40 bg-accent/8 p-6 md:p-8">
            <h2 className="text-h3">Read this first</h2>
            <p className="mt-4 max-w-3xl text-body">
              Entry rules are set by each destination&rsquo;s government and can change without
              notice — several arrangements affecting Indian passports have changed more than once
              in recent years. Everything below is a starting point, not legal advice.
            </p>
            <p className="mt-4 max-w-3xl text-body">
              Musafir Travels prepares documents, reviews applications and books appointments. We
              cannot influence or guarantee a visa decision, and we never advise booking
              non-refundable travel before a visa is granted.
            </p>
            {stalest?.stale && (
              <p className="mt-4 text-label font-semibold">
                Some records below were last verified more than 90 days ago and are flagged for
                re-checking.
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* Quick index by entry type */}
      <Section theme="sand" ariaLabel="Entry types">
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead
              eyebrow="At a glance"
              title="Grouped by how much paperwork it takes."
              lede="Visa-free at the top, embassy appointments at the bottom."
            />
          </Reveal>

          <div className="mt-12 space-y-12">
            {grouped.map((group) => (
              <section key={group.type}>
                <h3 className="flex flex-wrap items-baseline gap-3 text-h3">
                  {ENTRY_TYPE_LABELS[group.type]}
                  <span className="text-label font-normal text-muted">
                    {group.items.length} destination{group.items.length === 1 ? "" : "s"}
                  </span>
                </h3>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.items.map((destination) => {
                    const { stale } = verificationAge(destination.visa!.lastVerified);
                    return (
                      <li key={destination.slug}>
                        <Link
                          href={`/visa/${destination.slug}`}
                          className={cx(
                            "inline-flex items-center gap-2 rounded-pill border px-4 py-2.5 text-label font-medium transition-colors duration-[--duration-fast]",
                            "border-border hover:border-primary hover:text-primary",
                          )}
                        >
                          {destination.name}
                          {destination.visa!.stayDays && (
                            <span className="text-caption text-muted">
                              {destination.visa!.stayDays}d
                            </span>
                          )}
                          {stale && (
                            <span
                              title="Needs re-verifying"
                              aria-label="Needs re-verifying"
                              className="size-1.5 rounded-full bg-accent"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Section>

      {/* Full detail */}
      <Section theme="day" ariaLabel="Visa details by destination">
        <div className="container-editorial">
          <SectionHead eyebrow="In detail" title="Every destination, with its source." />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {destinations.map((destination) => (
              <VisaPanel
                key={destination.slug}
                visa={destination.visa!}
                destinationName={destination.name}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section theme="sand" ariaLabel="Visa help">
        <div className="container-editorial text-center">
          <h2 className="mx-auto max-w-2xl text-h2">Not sure which route applies to you?</h2>
          <p className="mx-auto mt-5 max-w-lg text-lede text-muted">
            Residence permits, existing US or Schengen visas and previous travel history can all
            change which route you qualify for. Send us your details and we will tell you exactly
            what you need.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/enquiry" size="lg" arrow>
              Ask about my visa
            </ButtonLink>
            <ButtonLink href={`https://wa.me/${site.whatsapp}`} variant="outline" size="lg">
              WhatsApp us
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
