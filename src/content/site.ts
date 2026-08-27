import type { SiteConfig } from "@/lib/types";

/**
 * Verified company facts only.
 *
 * Everything here is sourced from Musafir Travels' own published contact
 * details. Do not add awards, accreditations, traveller counts or partnership
 * claims to this file unless there is documentary evidence for them — several
 * components render these values inside schema.org markup, where an
 * unsupportable claim becomes a structured-data violation as well as a
 * trust problem.
 */
export const site: SiteConfig = {
  name: "Musafir Travels",
  legalName: "Musafir Travels by Paridhi Jaiman",
  tagline: "We don't sell packages. We design personalised memories.",
  description:
    "Musafir Travels designs personalised international and domestic holidays for Indian travellers — handpicked stays, day-by-day itineraries, visa assistance and support before, during and after the trip.",
  url: "https://www.musafirtravels.in",
  phone: "+918619098927",
  phoneDisplay: "+91 86190 98927",
  whatsapp: "918619098927",
  email: "hello@musafirtravels.in",
  address: {
    // Street address intentionally omitted until confirmed — LocalBusiness
    // schema is emitted without it rather than with a guess.
    locality: "Jaipur",
    region: "Rajasthan",
    country: "IN",
  },
  social: [
    { label: "Instagram", url: "https://www.instagram.com/musafirparidhi/" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/musafir-travels-by-paridhi-jaiman/",
    },
    { label: "YouTube", url: "https://www.youtube.com/@musafirtravelbyparidhi" },
  ],
  founder: { name: "Paridhi Jaiman", role: "Founder & Trip Designer" },
};

/** The single price-match promise the business actually publishes. */
export const promises = [
  {
    title: "Personalised itineraries",
    body: "Every journey is built around your dates, pace and interests — never pulled off a shelf.",
  },
  {
    title: "Handpicked stays",
    body: "Hotels are chosen for location and character, then matched to the category you actually want.",
  },
  {
    title: "Best price guarantee",
    body: "Find the same itinerary cheaper within 48 hours of booking and we will match it.",
  },
  {
    title: "Support before, during and after",
    body: "One point of contact from the first enquiry to the day you land back home.",
  },
  {
    title: "Visa assistance",
    body: "Document checklists, appointment guidance and form support for the countries we send you to.",
  },
  {
    title: "Transparent pricing",
    body: "Inclusions, exclusions and taxes are stated up front. No line item appears at the last minute.",
  },
];

export const navigation = {
  primary: [
    { label: "Destinations", href: "/destinations" },
    { label: "Packages", href: "/packages" },
    { label: "Experiences", href: "/experiences" },
    { label: "Honeymoon", href: "/honeymoon" },
    { label: "Visa", href: "/visa" },
    { label: "About", href: "/about" },
  ],
  footer: [
    {
      title: "Explore",
      links: [
        { label: "All destinations", href: "/destinations" },
        { label: "International holidays", href: "/international-holidays" },
        { label: "Domestic holidays", href: "/domestic-holidays" },
        { label: "Experiences", href: "/experiences" },
        { label: "Travel guides", href: "/travel-guides" },
      ],
    },
    {
      title: "Plan",
      links: [
        { label: "All packages", href: "/packages" },
        { label: "Honeymoon packages", href: "/honeymoon" },
        { label: "Visa assistance", href: "/visa" },
        { label: "Plan my trip", href: "/plan-my-trip" },
        { label: "Enquire", href: "/enquiry" },
      ],
    },
    {
      title: "Musafir",
      links: [
        { label: "About Musafir", href: "/about" },
        { label: "Why Musafir", href: "/why-musafir" },
        { label: "Traveller stories", href: "/testimonials" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy-policy" },
        { label: "Terms & conditions", href: "/terms" },
        { label: "Cancellation & refunds", href: "/cancellation-policy" },
        { label: "Visa disclaimer", href: "/visa#disclaimer" },
      ],
    },
  ],
};
