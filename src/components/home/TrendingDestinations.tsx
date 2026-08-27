import { DestinationCard } from "@/components/cards/DestinationCard";
import { DragRail } from "@/components/motion/DragRail";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHead } from "@/components/ui/Primitives";
import type { DestinationCard as DestinationCardData } from "@/lib/view-models";

/**
 * SECTION 03 — TRENDING DESTINATIONS
 *
 * Motion identity: *lateral travel*. A drag-and-snap rail of tall cinematic
 * cards. The horizontal axis is doing the storytelling here, which is why no
 * other section on the homepage uses a horizontal card rail — repeating it
 * would flatten the distinction.
 */
export function TrendingDestinations({ destinations }: { destinations: DestinationCardData[] }) {
  return (
    <Section theme="sand" ariaLabel="Trending destinations">
      <div className="container-editorial">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Trending now"
            title="The places people keep asking for."
            lede="Ranked by what travellers are actually booking this season — not by who paid for placement."
            action={
              <ButtonLink href="/destinations" variant="secondary" arrow still>
                All destinations
              </ButtonLink>
            }
          />
        </Reveal>
      </div>

      <DragRail
        label="Trending destinations"
        className="mt-12"
        trackClassName="gap-5 px-[clamp(1.25rem,5vw,4rem)] pb-4"
      >
        {destinations.map((destination) => (
          <div
            key={destination.slug}
            className="w-[78vw] shrink-0 snap-start sm:w-[58vw] md:w-[38vw] lg:w-[26vw] xl:w-[22vw]"
          >
            <DestinationCard data={destination} className="h-[clamp(26rem,44vw,34rem)]" />
          </div>
        ))}
        {/* Trailing spacer so the last card can snap fully into view. */}
        <div aria-hidden="true" className="w-[clamp(1.25rem,5vw,4rem)] shrink-0" />
      </DragRail>
    </Section>
  );
}
