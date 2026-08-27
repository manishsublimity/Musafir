import type { Metadata } from "next";
import { TravellerStories } from "@/components/home/TrustSections";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { getReviews } from "@/lib/cms";
import { metadataFrom, reviewSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/Primitives";

export const metadata: Metadata = metadataFrom({
  title: "Traveller Stories | Musafir Travels",
  description:
    "Reviews from Musafir Travels customers — published only after the trip, only where they are attached to a real booking, and only with the traveller's written permission.",
  canonical: "/testimonials",
});

export default function Page() {
  const reviews = getReviews();

  return (
    <>
      {/* Emitted only when there are verified, consented reviews behind it. */}
      <JsonLd data={reviewSchema(reviews)} />

      <div className="theme-day grain relative bg-background pt-32 text-text">
        <span className="grain-layer" aria-hidden="true" />
        <div className="container-editorial relative z-[2]">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Traveller stories", href: "/testimonials" }]} />
          <h1 className="mt-8 max-w-3xl text-h1">In their words, after they got back.</h1>
        </div>
      </div>

      <TravellerStories reviews={reviews} />
    </>
  );
}
