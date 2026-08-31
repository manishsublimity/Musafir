import type { Metadata } from "next";
import { DestinationExplorer } from "@/components/destination/DestinationExplorer";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { getDomesticDestinations } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { toDestinationCard } from "@/lib/view-models";

export const metadata: Metadata = metadataFrom({
  title: "Domestic Holidays in India",
  description:
    "Holidays within India — Kashmir, Ladakh, Kerala, Rajasthan, Meghalaya, Sikkim, Goa and the Andamans. No visa, no currency exchange, and landscapes that hold their own anywhere.",
  canonical: "/domestic-holidays",
  keywords: ["domestic tour packages india", "india holiday packages", "best places to visit in india"],
});

export default function DomesticHolidaysPage() {
  const destinations = getDomesticDestinations().map(toDestinationCard);

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs
          trail={[{ name: "Home", href: "/" }, { name: "Domestic holidays", href: "/domestic-holidays" }]}
        />
        <h1 className="mt-8 max-w-3xl text-h1">India, in eight very different directions.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          No passport, no visa queue, no currency exchange — and scenery that competes with anywhere
          we send people abroad.
        </p>
      </div>

      <DestinationExplorer destinations={destinations} />
    </div>
  );
}
