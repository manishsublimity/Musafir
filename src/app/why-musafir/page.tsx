import type { Metadata } from "next";
import { WhyMusafir } from "@/components/home/WhyMusafir";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Why Musafir Travels",
  description:
    "What you actually get when you book with Musafir Travels — personalised itineraries, handpicked stays, transparent pricing, visa assistance and support before, during and after the trip.",
  canonical: "/why-musafir",
});

export default function Page() {
  return (
    <>
      <div className="theme-sand grain relative bg-background pt-32 text-text">
        <span className="grain-layer" aria-hidden="true" />
        <div className="container-editorial relative z-[2]">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Why Musafir", href: "/why-musafir" }]} />
          <h1 className="mt-8 max-w-3xl text-h1">Why book with us.</h1>
          <p className="mt-5 max-w-xl text-lede text-muted">
            Six commitments, each of which we would be embarrassed to break.
          </p>
        </div>
      </div>

      <WhyMusafir />

      <Section theme="sand" ariaLabel="Start planning">
        <div className="container-editorial text-center">
          <h2 className="mx-auto max-w-2xl text-h2">See how it works on your trip.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/plan-my-trip" size="lg" arrow>
              Plan my trip
            </ButtonLink>
            <ButtonLink href="/packages" variant="outline" size="lg">
              Browse packages
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
