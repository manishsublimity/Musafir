import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { DragRail } from "@/components/motion/DragRail";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHead } from "@/components/ui/Primitives";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import type { BookingSignal, Partner, Review } from "@/lib/types";

/**
 * SECTIONS 11–13 — TRUST
 *
 * All three render from collections that ship empty, and all three have a
 * designed empty state rather than placeholder content. That is the whole point
 * of this file: a travel site is under constant pressure to invent reviews,
 * booking activity and partner logos, and the cost of being caught doing it is
 * far higher than the benefit of the social proof.
 *
 * Each empty state says something true and useful instead.
 */

/* ------------------------------------------------ 11 — TRAVEL PARTNERS -- */

export function PartnersSection({ partners }: { partners: Partner[] }) {
  if (!partners.length) {
    // No fabricated tourism-board logos. This says something real instead.
    return (
      <Section theme="sand" ariaLabel="How we work" className="!py-[clamp(3rem,6vw,5rem)]">
        <div className="container-editorial">
          <div className="grid gap-8 border-y border-border py-10 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              How we book
            </p>
            <p className="max-w-3xl text-lede">
              Hotels, transfers and experiences are booked directly or through established local
              operators in each destination, chosen on the ground rather than from a portal. We
              publish partner and accreditation logos only where there is a formal agreement to
              show — so for now, there are none here.
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section theme="sand" ariaLabel="Travel partners" className="!py-[clamp(3rem,6vw,5rem)]">
      <div className="container-editorial">
        <p className="text-center text-caption font-semibold uppercase tracking-[0.14em] text-muted">
          We work with
        </p>
      </div>
      <Marquee className="mt-8" speed={48}>
        {partners.map((partner) => (
          <span
            key={partner.id}
            className="mx-10 inline-flex items-center gap-3 text-h3 opacity-60 transition-opacity duration-[--duration-fast] hover:opacity-100"
          >
            {partner.name}
            <span className="text-caption uppercase tracking-[0.1em] text-muted">
              {partner.relationship}
            </span>
          </span>
        ))}
      </Marquee>
    </Section>
  );
}

/* ------------------------------------------------- 12 — SOCIAL PROOF -- */

export function BookingTicker({ signals }: { signals: BookingSignal[] }) {
  if (!signals.length) {
    return (
      <Section theme="sand" ariaLabel="Popular with travellers" className="!py-[clamp(2.5rem,5vw,4rem)]">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border border-border px-6 py-6 md:px-8">
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              Popular with travellers
            </p>
            <p className="max-w-2xl text-body text-muted">
              A live booking feed will appear here once it is wired to the booking system. Until it
              is, we would rather show nothing than invent names and numbers.
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section theme="sand" ariaLabel="Recent bookings" className="!py-[clamp(2.5rem,5vw,4rem)]">
      <Marquee speed={64} className="border-y border-border py-5">
        {signals.map((signal) => (
          <span key={signal.id} className="mx-8 inline-flex items-center gap-3 text-label">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
            <span className="font-semibold">{signal.travellerFirstName}</span>
            <span className="text-muted">from {signal.city} booked</span>
            <span className="font-semibold">
              {signal.nights} nights in {signal.destination}
            </span>
          </span>
        ))}
      </Marquee>
    </Section>
  );
}

/* -------------------------------------------- 13 — TRAVELLER STORIES -- */

export function TravellerStories({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return (
      <Section theme="day" ariaLabel="Traveller stories">
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead
              eyebrow="Traveller stories"
              title="We publish reviews only after the trip, and only with permission."
              lede="No stock portraits, no invented names, no ratings assembled from nowhere. Real stories are collected after travellers return and go up once they have signed off on them."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Principle
              index="01"
              title="Verified against a booking"
              body="A review is only published if it is attached to a booking we actually handled."
            />
            <Principle
              index="02"
              title="Consent on file"
              body="Names and photographs appear only where the traveller has given written permission."
            />
            <Principle
              index="03"
              title="No aggregate ratings"
              body="We do not emit a star rating in search results until there are enough real reviews to base one on."
            />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface p-6 md:p-8">
            <p className="flex-1 text-body text-muted">
              Travelled with us before? We would genuinely like the write-up — good or otherwise.
            </p>
            <ButtonLink href={`mailto:${site.email}?subject=My%20Musafir%20trip`} variant="secondary" still arrow>
              Share your story
            </ButtonLink>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section theme="day" ariaLabel="Traveller stories" padded={false} className="py-[clamp(4rem,9vw,8.5rem)]">
      <div className="container-editorial">
        <Reveal variant="rise">
          <SectionHead
            eyebrow="Traveller stories"
            title="In their words, after they got back."
            lede="Every story here is attached to a booking we handled, published with the traveller's permission."
          />
        </Reveal>
      </div>

      <DragRail label="Traveller stories" className="mt-12" trackClassName="gap-5 px-[clamp(1.25rem,5vw,4rem)] pb-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="flex w-[85vw] shrink-0 snap-start flex-col rounded-lg border border-border bg-surface p-7 sm:w-[60vw] lg:w-[34vw]"
          >
            <blockquote className="flex-1 text-lede">&ldquo;{review.quote}&rdquo;</blockquote>
            <footer className="mt-7 flex items-center gap-4 border-t border-border pt-6">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
                {review.photo ? (
                  <Scene scene={review.photo.scene ?? "island"} seed={`review-${review.id}`} className="size-full" />
                ) : (
                  <span className="grid size-full place-items-center bg-surface-raised text-label font-semibold">
                    {review.travellerName.charAt(0)}
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <cite className="block truncate font-semibold not-italic">{review.travellerName}</cite>
                <span className="block truncate text-label text-muted">
                  {review.destination} · {formatDate(review.travelDate)}
                </span>
              </span>
            </footer>
            {review.packageSlug && (
              <Link
                href={`/packages/${review.packageSlug}`}
                className="mt-4 text-label font-semibold text-primary underline underline-offset-4"
              >
                See the journey they took
              </Link>
            )}
          </article>
        ))}
        <div aria-hidden="true" className="w-[clamp(1.25rem,5vw,4rem)] shrink-0" />
      </DragRail>
    </Section>
  );
}

function Principle({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-7">
      <p className="font-[family-name:var(--font-display)] text-h2 text-primary/30">{index}</p>
      <h3 className="mt-4 text-h3">{title}</h3>
      <p className="mt-3 text-body text-muted">{body}</p>
    </div>
  );
}
