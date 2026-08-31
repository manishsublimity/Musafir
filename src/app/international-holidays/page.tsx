import type { Metadata } from "next";
import { DestinationExplorer } from "@/components/destination/DestinationExplorer";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { getInternationalDestinations } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { toDestinationCard } from "@/lib/view-models";

export const metadata: Metadata = metadataFrom({
  title: "International Holidays from India",
  description:
    "International holiday packages from India across Asia, Europe, the Middle East, Africa and Oceania — with visa guidance, realistic budgets and day-by-day itineraries.",
  canonical: "/international-holidays",
  keywords: ["international tour packages from india", "foreign trip packages", "abroad holiday packages"],
});

export default function InternationalHolidaysPage() {
  const destinations = getInternationalDestinations().map(toDestinationCard);

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs
          trail={[
            { name: "Home", href: "/" },
            { name: "International holidays", href: "/international-holidays" },
          ]}
        />
        <h1 className="mt-8 max-w-3xl text-h1">Everywhere we send people.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          Each destination comes with the visa route for an Indian passport, the season that
          actually works, and what a trip there realistically costs.
        </p>
      </div>

      <DestinationExplorer destinations={destinations} />
    </div>
  );
}
