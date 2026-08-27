import type { TravelGuide } from "@/lib/types";
import { scene, seo } from "./_builder";

const author = {
  name: "Paridhi Jaiman",
  role: "Founder & Trip Designer, Musafir Travels",
  bio: "Designs personalised itineraries for Indian travellers across Asia, Europe, the Middle East and India.",
};

export const guides: TravelGuide[] = [
  {
    id: "gd-australia",
    slug: "australia-travel-guide-for-indian-travellers",
    title: "Australia for Indian travellers: what to plan around",
    destinationSlug: "australia",
    hero: scene("reef", "Coastline meeting open reef water"),
    excerpt:
      "Distances, seasons and the visa are the three things that decide whether an Australia trip works. Here is how each of them actually behaves.",
    sections: [
      {
        heading: "The country is bigger than the map suggests",
        body: "Melbourne to Cairns is roughly the distance from Delhi to Kuala Lumpur. Every additional city on an Australia itinerary costs you most of a day, so the useful question is not which cities to add but which to leave out. Below ten days, three cities is the practical ceiling — and two is often better.",
      },
      {
        heading: "Seasons run backwards",
        body: "December and January are high summer: hot, expensive and school-holiday busy. June to August is winter in the south, which is fine for cities and poor for beaches, but it is the best window for the reef, when the water is clearest. September to November and March to May are the compromise months that work reasonably everywhere.",
      },
      {
        heading: "The visa is the long pole",
        body: "The Visitor visa (subclass 600) is applied for online and decision times vary widely between applications. Six weeks is a sensible minimum and more is better in peak season. Nothing non-refundable should be booked before a grant — this is the single most common source of loss on self-planned Australia trips.",
      },
      {
        heading: "Budget honestly for food",
        body: "Accommodation and flights are the visible costs, but Australia's daily spending is what surprises Indian travellers. Budget ₹4,500–₹7,000 per person per day for meals outside inclusions, coffee, local transport and entry tickets. Supermarket breakfasts and a packed lunch on excursion days take real pressure off this.",
      },
      {
        heading: "Vegetarian and Jain food",
        body: "Melbourne, Sydney and the Gold Coast all have large Indian communities and dedicated vegetarian restaurants, so this is a non-issue in those three cities. Cairns is much smaller — for groups with strict requirements we arrange meals there in advance rather than leaving it to the day.",
      },
    ],
    author,
    publishedAt: "2026-02-14",
    updatedAt: "2026-06-02",
    readingMinutes: 6,
    faqs: [
      {
        question: "What is the cheapest month to visit Australia from India?",
        answer:
          "Typically May to early June and late August to September, outside Australian school holidays and either side of the peak summer. Fares in December and January are consistently the highest of the year.",
      },
    ],
    seo: seo(
      "Australia Travel Guide for Indian Travellers | Musafir Travels",
      "Practical Australia planning for Indian travellers — realistic distances, which season to pick, how long the subclass 600 visa actually takes and what to budget daily.",
      "/travel-guides/australia-travel-guide-for-indian-travellers",
      ["australia travel guide india", "australia visa timeline", "australia trip budget"],
    ),
  },
  {
    id: "gd-visa-free",
    slug: "visa-free-and-easy-entry-destinations-from-india",
    title: "Visa-free and easy-entry destinations from India: how to read the rules",
    hero: scene("island", "An island coastline seen from the air"),
    excerpt:
      "Visa-free is not a permanent property of a country. It is a policy, it has a date on it, and several of the popular ones have changed twice in three years.",
    sections: [
      {
        heading: "Three different things get called visa-free",
        body: "True visa-free entry means you arrive and are admitted with no application and no fee. Visa on arrival means you apply at the airport, usually with a fee and sometimes with a queue. An e-visa or ETA means you apply online in advance and cannot board without it. All three get marketed as 'visa-free' and they are materially different when you are standing at a check-in desk.",
      },
      {
        heading: "Arrangements expire",
        body: "Several of the arrangements Indian passport holders currently enjoy were introduced with an end date and have been extended more than once. That is not a reason to avoid them; it is a reason to re-check the rule in the month you book rather than relying on an article written a year ago — including this one.",
      },
      {
        heading: "Digital arrival cards are now the common trip-up",
        body: "A growing number of countries require an online arrival declaration submitted within a few days of departure, separate from any visa. It is free and takes minutes, but airlines increasingly check it at boarding. It is the most common reason travellers with correct visas still get stopped.",
      },
      {
        heading: "What immigration actually asks for",
        body: "Even with visa-free entry, the officer can ask for a confirmed return ticket, accommodation for the length of stay and evidence of funds. Carry printed copies. Refusals at this stage are uncommon but they do happen, and they are not recoverable at the counter.",
      },
    ],
    author,
    publishedAt: "2026-03-08",
    updatedAt: "2026-06-20",
    readingMinutes: 5,
    faqs: [
      {
        question: "Does visa-free entry mean I can stay as long as I like?",
        answer:
          "No. Every arrangement carries a permitted stay, commonly 30, 60 or 90 days, and overstaying carries fines and future entry bans. The permitted stay is set by the destination's immigration authority and can change independently of the visa rule itself.",
      },
    ],
    seo: seo(
      "Visa-Free & Easy-Entry Destinations from India | Musafir Travels",
      "How to read visa rules for Indian passport holders — the difference between visa-free, visa on arrival and e-visa, why arrangements expire, and the arrival-card requirement that catches people out.",
      "/travel-guides/visa-free-and-easy-entry-destinations-from-india",
      ["visa free countries for indians", "visa on arrival for indian passport", "digital arrival card"],
    ),
  },
  {
    id: "gd-honeymoon-budget",
    slug: "how-much-does-a-honeymoon-actually-cost",
    title: "How much does a honeymoon actually cost?",
    hero: scene("island", "Overwater villas on a still lagoon"),
    excerpt:
      "The headline price of a honeymoon package and the amount that leaves your account are rarely the same number. Here is where the gap usually comes from.",
    sections: [
      {
        heading: "Twin sharing is the quoted basis, and it is the right one",
        body: "Almost every package price you see is per person on twin sharing. For a couple that is straightforward — two people, one room, so the per-person price is the honest number. It only becomes confusing when comparing against solo or triple pricing.",
      },
      {
        heading: "The four costs usually sitting outside the headline",
        body: "Visa fees, travel insurance, meals beyond breakfast, and the excursions. In Switzerland the excursions alone can add more than a third to the total; in the Maldives the meal plan does. Ask any operator to quote the all-in number for your actual choices before comparing two packages.",
      },
      {
        heading: "Where the money actually changes the experience",
        body: "In the Maldives it is the villa type and the transfer. In Bali it is whether the villa pool is genuinely private. In Switzerland it is which peaks you go up. In Kerala it is a private houseboat rather than a shared one. Spending more on the hotel category while cutting these is usually the wrong trade.",
      },
      {
        heading: "Realistic all-in ranges per couple",
        body: "For seven days, all-in and including flights: Bali ₹1.7–2.6 lakh, Thailand ₹1.4–2.2 lakh, Maldives (4 nights) ₹2.6–4.4 lakh, Mauritius ₹1.9–2.8 lakh, Switzerland ₹3.6–5.2 lakh, Kerala ₹0.9–1.6 lakh. These are ranges, not quotes — dates move them substantially.",
      },
    ],
    author,
    publishedAt: "2026-01-22",
    updatedAt: "2026-05-30",
    readingMinutes: 5,
    faqs: [
      {
        question: "Is it cheaper to book flights separately?",
        answer:
          "Sometimes, and we will tell you when it is. The trade-off is that a separately booked flight is not protected if the land arrangement has to move, and rebooking then falls entirely on you.",
      },
    ],
    seo: seo(
      "How Much Does a Honeymoon Actually Cost? | Musafir Travels",
      "Realistic all-in honeymoon budgets for Bali, Thailand, Maldives, Mauritius, Switzerland and Kerala, and the four costs that usually sit outside a headline package price.",
      "/travel-guides/how-much-does-a-honeymoon-actually-cost",
      ["honeymoon package cost", "maldives honeymoon budget", "bali honeymoon cost"],
    ),
  },
  {
    id: "gd-kashmir-when",
    slug: "when-to-visit-kashmir",
    title: "When to visit Kashmir, month by month",
    destinationSlug: "kashmir",
    hero: scene("mountain", "A lake beneath snow-lined mountains"),
    excerpt:
      "Kashmir is four different holidays depending on the month. Choosing the wrong one is the most common way a good trip disappoints.",
    sections: [
      {
        heading: "March to April — tulips and blossom",
        body: "The Indira Gandhi Memorial Tulip Garden opens for roughly three weeks, usually late March into mid-April, and the almond blossom is out at the same time. Gulmarg still has snow at the upper gondola. This is the best short window in the year and it books out early.",
      },
      {
        heading: "May to June — the meadows",
        body: "The valley at its greenest, all roads open, and Sonmarg and Pahalgam at their best. It is also peak family-holiday season, so hotels are at their most expensive and Gulmarg gondola queues are longest.",
      },
      {
        heading: "September to October — chinar",
        body: "The quietest good month. Chinar leaves turn through October, the light is exceptional for photographs, and prices drop from the summer peak. Bring layers — evenings are already cold.",
      },
      {
        heading: "December to February — snow",
        body: "Reliable snow in Gulmarg from late December, skiing from January, and Srinagar under frost. Some higher roads close and Sonmarg is usually inaccessible. This is the only window in which we will discuss snow with any confidence.",
      },
      {
        heading: "The months to think twice about",
        body: "July and August bring the monsoon's edge — not heavy by Indian standards, but enough to close mountain views for days at a time. November is between seasons: past the colour, before the snow.",
      },
    ],
    author,
    publishedAt: "2025-11-30",
    updatedAt: "2026-04-18",
    readingMinutes: 4,
    faqs: [
      {
        question: "Which month has the best chance of snow in Gulmarg?",
        answer:
          "Mid-January to mid-February is the most reliable window at the upper gondola phase. Late December usually has snow but is less certain, and by March the lower slopes are typically clear.",
      },
    ],
    seo: seo(
      "When to Visit Kashmir — A Month-by-Month Guide | Musafir Travels",
      "Kashmir month by month — tulip season, the summer meadows, chinar colour in October and the reliable snow window in Gulmarg, with the months worth avoiding.",
      "/travel-guides/when-to-visit-kashmir",
      ["best time to visit kashmir", "kashmir tulip garden dates", "gulmarg snow season"],
    ),
  },
];
