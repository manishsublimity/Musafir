import type { Metadata } from "next";
import { PackageExplorer } from "@/components/package/PackageExplorer";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { getPackages } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export const metadata: Metadata = metadataFrom({
  title: "All Tour Packages",
  description:
    "Every Musafir Travels holiday package — international and domestic, 3 to 13 days, with day-by-day itineraries, transparent inclusions and prices that can be customised.",
  canonical: "/packages",
  keywords: ["tour packages from india", "holiday packages", "international tour packages"],
});

export default function PackagesPage() {
  const packages = getPackages().map(toPackageCard);

  return (
    <div className="theme-day grain relative bg-background pb-[clamp(4rem,8vw,7rem)] pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Packages", href: "/packages" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">Every journey we have designed.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          Each one is a real itinerary with real timings — and each one can be shortened, extended
          or rebuilt around your dates.
        </p>

        <PackageExplorer packages={packages} />
      </div>
    </div>
  );
}
