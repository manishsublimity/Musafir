import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { getDestinations } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = metadataFrom({
  title: "Enquire | Musafir Travels",
  description:
    "Tell us your dates, who is travelling and roughly what you want to spend. A trip designer comes back within one working day with a draft itinerary.",
  canonical: "/enquiry",
  noindex: true,
});

export default function EnquiryPage() {
  const destinations = getDestinations().map((d) => ({ slug: d.slug, name: d.name }));

  return (
    <Section theme="day" className="pt-32">
      <div className="container-editorial">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Enquire", href: "/enquiry" }]} />

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h1 className="text-h1">Tell us about the trip.</h1>
          <p className="mx-auto mt-5 max-w-lg text-lede text-muted">
            Four short steps. A trip designer replies within one working day with a draft itinerary
            and a real price — not a callback request.
          </p>
        </div>

        <div className="mt-14">
          {/* useSearchParams needs a Suspense boundary to keep the rest of the
              page statically renderable. */}
          <Suspense
            fallback={
              <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-lg bg-surface-raised" />
            }
          >
            <EnquiryForm destinations={destinations} />
          </Suspense>
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-label text-muted">
          Prefer to talk?{" "}
          <a href={`tel:${site.phone}`} className="font-semibold text-primary underline underline-offset-4">
            {site.phoneDisplay}
          </a>{" "}
          or{" "}
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
