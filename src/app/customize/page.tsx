import type { Metadata } from "next";
import { CustomizeFlow, type CityOption } from "@/components/customize/CustomizeFlow";
import { getDestinations } from "@/lib/cms";
import { toDestinationCard } from "@/lib/view-models";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Customise your trip",
  description:
    "Six short questions — who is travelling, where, what you like doing, how long you have and when. We come back with a real itinerary built around your answers.",
  canonical: "/customize",
  // A half-finished form is not a page search should surface.
  noindex: true,
});

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

  // Answers arrive from the hero trip starter (and from campaign links, which
  // use `skipStep`). Anything already answered is carried in so the traveller
  // resumes rather than starting over.
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const list = (v: string | string[] | undefined) =>
    one(v)?.split(",").filter(Boolean) ?? undefined;

  const prefilled: Record<string, string[]> = {};
  for (const key of ["travelWith", "rooms", "destination", "vibe", "duration", "date", "cities"]) {
    const values = list(params[key]);
    if (values?.length) prefilled[key] = values;
  }

  const skip = one(params.skipStep);
  if (skip && !prefilled.travelWith) prefilled.travelWith = [skip.toUpperCase()];
  if (prefilled.travelWith) {
    prefilled.travelWith = prefilled.travelWith.map((v) => v.toUpperCase());
  }

  return <CustomizeFlow destinations={destinations} cities={cities} prefilled={prefilled} />;
}
