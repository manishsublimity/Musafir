import type { Metadata } from "next";
import { DestinationExplorer } from "@/components/destination/DestinationExplorer";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { getDestinations } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { toDestinationCard } from "@/lib/view-models";

export const metadata: Metadata = metadataFrom(
  {
    title: "All Destinations",
    description:
      "Every destination Musafir Travels designs trips to — across Asia, Europe, the Middle East, Africa, Oceania and India. Filter by region, style, duration, budget, season and visa.",
    canonical: "/destinations",
    keywords: ["travel destinations from india", "international holiday destinations", "domestic destinations india"],
  },
  { type: "website" },
);

export default function DestinationsPage() {
  const destinations = getDestinations().map(toDestinationCard);

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">Find your next escape.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          {destinations.length} destinations we actually design trips to — not a directory of
          everywhere on earth.
        </p>
      </div>

      <DestinationExplorer destinations={destinations} />
    </div>
  );
}
