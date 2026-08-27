import type { BookingSignal, Partner, Review } from "@/lib/types";

/**
 * TRUST CONTENT — DELIBERATELY EMPTY
 * ==================================
 *
 * These three arrays ship empty on purpose, and every component that consumes
 * them renders a designed empty state rather than filler.
 *
 * Reviews, booking activity and partnership claims are the four things a travel
 * site is most tempted to invent and the four that do the most damage when
 * discovered — to the customer, to the business, and (because they are emitted
 * as schema.org `Review` and `AggregateRating`) to the site's standing in search.
 *
 * Populate them only from:
 *   - reviews      → post-travel feedback from a confirmed booking, with the
 *                    traveller's written consent to publish name and photo
 *                    (`verified` and `consentOnFile` must both be true)
 *   - bookings     → the actual booking system, first names and city only
 *   - partners     → a signed agreement, with `relationship` describing the
 *                    real arrangement rather than inflating it to "partner"
 *
 * `lib/cms.ts` filters reviews that are not both verified and consented, so an
 * accidental paste of unverified content will not reach the page.
 */

export const reviews: Review[] = [];

export const bookingSignals: BookingSignal[] = [];

export const partners: Partner[] = [];
