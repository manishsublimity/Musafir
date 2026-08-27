"use client";

/**
 * ANALYTICS
 *
 * A thin, provider-agnostic event bus. Nothing here loads a script, blocks
 * rendering or runs on the server, and every call is a no-op until a provider
 * is attached — so instrumenting a component costs nothing at runtime and the
 * choice of vendor stays a single-file decision.
 *
 * Attach a provider once, from a client component:
 *   setAnalyticsProvider((name, props) => window.gtag?.("event", name, props));
 */

export type AnalyticsEvent =
  | "destination_viewed"
  | "package_viewed"
  | "filter_used"
  | "search_performed"
  | "plan_trip_clicked"
  | "whatsapp_clicked"
  | "call_clicked"
  | "enquiry_started"
  | "enquiry_step_completed"
  | "enquiry_completed"
  | "customize_clicked"
  | "customize_option_changed"
  | "activity_viewed"
  | "add_activity_clicked"
  | "booking_started"
  | "booking_completed"
  | "itinerary_day_viewed"
  | "recommendation_shown";

type Props = Record<string, string | number | boolean | undefined>;
type Provider = (event: AnalyticsEvent, props?: Props) => void;

let provider: Provider | null = null;
/** Events fired before a provider attaches are replayed, not lost. */
const buffer: { event: AnalyticsEvent; props?: Props }[] = [];
const BUFFER_LIMIT = 50;

export function setAnalyticsProvider(next: Provider): void {
  provider = next;
  while (buffer.length) {
    const queued = buffer.shift();
    if (queued) next(queued.event, queued.props);
  }
}

export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  if (provider) {
    provider(event, props);
    return;
  }
  if (buffer.length < BUFFER_LIMIT) buffer.push({ event, props });
}

/**
 * Fires once when an element first becomes meaningfully visible. Used for
 * view-type events so scroll position, not render, defines a "view".
 */
export function trackOnceVisible(
  element: Element,
  event: AnalyticsEvent,
  props?: Props,
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    track(event, props);
    return () => {};
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          track(event, props);
          observer.disconnect();
        }
      }
    },
    { threshold: 0.4 },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
