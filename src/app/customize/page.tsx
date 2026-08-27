import type { Metadata } from "next";
import { CustomizeFlow, type CityOption } from "@/components/customize/CustomizeFlow";
import { getDestinations } from "@/lib/cms";
import { toDestinationCard } from "@/lib/view-models";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Customise your trip | Musafir Travels",
  description:
    "Six short questions — who is travelling, where, what you like doing, how long you have and when. We come back with a real itinerary built around your answers.",
  canonical: "/customize",
  // A half-finished form is not a page search should surface.
  noindex: true,
});

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ travelWith?: string; skipStep?: string }>;
}) {
  const params = await searchParams;
  const destinations = getDestinations().map(toDestinationCard);

  // Cities come from the destination records, so the picker can only ever
  // offer places that appear in a real itinerary.
  const cities: CityOption[] = getDestinations().flatMap((destination) =>
    destination.cities
      // Transfer-only stops (0 nights) are not somewhere you "visit".
      .filter((city) => city.nights === undefined || city.nights > 0)
      .map((city) => ({
        id: `${destination.slug}:${city.slug}`,
        label: city.name,
        destinationSlug: destination.slug,
        blurb: city.blurb,
      })),
  );

  // `skipStep` mirrors the query shape the reference flow uses, so an existing
  // campaign link lands on the right step rather than 404ing.
  const initial = params.travelWith ?? params.skipStep;

  return (
    <CustomizeFlow
      destinations={destinations}
      cities={cities}
      initialTravelWith={initial?.toUpperCase()}
    />
  );
}
