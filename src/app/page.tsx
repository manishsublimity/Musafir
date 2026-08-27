import type { Metadata } from "next";
import { CinematicScrollHero } from "@/components/home/CinematicScrollHero";
import { WhosComingAlong } from "@/components/home/WhosComingAlong";
import { TripPlanner } from "@/components/home/TripPlanner";
import { TrendingDestinations } from "@/components/home/TrendingDestinations";
import { VisaFreeDestinations } from "@/components/home/VisaFreeDestinations";
import { DomesticMap } from "@/components/home/DomesticMap";
import { PackagesByDuration } from "@/components/home/PackagesByDuration";
import { AdventureReel, type ReelPanel } from "@/components/home/AdventureReel";
import { InternationalRoutes } from "@/components/home/InternationalRoutes";
import { ThemedDestinations } from "@/components/home/ThemedDestinations";
import { HoneymoonSection } from "@/components/home/HoneymoonSection";
import {
  BookingTicker,
  PartnersSection,
  TravellerStories,
} from "@/components/home/TrustSections";
import { SeeYourselfThere } from "@/components/home/SeeYourselfThere";
import { WhyMusafir } from "@/components/home/WhyMusafir";
import { TravelInspiration, FinalCta } from "@/components/home/ClosingSections";
import { indiaPoints } from "@/content/india-map";
import { site } from "@/content/site";
import {
  getBookingSignals,
  getDestinations,
  getDomesticDestinations,
  getEasyEntryDestinations,
  getFilmExperiences,
  getGuides,
  getHoneymoonPackages,
  getInternationalDestinations,
  getPackages,
  getPartners,
  getReviews,
  getTrendingDestinations,
} from "@/lib/cms";
import { BASE_URL } from "@/lib/seo";
import { toDestinationCard, toPackageCard } from "@/lib/view-models";
import type { DurationBucket } from "@/lib/types";

export const metadata: Metadata = {
  title: `${site.name} — Personalised journeys, designed around you`,
  description: site.description,
  alternates: { canonical: BASE_URL },
};

const BUCKETS: DurationBucket[] = ["2-3", "4-5", "6-7", "8-10", "11-14", "15+"];

export default function HomePage() {
  const packages = getPackages();

  // Everything is mapped to slim view models here, on the server, so the
  // interactive sections receive only the fields they render rather than the
  // whole catalogue.
  const trending = getTrendingDestinations(10).map(toDestinationCard);
  const allDestinations = getDestinations().map(toDestinationCard);
  const easyEntry = getEasyEntryDestinations().map(toDestinationCard);
  const domestic = getDomesticDestinations().map(toDestinationCard);
  const international = getInternationalDestinations().map(toDestinationCard);
  const packageCards = packages.map(toPackageCard);
  const honeymoon = getHoneymoonPackages().map(toPackageCard);

  const packagesByBucket = Object.fromEntries(
    BUCKETS.map((bucket) => [
      bucket,
      packageCards.filter((p) => p.durationBucket === bucket),
    ]),
  );

  const reelPanels: ReelPanel[] = getFilmExperiences().map((experience) => ({
    slug: experience.slug,
    name: experience.name,
    destinationName: experience.destinationName,
    words: experience.filmWords ?? ["GO", "SEE", "IT"],
    scene: experience.hero.scene ?? "mountain",
    summary: experience.summary,
  }));

  return (
    <>
      {/* 01 — Cinematic scroll hero */}
      <CinematicScrollHero />

      {/* 02 — Who's coming along (entry into the customiser) */}
      <WhosComingAlong />

      {/* 03 — Trip planner */}
      <TripPlanner destinations={allDestinations} />

      {/* 04 — Trending destinations */}
      <TrendingDestinations destinations={trending} />

      {/* 05 — Visa-free & easy entry */}
      <VisaFreeDestinations destinations={easyEntry} />

      {/* 06 — India */}
      <DomesticMap points={indiaPoints} destinations={domestic} />

      {/* 07 — Packages by duration */}
      <PackagesByDuration packagesByBucket={packagesByBucket} />

      {/* 08 — Adventures worth chasing */}
      <AdventureReel panels={reelPanels} />

      {/* 09 — International holidays */}
      <InternationalRoutes destinations={international} />

      {/* 10 — Themed destinations */}
      <ThemedDestinations packages={packageCards} />

      {/* 11 — Honeymoon */}
      <HoneymoonSection packages={honeymoon} />

      {/* 12 — Travel partners */}
      <PartnersSection partners={getPartners()} />

      {/* 13 — Social proof */}
      <BookingTicker signals={getBookingSignals()} />

      {/* 14 — Traveller stories */}
      <TravellerStories reviews={getReviews()} />

      {/* 15 — See yourself there */}
      <SeeYourselfThere />

      {/* 16 — Why Musafir */}
      <WhyMusafir />

      {/* 17 — Travel inspiration */}
      <TravelInspiration guides={getGuides()} />

      {/* 18 — Final CTA */}
      <FinalCta />
    </>
  );
}
