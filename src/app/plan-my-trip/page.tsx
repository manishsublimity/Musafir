import type { Metadata } from "next";
import { Suspense } from "react";
import { TripMatcher } from "@/components/plan/TripMatcher";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { getPackages } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export const metadata: Metadata = metadataFrom({
  title: "Plan My Trip",
  description:
    "Answer four questions — who you are travelling with, what you want from the trip, how long you have and your budget — and we will match you to journeys that actually fit.",
  canonical: "/plan-my-trip",
});

export default function PlanMyTripPage() {
  // The whole catalogue is passed as slim cards; matching happens client-side
  // so changing an answer re-ranks instantly without a round trip.
  const packages = getPackages().map((p) => ({
    ...toPackageCard(p),
    // Matching needs a few fields the display card does not carry.
    match: {
      styles: p.styles as string[],
      days: p.days,
      price: p.startingPrice.amount,
      featured: Boolean(p.featured),
    },
  }));

  return (
    <div className="theme-day grain relative bg-background pb-[clamp(4rem,8vw,7rem)] pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Plan my trip", href: "/plan-my-trip" }]} />

        <div className="mt-10 max-w-2xl">
          <h1 className="text-h1">Let&rsquo;s find your trip.</h1>
          <p className="mt-5 text-lede text-muted">
            Four questions. We will show you what fits and tell you honestly when nothing does.
          </p>
        </div>

        <Suspense
          fallback={<div className="mt-14 h-96 animate-pulse rounded-lg bg-surface-raised" />}
        >
          <TripMatcher packages={packages} />
        </Suspense>
      </div>
    </div>
  );
}
