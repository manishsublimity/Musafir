import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Breadcrumbs, JsonLd, Section } from "@/components/ui/Primitives";
import { getDestinations } from "@/lib/cms";
import { metadataFrom, organizationSchema } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = metadataFrom({
  title: "Contact Musafir Travels",
  description: `Talk to a Musafir Travels trip designer — call ${site.phoneDisplay}, WhatsApp, or email ${site.email}.`,
  canonical: "/contact",
});

export default function ContactPage() {
  const destinations = getDestinations().map((d) => ({ slug: d.slug, name: d.name }));

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <JsonLd data={organizationSchema()} />
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">Talk to a trip designer.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          One person handles your trip from the first enquiry to the day you get home. No call
          centre, no ticket queue.
        </p>
      </div>

      <Section theme="day" padded={false} className="py-[clamp(3rem,6vw,5rem)]">
        <div className="container-editorial grid gap-12 lg:grid-cols-[22rem_1fr] lg:items-start">
          <aside className="space-y-8">
            <div className="rounded-lg border border-border bg-surface p-7">
              <h2 className="text-h3">Direct lines</h2>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-caption uppercase tracking-[0.12em] text-muted">Phone</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:${site.phone}`}
                      className="text-lede font-semibold transition-colors hover:text-primary"
                    >
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-caption uppercase tracking-[0.12em] text-muted">WhatsApp</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`https://wa.me/${site.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lede font-semibold transition-colors hover:text-primary"
                    >
                      Message us
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-caption uppercase tracking-[0.12em] text-muted">Email</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${site.email}`}
                      className="break-all text-lede font-semibold transition-colors hover:text-primary"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                {site.address && (
                  <div>
                    <dt className="text-caption uppercase tracking-[0.12em] text-muted">Based in</dt>
                    <dd className="mt-1.5 text-body">
                      {site.address.locality}, {site.address.region}, India
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-surface p-7">
              <h2 className="text-h3">Follow along</h2>
              <ul className="mt-5 space-y-2">
                {site.social.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body font-medium transition-colors hover:text-primary"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-label text-muted">
              We reply to enquiries within one working day. If something is urgent while you are
              travelling with us, call — do not email.
            </p>
          </aside>

          <div className="rounded-lg border border-border bg-surface p-7 md:p-10">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-raised" />}>
              <EnquiryForm destinations={destinations} />
            </Suspense>
          </div>
        </div>
      </Section>
    </div>
  );
}
