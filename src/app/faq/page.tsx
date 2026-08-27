import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, JsonLd, Section, SectionHead } from "@/components/ui/Primitives";
import { FaqList } from "@/components/content/ContentBlocks";
import { faqSchema, metadataFrom } from "@/lib/seo";
import { site } from "@/content/site";
import type { Faq } from "@/lib/types";

export const metadata: Metadata = metadataFrom({
  title: "Frequently Asked Questions | Musafir Travels",
  description:
    "How booking with Musafir Travels works — quotes, payment, visas, insurance, changes, cancellations and what happens if something goes wrong while you are away.",
  canonical: "/faq",
});

const GROUPS: { heading: string; faqs: Faq[] }[] = [
  {
    heading: "Planning and quotes",
    faqs: [
      {
        question: "How long does it take to get an itinerary?",
        answer:
          "One working day for a first draft in almost all cases. That draft is a real day-by-day plan with named hotels and actual timings, not a brochure — because the useful conversation only starts once there is something specific to argue about.",
      },
      {
        question: "Do you charge for planning?",
        answer:
          "No. Planning, quoting and revisions are free, and there is no obligation to book. We only earn once you travel with us.",
      },
      {
        question: "Are the prices on the site the price I will pay?",
        answer:
          "They are indicative starting points, per person on twin sharing. Your actual price depends on your dates, your departure city, airline fares and hotel availability on the day we book. We confirm the final figure in writing before taking any payment.",
      },
      {
        question: "Can I change an itinerary you have published?",
        answer:
          "Yes — every itinerary on this site started as a custom trip. Shortening, extending, changing cities or swapping hotels are all normal requests, not exceptions.",
      },
    ],
  },
  {
    heading: "Booking and payment",
    faqs: [
      {
        question: "How much deposit do you take?",
        answer:
          "It depends on what needs booking immediately. Where airfares or peak-season hotels must be paid in full at the time of booking, we tell you that before you pay rather than after.",
      },
      {
        question: "When is the balance due?",
        answer:
          "By the date stated on your confirmation, which is typically a few weeks before departure. If the balance is not received by then we may have to release supplier holds, and cancellation charges can apply.",
      },
      {
        question: "Is travel insurance included?",
        answer:
          "No, and it is excluded from every package price on this site. It is mandatory on international bookings — we can arrange it or you can bring your own, but you will not travel with us uninsured.",
      },
    ],
  },
  {
    heading: "Visas and documents",
    faqs: [
      {
        question: "Do you guarantee a visa?",
        answer:
          "No, and nobody honestly can. We prepare documents, review your application and guide you through appointments, but the decision belongs entirely to the issuing authority. This is why we advise against booking non-refundable travel before a visa is granted.",
      },
      {
        question: "What happens if my visa is refused?",
        answer:
          "A refusal is treated as a cancellation by you, and the standard cancellation charges apply. Visa fees paid to a government or application centre are never recoverable. We will always flag which parts of a booking are at risk before you commit.",
      },
      {
        question: "How far ahead should I apply?",
        answer:
          "For Schengen visas, around three months — appointment slots, not processing, are the bottleneck in summer. For Australia, at least six weeks. For e-visas such as Vietnam or the UAE, one to two weeks is usually enough.",
      },
    ],
  },
  {
    heading: "While you are travelling",
    faqs: [
      {
        question: "What support do I have on the trip?",
        answer:
          "A direct contact who knows your booking, reachable throughout your trip — not a general helpline. For anything urgent while abroad, call rather than email.",
      },
      {
        question: "What if a tour is cancelled for weather?",
        answer:
          "Weather-dependent activities like reef trips and mountain excursions are cancelled by operators rather than run unsafely, and are refunded or rescheduled. Where an experience is the point of the trip, we deliberately build in a spare day so a cancellation is a delay rather than a loss.",
      },
      {
        question: "What if something goes wrong with a hotel or supplier?",
        answer:
          "Call us first. We hold the booking relationship and can usually resolve it faster than you can at the desk. If a supplier fails to deliver what was booked, we pursue it on your behalf.",
      },
    ],
  },
];

export default function FaqPage() {
  const all = GROUPS.flatMap((g) => g.faqs);

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <JsonLd data={faqSchema(all)} />
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "FAQ", href: "/faq" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">Questions, answered properly.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          Including the ones with answers you might not want — those are usually the useful ones.
        </p>
      </div>

      {GROUPS.map((group, i) => (
        <Section
          key={group.heading}
          theme={i % 2 === 0 ? "day" : "sand"}
          ariaLabel={group.heading}
          padded={false}
          className="py-[clamp(3rem,6vw,5rem)]"
        >
          <div className="container-editorial">
            <SectionHead eyebrow={`0${i + 1}`} title={group.heading} />
            <div className="mt-10">
              <FaqList faqs={group.faqs} />
            </div>
          </div>
        </Section>
      ))}

      <Section theme="sand" ariaLabel="Still have a question">
        <div className="container-editorial text-center">
          <h2 className="mx-auto max-w-2xl text-h2">Still have a question?</h2>
          <p className="mx-auto mt-5 max-w-lg text-lede text-muted">
            Ask us directly — {site.phoneDisplay}, or send it over and we will reply within a
            working day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" size="lg" arrow>
              Ask us
            </ButtonLink>
            <ButtonLink href="/plan-my-trip" variant="outline" size="lg">
              Plan my trip
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
