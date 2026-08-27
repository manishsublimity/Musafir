import { site } from "./site";

/**
 * LEGAL & POLICY CONTENT
 *
 * Written as plain, specific commitments rather than boilerplate, because these
 * pages are read at exactly two moments: before someone pays, and after
 * something has gone wrong.
 *
 * IMPORTANT: these are drafts written to be readable and internally consistent.
 * They must be reviewed by a qualified professional against the Consumer
 * Protection Act 2019, the Consumer Protection (E-Commerce) Rules 2020 and the
 * DPDP Act 2023 before the site goes live. Nothing here is legal advice.
 */

export interface PolicySection {
  heading: string;
  body: string[];
}

export interface PolicyDoc {
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
}

export const privacyPolicy: PolicyDoc = {
  title: "Privacy Policy",
  updated: "2026-06-01",
  intro:
    "This policy explains what we collect when you enquire or book, why we collect it, how long we keep it and what you can ask us to do with it.",
  sections: [
    {
      heading: "What we collect",
      body: [
        "When you submit an enquiry: your name, email address, phone number, travel dates, party size and anything you write in the notes field.",
        "When you book: additionally passport details, dates of birth and any dietary, medical or accessibility requirements you choose to share, because airlines, hotels and visa authorities require them.",
        "Automatically: standard server logs and privacy-respecting analytics about which pages are visited. We do not build advertising profiles and we do not sell data.",
      ],
    },
    {
      heading: "Why we collect it",
      body: [
        "To quote, plan and operate your trip, and to contact you about it.",
        "To submit visa applications on your behalf where you have asked us to.",
        "To meet legal and tax record-keeping obligations.",
      ],
    },
    {
      heading: "Who we share it with",
      body: [
        "Only the suppliers necessary to deliver your trip — airlines, hotels, local operators, transfer companies and insurers — and only the details each one needs.",
        "Visa authorities and their appointed application centres, where you have asked us to assist with a visa.",
        "We never sell your data, and we never share it for third-party marketing.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Enquiries that do not lead to a booking are deleted within 24 months.",
        "Booking records are retained for the period required by Indian tax and accounting law, then deleted.",
        "Passport copies are deleted once the visa or booking they were collected for is complete.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You can ask us for a copy of what we hold, ask us to correct it, or ask us to delete it. Write to ${site.email} and we will respond within 30 days.`,
        "Where deletion would conflict with a legal retention obligation, we will tell you which records we must keep and for how long.",
      ],
    },
    {
      heading: "Security",
      body: [
        "Enquiry forms are transmitted over HTTPS, rate-limited and validated server-side.",
        "Access to booking records is restricted to the team members working on your trip.",
        "If a breach affects your data we will notify you and the relevant authority as required by law.",
      ],
    },
  ],
};

export const termsAndConditions: PolicyDoc = {
  title: "Terms & Conditions",
  updated: "2026-06-01",
  intro:
    "These terms apply to every booking made with Musafir Travels. They are written to be readable — if anything is unclear, ask us before you pay.",
  sections: [
    {
      heading: "Quotations and pricing",
      body: [
        "Prices shown on this site are indicative starting points, per person on twin sharing, and are not an offer. Your final price is confirmed in writing before any payment is taken.",
        "Quotations are held for the period stated on the quotation. After that, airfares, hotel rates and exchange rates may have moved and the price may change.",
        "Where a price depends on a minimum group size, that is stated on the quotation.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "A deposit confirms your booking. The balance is due by the date stated on your confirmation.",
        "If the balance is not received by the due date we may treat the booking as cancelled and apply the cancellation charges below.",
        "Some services — certain airfares, event tickets and peak-season hotels — require full non-refundable payment at the time of booking. Where that applies it is stated on your quotation before you pay.",
      ],
    },
    {
      heading: "What is and is not included",
      body: [
        "Each package page lists its inclusions and exclusions in full. Anything not listed as included is not included.",
        "Visa fees, travel insurance and personal expenses are excluded unless explicitly stated otherwise.",
      ],
    },
    {
      heading: "Passports, visas and health",
      body: [
        "You are responsible for holding a valid passport with sufficient remaining validity, and for meeting the entry requirements of every country on your itinerary.",
        "We assist with visa applications and documentation but we do not control and cannot guarantee any visa decision. A refused visa does not create a right to a refund beyond the cancellation terms below.",
        "You are responsible for any vaccinations or health requirements applicable to your itinerary.",
      ],
    },
    {
      heading: "Travel insurance",
      body: [
        "Travel insurance is mandatory on all international bookings. We can arrange it or you may arrange your own.",
        "We strongly recommend cover that includes medical treatment, repatriation, cancellation and travel disruption.",
      ],
    },
    {
      heading: "Changes by you",
      body: [
        "Changes requested after confirmation are subject to supplier availability and to any charges the supplier levies, plus an administration fee where applicable.",
        "A change of travel dates is treated by most airlines and hotels as a cancellation and rebooking.",
      ],
    },
    {
      heading: "Changes by us",
      body: [
        "Occasionally we must change an itinerary — a hotel closes, a flight is retimed, a road is shut. Where a change is minor we will tell you and proceed. Where a change is significant you may accept it, accept an alternative, or cancel with a full refund of amounts paid to us that we can recover.",
      ],
    },
    {
      heading: "Circumstances outside our control",
      body: [
        "We are not liable for failure to perform where it results from events beyond our reasonable control, including weather, natural disaster, epidemic, strike, civil unrest, government action or airspace closure.",
        "In those circumstances we will pass on any refunds we are able to recover from suppliers, less costs already incurred.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "Musafir Travels acts as an agent in arranging transport, accommodation and activities supplied by independent third parties. Those suppliers' own terms and conditions apply to their services.",
        "Nothing in these terms limits liability for death or personal injury caused by our negligence, or for fraud.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of India and subject to the jurisdiction of the courts at Jaipur, Rajasthan.",
      ],
    },
  ],
};

export const cancellationPolicy: PolicyDoc = {
  title: "Cancellation & Refund Policy",
  updated: "2026-06-01",
  intro:
    "Cancellation charges reflect what suppliers charge us, not a penalty. The closer to departure, the more of your trip has already been paid for on your behalf.",
  sections: [
    {
      heading: "How to cancel",
      body: [
        `Cancellations must be made in writing to ${site.email}. Charges are calculated from the date we receive that written notice, not from the date of a phone call.`,
      ],
    },
    {
      heading: "Standard cancellation charges",
      body: [
        "More than 45 days before departure: loss of deposit.",
        "45 to 31 days before departure: 40% of the total trip cost.",
        "30 to 16 days before departure: 60% of the total trip cost.",
        "15 to 8 days before departure: 85% of the total trip cost.",
        "7 days or fewer before departure, or no-show: 100% of the total trip cost.",
        "These are the standard terms. Where a specific supplier imposes stricter terms — most commonly airfares, peak-season hotels and cruise bookings — those apply instead and are stated on your quotation before you pay.",
      ],
    },
    {
      heading: "Non-refundable components",
      body: [
        "Airline tickets are refundable only to the extent the airline's own fare rules permit. Many discounted fares are entirely non-refundable.",
        "Visa fees paid to a government or application centre are never refundable, including where a visa is refused.",
        "Insurance premiums are non-refundable once the policy is issued.",
      ],
    },
    {
      heading: "Refund timing",
      body: [
        "Refunds due are processed within 15 working days of our receiving the corresponding refund from suppliers. Airline refunds in particular can take considerably longer, and we will keep you informed.",
        "Refunds are made to the original payment method.",
      ],
    },
    {
      heading: "If we cancel",
      body: [
        "If we cancel your trip for any reason other than your non-payment or an event outside our control, you may take an alternative trip of equivalent value or receive a full refund of all amounts paid to us.",
      ],
    },
    {
      heading: "Visa refusals",
      body: [
        "A visa refusal is treated as a cancellation by you, and the standard charges above apply. This is why we advise against booking non-refundable components before a visa is granted, and will say so explicitly when quoting.",
      ],
    },
  ],
};
