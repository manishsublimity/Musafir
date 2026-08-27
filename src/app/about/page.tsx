import type { Metadata } from "next";
import { Scene } from "@/components/media/Scene";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, Section, SectionHead } from "@/components/ui/Primitives";
import { promises, site } from "@/content/site";
import { getDestinations, getPackages } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "About Musafir Travels",
  description:
    "Musafir Travels designs personalised international and domestic holidays for Indian travellers. Founded by Paridhi Jaiman — how we work, what we promise, and what we will not claim.",
  canonical: "/about",
});

export default function AboutPage() {
  const destinationCount = getDestinations().length;
  const packageCount = getPackages().length;

  return (
    <>
      <section
        aria-label="About Musafir Travels"
        className="theme-sand relative isolate flex min-h-[70svh] flex-col justify-end overflow-hidden bg-background pb-14 pt-32 text-text"
      >
        <Parallax speed={0.28} className="absolute inset-0 -z-10" overscan>
          <Scene scene="mountain" seed="about-hero" className="size-full" />
        </Parallax>
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-background/85" />

        <div className="container-editorial">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]}
            className="text-muted"
          />
          <SplitText
            as="h1"
            immediate
            lines={["We don't sell packages.", "We design memories."]}
            className="mt-8 max-w-3xl text-h1 text-text-strong"
          />
          <p className="mt-7 max-w-xl text-lede text-muted">
            Crafted for those who value time, taste and trust.
          </p>
        </div>
      </section>

      <Section theme="day" ariaLabel="Who we are">
        <div className="container-prose">
          <h2 className="text-h2">Who we are</h2>
          <p className="mt-6 text-lede text-muted">
            Musafir Travels is a personalised trip-design practice, founded and run by{" "}
            {site.founder?.name}. A <em>musafir</em> is a traveller — someone passing through,
            paying attention.
          </p>
          <p className="mt-5 text-body text-muted">
            We are not a booking portal. Every itinerary on this site was built for a specific
            traveller first and published afterwards, which is why they read like plans rather than
            product listings — with the awkward parts left in, the drives timed honestly, and the
            days where nothing is scheduled marked as deliberate.
          </p>
          <p className="mt-5 text-body text-muted">
            We currently design trips to {destinationCount} destinations across Asia, Europe, the
            Middle East, Africa, Oceania and India, with {packageCount} published itineraries — all
            of which can be shortened, extended or rebuilt around your dates.
          </p>

          <h2 className="mt-16 text-h2">How we work</h2>
          <ol className="mt-8 space-y-6">
            {[
              {
                title: "You tell us the constraints",
                body: "Dates, who is coming, roughly what you want to spend, and anything that shapes the trip — an anniversary, a knee, a food requirement.",
              },
              {
                title: "We build a draft",
                body: "A real day-by-day itinerary with named hotels and actual timings, sent within one working day. Not a brochure and not a callback request.",
              },
              {
                title: "We argue about it",
                body: "This is the useful part. We will tell you when a day is too full, when a season fights the plan, and when the thing you have asked for is not worth what it costs.",
              },
              {
                title: "We book and stay reachable",
                body: "One point of contact from the first enquiry to the day you land back home, including while you are travelling.",
              },
            ].map((step, i) => (
              <li key={step.title} className="flex gap-6">
                <span className="font-[family-name:var(--font-display)] text-h2 leading-none text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-h3">{step.title}</span>
                  <span className="mt-2 block text-body text-muted">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section theme="sand" ariaLabel="What we promise">
        <div className="container-editorial">
          <Reveal variant="rise">
            <SectionHead eyebrow="Our promises" title="What you are actually buying." />
          </Reveal>
          <Reveal variant="rise" stagger as="ul" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promises.map((promise) => (
              <li key={promise.title} className="rounded-lg border border-border bg-surface p-7">
                <h3 className="text-h3">{promise.title}</h3>
                <p className="mt-3 text-body text-muted">{promise.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Being explicit about what we do NOT claim is itself a trust signal. */}
      <Section theme="day" ariaLabel="What we do not claim">
        <div className="container-prose">
          <h2 className="text-h2">What we don&rsquo;t claim</h2>
          <p className="mt-6 text-body text-muted">
            Travel sites are full of numbers nobody can verify. Here is what you will not find on
            this one, and why:
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Traveller counts and “happy customers” figures — we have no way to let you audit them.",
              "Star ratings assembled before there are enough real reviews to base one on.",
              "Tourism board or airline partner logos where there is no formal agreement behind them.",
              "Awards we have not won, and accreditations we do not hold.",
              "A live booking feed until it is genuinely wired to the booking system.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-body text-muted">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-body text-muted">
            When those things become true and verifiable, they will appear here. Until then their
            absence is deliberate.
          </p>
        </div>
      </Section>

      <Section theme="sand" ariaLabel="Contact">
        <div className="container-editorial text-center">
          <h2 className="mx-auto max-w-2xl text-h2">Talk to a trip designer.</h2>
          <p className="mx-auto mt-5 max-w-lg text-lede text-muted">
            Not a call centre — the person who will actually plan your trip.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" size="lg" arrow>
              Contact us
            </ButtonLink>
            <ButtonLink href="/plan-my-trip" variant="outline" size="lg">
              Plan my trip
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
