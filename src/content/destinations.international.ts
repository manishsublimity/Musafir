import type { Destination } from "@/lib/types";
import { destination, inr, scene, seo } from "./_builder";

/**
 * Visa records carry `lastVerified` and an official source. The UI renders both
 * and flags anything older than 90 days for re-verification — visa rules move,
 * and a stale rule shown as fact is worse than no rule at all.
 */
const VERIFIED = "2026-05-01";

export const internationalDestinations: Destination[] = [
  destination({
    id: "dst-australia",
    slug: "australia",
    name: "Australia",
    country: "Australia",
    region: "oceania",
    domestic: false,
    tagline: "Made for the curious.",
    intro:
      "Australia rewards travellers who want range in a single trip: a coffee-obsessed arts city, a harbour that stops you mid-sentence, a coastline you drive slowly on purpose, and a reef you can be swimming over by mid-morning. Distances are real, so the trick is fewer cities and longer stays. Most Indian travellers fly overnight from Delhi, Mumbai or Bengaluru with one stop.",
    hero: scene("reef", "The Australian coastline meeting open reef water"),
    gallery: [
      scene("city", "Sydney's harbour skyline at dusk"),
      scene("beach", "The Great Ocean Road coastline"),
      scene("reef", "Shallow reef flats off the Queensland coast"),
    ],
    stats: [
      { label: "Ideal duration", value: "10–14 days", numeric: 12, suffix: " days" },
      { label: "Best season", value: "Sep – Nov, Mar – May" },
      { label: "From", value: "₹1,45,000", numeric: 145000, prefix: "₹" },
      { label: "Trip styles", value: "Family · Couple · Adventure" },
    ],
    idealDurationDays: [10, 14],
    startingPrice: inr(145000),
    bestMonths: ["mar", "apr", "may", "sep", "oct", "nov"],
    styles: ["family", "couple", "adventure", "friends", "luxury"],
    cities: [
      { name: "Melbourne", slug: "melbourne", point: { x: 46, y: 82 }, nights: 4, blurb: "Laneway coffee, street art and the Great Ocean Road on its doorstep." },
      { name: "Sydney", slug: "sydney", point: { x: 62, y: 71 }, nights: 4, blurb: "Harbour, headland walks and the Blue Mountains an hour inland." },
      { name: "Gold Coast", slug: "gold-coast", point: { x: 68, y: 56 }, nights: 3, blurb: "Surf beaches and theme parks — the easiest stop with children." },
      { name: "Cairns", slug: "cairns", point: { x: 60, y: 26 }, nights: 3, blurb: "Base for the Great Barrier Reef and the Daintree rainforest." },
    ],
    highlights: [
      "Snorkelling the Great Barrier Reef from Cairns",
      "Driving the Great Ocean Road to the Twelve Apostles",
      "Sydney Harbour by ferry at golden hour",
      "Kuranda Scenic Railway through the rainforest",
      "Blue Mountains and the Three Sisters lookout",
    ],
    whyPoints: [
      {
        title: "Four completely different trips in one country",
        body: "Melbourne is a European-feeling arts city, Sydney is a harbour city, the Gold Coast is a beach holiday and Cairns is a tropical reef base. You never repeat a day.",
      },
      {
        title: "It works for mixed groups",
        body: "Theme parks and reef pontoons keep children busy while the same trip carries wineries, coastal walks and fine dining for the adults.",
      },
      {
        title: "Genuinely easy to travel",
        body: "English everywhere, clean domestic flights between cities, reliable public transport and vegetarian and Jain food widely available in all four cities.",
      },
      {
        title: "The reef is best reached from Cairns",
        body: "Day boats from Cairns reach the outer reef in around 90 minutes, so non-swimmers can still see it from a semi-submersible or a glass-bottom boat.",
      },
    ],
    experiences: [
      "great-barrier-reef",
      "great-ocean-road",
      "sydney-harbour-cruise",
      "blue-mountains",
    ],
    travelTips: [
      "Seasons are inverted — December is high summer and July is winter.",
      "Domestic flights between Melbourne, Sydney, the Gold Coast and Cairns are short but must be booked with the package; walk-up fares are steep.",
      "Reef day trips are weather-dependent. Keep a spare day in Cairns so a cancelled boat is not a lost experience.",
      "The Great Ocean Road is a long day from Melbourne — leave by 7am and treat it as a full-day excursion, not a half day.",
      "Carry an Australian power adapter (Type I); Indian plugs do not fit.",
    ],
    howToReach:
      "There are no non-stop flights from India to Australia on most routes. Expect one stop — usually Singapore, Kuala Lumpur, Bangkok or a Gulf hub — with total journey times of 14–18 hours to Melbourne or Sydney. Domestic legs between the four cities run 1–3 hours.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹1,45,000 – ₹1,85,000 per person", note: "12–13 days, twin sharing, flights and transfers included." },
      { label: "Premium 5-star", range: "₹2,10,000 – ₹2,80,000 per person", note: "Harbour-view and beachfront stays, private transfers." },
      { label: "Daily spending", range: "₹4,500 – ₹7,000 per person", note: "Meals outside inclusions, coffee, local transport and entry tickets." },
    ],
    visa: {
      passport: "IN",
      entryType: "e-visa",
      stayDays: 90,
      processingTime: "Typically 2–4 weeks; apply at least 6 weeks ahead",
      fee: "varies",
      documents: [
        "Passport valid at least 6 months beyond travel",
        "Recent photograph meeting Australian specifications",
        "Bank statements for the last 6 months",
        "Income tax returns for the last 2–3 years",
        "Confirmed return flights and accommodation",
        "Employment or business proof",
      ],
      notes:
        "Indian passport holders need a Visitor visa (subclass 600) applied for online before travel. Decision times vary considerably by application — never book non-refundable travel before the grant.",
      lastVerified: VERIFIED,
      sourceName: "Australian Department of Home Affairs",
      sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    },
    answers: [
      {
        question: "How many days do you need in Australia?",
        answer:
          "Ten to fourteen days is the realistic minimum for a first trip covering Melbourne, Sydney and Cairns. Anything under ten days means either dropping a city or spending most of the trip in transit.",
        detail:
          "A common split is 4 nights Melbourne, 4 nights Sydney, 3 nights Gold Coast and 3 nights Cairns, with internal flights between each.",
      },
      {
        question: "What does an Australia trip cost from India?",
        answer:
          "A 12–13 day Australia package for Indian travellers typically starts around ₹1,45,000 per person on twin sharing with 4-star hotels, international and domestic flights, transfers and daily breakfast.",
        detail: "Premium 5-star itineraries with harbour-view stays run ₹2,10,000 and upward per person.",
      },
      {
        question: "When is the best time to visit Australia?",
        answer:
          "September to November and March to May give the most comfortable weather across all four cities. Cairns and the reef are best from May to October, when the water is clearest and stinger season has passed.",
      },
      {
        question: "Do Indians need a visa for Australia?",
        answer:
          "Yes. Indian passport holders must obtain a Visitor visa (subclass 600) online before travelling. Processing commonly takes two to four weeks, so apply at least six weeks before departure.",
      },
    ],
    faqs: [
      {
        question: "Is Australia suitable for a family with young children?",
        answer:
          "Yes, and it is one of the easier long-haul destinations for families. Gold Coast theme parks, the Melbourne Zoo, Sydney's harbour ferries and reef pontoons with shallow lagoons all work well for children aged five and up. The main constraint is the flight — an overnight sector each way with one stop.",
      },
      {
        question: "Can I see the Great Barrier Reef without knowing how to swim?",
        answer:
          "Yes. Outer-reef pontoons run semi-submersible boats and glass-bottom tours, and provide flotation vests and guided snorkel lines for people who are not confident in water. Tell us when you book so we place you on an operator that runs these.",
      },
      {
        question: "Is vegetarian and Jain food available?",
        answer:
          "Widely in Melbourne, Sydney and the Gold Coast, which all have large Indian communities and dedicated vegetarian restaurants. Cairns is smaller — we pre-arrange meals there for groups with strict requirements.",
      },
      {
        question: "How much cash should I carry?",
        answer:
          "Very little. Australia is close to cashless; cards work almost everywhere including taxis and small cafés. Carry a forex card and around AUD 200 in cash for markets and tips.",
      },
    ],
    seo: seo(
      "Australia Tour Packages from India | Musafir Travels",
      "Personalised Australia holiday packages covering Melbourne, Sydney, Gold Coast and Cairns. Great Barrier Reef, Great Ocean Road and Blue Mountains, with visa assistance and day-by-day itineraries.",
      "/destinations/australia",
      ["australia tour package from india", "australia trip cost", "great barrier reef package"],
    ),
    weight: 88,
  }),

  destination({
    id: "dst-bali",
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "asia",
    domestic: false,
    tagline: "Green in every direction.",
    intro:
      "Bali splits cleanly into two halves — the rice-terrace and temple interior around Ubud, and the beach and sunset strip in the south. The mistake most first-timers make is basing themselves in one place and driving daily; the island is small on a map and slow in reality. Split your nights and Bali becomes two trips instead of one long commute.",
    hero: { ...scene("forest", "Terraced rice fields falling away into a valley"), src: "/images/bali.jpg" },
    gallery: [
      scene("forest", "Rice terraces in the Ubud highlands"),
      scene("beach", "A south Bali beach at sunset"),
      scene("island", "Offshore islands seen from the Bali coast"),
    ],
    stats: [
      { label: "Ideal duration", value: "6–8 days", numeric: 7, suffix: " days" },
      { label: "Best season", value: "Apr – Oct" },
      { label: "From", value: "₹48,000", numeric: 48000, prefix: "₹" },
      { label: "Trip styles", value: "Honeymoon · Friends · Family" },
    ],
    idealDurationDays: [6, 8],
    startingPrice: inr(48000),
    bestMonths: ["apr", "may", "jun", "jul", "aug", "sep", "oct"],
    styles: ["honeymoon", "couple", "friends", "family", "beach", "luxury"],
    cities: [
      { name: "Ubud", slug: "ubud", point: { x: 48, y: 40 }, nights: 3, blurb: "Rice terraces, temples and the island's best spa and yoga culture." },
      { name: "Seminyak", slug: "seminyak", point: { x: 32, y: 66 }, nights: 2, blurb: "Beach clubs, restaurants and the flattest sunset beach in the south." },
      { name: "Nusa Dua", slug: "nusa-dua", point: { x: 44, y: 82 }, nights: 2, blurb: "Calm, protected water — the easiest base with children or non-swimmers." },
    ],
    highlights: [
      "Tegalalang rice terraces early, before the coaches",
      "Uluwatu temple at sunset with the Kecak performance",
      "A day trip to Nusa Penida's cliffs and Kelingking beach",
      "Balinese cooking class in a village kitchen",
      "Tirta Empul water temple",
    ],
    whyPoints: [
      {
        title: "Two very different halves in one island",
        body: "Ubud's valleys and Seminyak's beaches feel like separate holidays. Splitting nights between them is what turns a good Bali trip into a memorable one.",
      },
      {
        title: "It stretches a honeymoon budget further than anywhere else",
        body: "Private-pool villas that would cost several times as much in the Maldives are routine in Bali, which is why it remains the most-booked honeymoon we design.",
      },
      {
        title: "Genuinely easy from India",
        body: "Short flights via Singapore, Kuala Lumpur or Bangkok, visa on arrival, and Indian food available across the south.",
      },
    ],
    experiences: ["nusa-penida-day-trip", "uluwatu-kecak-sunset", "balinese-cooking-class"],
    travelTips: [
      "Traffic in the south is heavy — an Ubud-to-Seminyak transfer can take 90 minutes despite the short distance.",
      "Carry cash for markets and warungs; card acceptance drops away outside hotels and larger restaurants.",
      "Many temples require a sarong; most sites lend one, but bringing your own is easier.",
      "Book Nusa Penida as an organised day trip — the fast-boat crossing and island roads are not worth self-driving.",
      "The dry season, April to October, is markedly better for beaches and boat crossings.",
    ],
    howToReach:
      "One-stop flights from Delhi, Mumbai, Bengaluru, Chennai and Hyderabad to Denpasar (DPS) via Singapore, Kuala Lumpur or Bangkok, typically 9–12 hours total. Direct seasonal services operate on some routes.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹48,000 – ₹68,000 per person", note: "6 nights, twin sharing, flights, transfers and breakfast." },
      { label: "Private-pool villa", range: "₹85,000 – ₹1,30,000 per person", note: "Honeymoon villas in Ubud and Seminyak." },
      { label: "Daily spending", range: "₹2,000 – ₹4,000 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "visa-on-arrival",
      stayDays: 30,
      processingTime: "On arrival, or online in advance as an e-VOA",
      fee: "varies",
      documents: [
        "Passport valid at least 6 months beyond arrival",
        "Confirmed return or onward ticket",
        "Proof of accommodation",
      ],
      notes:
        "Indian passport holders are eligible for visa on arrival in Indonesia, extendable once for a further 30 days. An electronic version can be obtained before departure to skip the arrival queue.",
      lastVerified: VERIFIED,
      sourceName: "Directorate General of Immigration, Republic of Indonesia",
      sourceUrl: "https://evisa.imigrasi.go.id/",
    },
    answers: [
      {
        question: "How many days are enough for Bali?",
        answer:
          "Six to eight days. That allows three nights inland around Ubud and three or four on the coast, with one day trip, without spending the holiday in a car.",
      },
      {
        question: "What does a Bali trip cost from India?",
        answer:
          "A 6-night Bali package typically starts around ₹48,000 per person on twin sharing with 4-star hotels, return flights, airport and inter-area transfers and daily breakfast.",
        detail: "Private-pool villa honeymoon itineraries begin around ₹85,000 per person.",
      },
      {
        question: "When is the best time to visit Bali?",
        answer:
          "April to October is the dry season and the most reliable window for beaches, sunsets and boat crossings to Nusa Penida. January and February are the wettest months.",
      },
      {
        question: "Do Indians need a visa for Bali?",
        answer:
          "Indian passport holders receive a visa on arrival in Indonesia valid for 30 days, extendable once. It can also be bought online in advance as an e-VOA to skip the airport queue.",
      },
    ],
    faqs: [
      {
        question: "Is Bali good for a honeymoon?",
        answer:
          "It is the destination we design the most honeymoons for. Private-pool villas, floating breakfasts, a candlelit dinner on the sand at Jimbaran and a spa day are all achievable inside a mid-range budget, which is rarely true elsewhere.",
      },
      {
        question: "Should I stay in Ubud or by the beach?",
        answer:
          "Both. Three nights in Ubud for the valleys, temples and spa culture, then three on the coast. Staying only in the south means long daily drives inland; staying only in Ubud means no beach.",
      },
      {
        question: "Is Bali safe for a solo female traveller?",
        answer:
          "Broadly yes, and it is a common solo destination. The usual precautions apply: use hotel-arranged transport at night, avoid unlicensed scooter rentals, and be cautious with strong currents at unpatrolled beaches.",
      },
    ],
    seo: seo(
      "Bali Tour Packages from India | Musafir Travels",
      "Personalised Bali holiday and honeymoon packages with Ubud rice terraces, Seminyak beaches, Nusa Penida day trips and private-pool villas. Visa on arrival guidance included.",
      "/destinations/bali",
      ["bali package from india", "bali honeymoon package", "bali trip cost"],
    ),
    weight: 95,
  }),

  destination({
    id: "dst-maldives",
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "asia",
    domestic: false,
    tagline: "Where the horizon does all the work.",
    intro:
      "The Maldives is a single decision made well: which island. Everything else — the water, the light, the quiet — comes with it. Resorts are private islands, so your transfer type, meal plan and villa category matter far more than the sightseeing list, because there is no sightseeing list. That is the point.",
    hero: { ...scene("island", "An atoll island ringed by shallow turquoise water"), src: "/images/maldives-overwater.jpg" },
    gallery: [
      scene("island", "Overwater villas on a Maldivian atoll"),
      scene("reef", "Coral reef in clear shallow water"),
    ],
    stats: [
      { label: "Ideal duration", value: "4–6 days", numeric: 5, suffix: " days" },
      { label: "Best season", value: "Nov – Apr" },
      { label: "From", value: "₹72,000", numeric: 72000, prefix: "₹" },
      { label: "Trip styles", value: "Honeymoon · Luxury" },
    ],
    idealDurationDays: [4, 6],
    startingPrice: inr(72000),
    bestMonths: ["nov", "dec", "jan", "feb", "mar", "apr"],
    styles: ["honeymoon", "couple", "luxury", "beach"],
    cities: [
      { name: "Malé", slug: "male", point: { x: 50, y: 46 }, nights: 0, blurb: "Arrival point and transfer hub." },
      { name: "North Malé Atoll", slug: "north-male-atoll", point: { x: 46, y: 34 }, nights: 3, blurb: "Speedboat-reachable resorts, the best value for short trips." },
      { name: "Baa Atoll", slug: "baa-atoll", point: { x: 34, y: 24 }, nights: 3, blurb: "UNESCO biosphere reserve; manta season June to November." },
    ],
    highlights: [
      "Snorkelling straight off the house reef",
      "A sandbank picnic with nobody else on it",
      "Sunset dolphin cruise",
      "Overwater villa with direct lagoon access",
      "Night fishing with the resort crew",
    ],
    whyPoints: [
      {
        title: "The shortest possible long-haul feeling",
        body: "Direct flights from several Indian cities put you on a resort island by lunchtime. No other destination this restful is this close.",
      },
      {
        title: "Choosing the island is the whole trip",
        body: "House reef quality, transfer time and meal plan decide whether the holiday feels effortless or expensive. This is the part we spend the most time on with you.",
      },
      {
        title: "It suits very short leave",
        body: "Four or five days genuinely works here, which is rarely true of a long-haul beach holiday.",
      },
    ],
    experiences: ["maldives-house-reef-snorkel", "sandbank-picnic"],
    travelTips: [
      "Seaplane transfers only operate in daylight — a late arrival into Malé can mean an unplanned overnight in the capital.",
      "Half board is usually poor value on remote islands; compare full board and all-inclusive before deciding.",
      "Alcohol is only served on resort islands, not on inhabited local islands.",
      "A resort with a strong house reef saves you paying for every excursion.",
      "Take reef-safe sunscreen; several resorts now require it.",
    ],
    howToReach:
      "Direct flights to Malé (MLE) from Delhi, Mumbai, Bengaluru, Chennai, Kochi and Thiruvananthapuram, typically 2.5–4.5 hours. Resort transfer follows by speedboat (20–60 minutes) or seaplane (25–45 minutes).",
    budgetGuide: [
      { label: "Beach villa, speedboat transfer", range: "₹72,000 – ₹1,10,000 per person", note: "4 nights, twin sharing, flights, transfers and half board." },
      { label: "Overwater villa", range: "₹1,30,000 – ₹2,20,000 per person" },
      { label: "Seaplane resorts", range: "Add ₹35,000 – ₹55,000 per person for transfers" },
    ],
    visa: {
      passport: "IN",
      entryType: "visa-free",
      stayDays: 30,
      documents: [
        "Passport valid at least 1 month beyond arrival",
        "Confirmed accommodation booking",
        "Return or onward ticket",
        "Completed Traveller Declaration submitted online before arrival",
      ],
      notes:
        "A free 30-day visa on arrival is granted to all nationalities including Indian passport holders, subject to confirmed accommodation and onward travel. The online Traveller Declaration must be submitted within 96 hours of departure.",
      lastVerified: VERIFIED,
      sourceName: "Maldives Immigration",
      sourceUrl: "https://www.immigration.gov.mv/",
    },
    answers: [
      {
        question: "How many days should you spend in the Maldives?",
        answer:
          "Four to six days. Because the whole holiday happens on one island, five nights is usually the point at which the rhythm settles without becoming repetitive.",
      },
      {
        question: "What does a Maldives trip cost from India?",
        answer:
          "A 4-night Maldives package typically starts around ₹72,000 per person on twin sharing in a beach villa with speedboat transfers, return flights and half board. Overwater villas start closer to ₹1,30,000 per person.",
      },
      {
        question: "When is the best time to visit the Maldives?",
        answer:
          "November to April is the dry season with the calmest seas and clearest water. June to November brings more rain but is the best window for manta and whale-shark sightings in Baa Atoll.",
      },
      {
        question: "Do Indians need a visa for the Maldives?",
        answer:
          "No advance visa is required. Indian passport holders receive a free 30-day visa on arrival, provided they have confirmed accommodation, an onward ticket and have submitted the online Traveller Declaration.",
      },
    ],
    faqs: [
      {
        question: "Speedboat or seaplane — which should I choose?",
        answer:
          "Speedboat resorts are cheaper, run at any hour and suit short trips. Seaplanes reach the more remote, quieter atolls and are a spectacular flight, but they only fly in daylight and add substantially to the cost. For a four-night trip we usually recommend a speedboat island.",
      },
      {
        question: "Is the Maldives worth it with children?",
        answer:
          "Yes, if you pick a resort with a shallow lagoon, a kids' club and a beach villa rather than an overwater one — overwater decks with open ladders are a poor fit for young children.",
      },
    ],
    seo: seo(
      "Maldives Packages from India | Musafir Travels",
      "Maldives honeymoon and holiday packages with beach and overwater villas, speedboat or seaplane transfers and meal plans chosen around your budget.",
      "/destinations/maldives",
      ["maldives package from india", "maldives honeymoon package", "maldives trip cost"],
    ),
    weight: 92,
  }),

  destination({
    id: "dst-dubai",
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "middle-east",
    domestic: false,
    tagline: "Built fast, best taken slowly.",
    intro:
      "Dubai is the most efficient short international holiday available from India: a four-hour flight, no jet lag, and enough range in five days to cover a desert night, a skyline day and an old-city afternoon. It rewards planning — the difference between a good Dubai trip and an exhausting one is almost entirely about how you sequence the heat.",
    hero: { ...scene("city", "The Dubai skyline at dusk seen across water"), src: "/images/dubai.jpg" },
    gallery: [
      scene("city", "Downtown Dubai towers at blue hour"),
      scene("desert", "Dune ridges in the Dubai desert at sunset"),
    ],
    stats: [
      { label: "Ideal duration", value: "4–6 days", numeric: 5, suffix: " days" },
      { label: "Best season", value: "Nov – Mar" },
      { label: "From", value: "₹39,999", numeric: 39999, prefix: "₹" },
      { label: "Trip styles", value: "Family · Friends · Couple" },
    ],
    idealDurationDays: [4, 6],
    startingPrice: inr(39999),
    bestMonths: ["nov", "dec", "jan", "feb", "mar"],
    styles: ["family", "friends", "couple", "luxury", "weekend", "senior-friendly"],
    cities: [
      { name: "Downtown Dubai", slug: "downtown-dubai", point: { x: 50, y: 52 }, nights: 3, blurb: "Burj Khalifa, Dubai Mall and the fountain — the easiest base." },
      { name: "Dubai Marina", slug: "dubai-marina", point: { x: 34, y: 62 }, nights: 2, blurb: "Waterfront dining, the beach and the cruise dock." },
      { name: "Abu Dhabi", slug: "abu-dhabi", point: { x: 18, y: 74 }, nights: 1, blurb: "Sheikh Zayed Grand Mosque and Louvre Abu Dhabi, an easy day trip." },
    ],
    highlights: [
      "Burj Khalifa At The Top at sunset",
      "Evening desert safari with a dune drive and dinner",
      "Dhow or catamaran cruise at Dubai Marina",
      "Abu Dhabi day trip for the Grand Mosque",
      "Old Dubai — Al Fahidi, the souks and an abra across the creek",
    ],
    whyPoints: [
      {
        title: "The most time-efficient international trip from India",
        body: "Four hours in the air, no time-zone adjustment, and you land into a city built for visitors. Ideal for a short leave window.",
      },
      {
        title: "It genuinely works across generations",
        body: "Grandparents, children and teenagers can all have a good day in Dubai without splitting the group — few destinations manage that.",
      },
      {
        title: "Indian travellers are unusually well served",
        body: "Vegetarian and Jain food is everywhere, many hotel staff speak Hindi, and the Indian rupee goes further on shopping than most assume.",
      },
    ],
    experiences: ["desert-safari-dubai", "burj-khalifa-at-the-top", "marina-dhow-cruise"],
    travelTips: [
      "Plan indoor attractions for midday and outdoor ones for after 4pm, even in winter.",
      "The Dubai Metro is clean, cheap and reaches most attractions — do not assume you need a car every day.",
      "Dress modestly at the Grand Mosque in Abu Dhabi; abayas are lent free at the entrance.",
      "Book Burj Khalifa timed tickets in advance for the sunset slot — it sells out first.",
      "Friday brunches and beach clubs need reservations, particularly in winter.",
    ],
    howToReach:
      "Non-stop flights to Dubai (DXB) from more than a dozen Indian cities, typically 3–4.5 hours. Abu Dhabi (AUH) is a 90-minute road transfer from Dubai.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹39,999 – ₹62,000 per person", note: "5 days / 4 nights, twin sharing, flights, transfers, breakfast and two tours." },
      { label: "5-star / beachfront", range: "₹75,000 – ₹1,20,000 per person" },
      { label: "Daily spending", range: "₹3,000 – ₹6,000 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "e-visa",
      stayDays: 30,
      processingTime: "3–5 working days for a standard tourist visa",
      fee: "varies",
      documents: [
        "Passport valid at least 6 months beyond travel",
        "Passport-size photograph on a white background",
        "Confirmed return tickets and hotel booking",
      ],
      notes:
        "Most Indian passport holders need a UAE tourist visa arranged before travel, which Musafir processes as part of the package. Indian nationals holding a valid US visa, US green card or UK/EU residence permit may be eligible for a visa on arrival — eligibility must be confirmed against the official rules for your specific document.",
      lastVerified: VERIFIED,
      sourceName: "UAE Government Portal — Entry permits and visas",
      sourceUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id",
    },
    answers: [
      {
        question: "How many days are enough for Dubai?",
        answer:
          "Four to six days. Five days comfortably covers the Burj Khalifa, a desert safari, a marina cruise, Old Dubai and a day trip to Abu Dhabi without rushing.",
      },
      {
        question: "What does a Dubai package cost from India?",
        answer:
          "A 5-day, 4-night Dubai package typically starts around ₹39,999 per person on twin sharing with 4-star hotels, return flights, transfers, daily breakfast and two included tours.",
      },
      {
        question: "When is the best time to visit Dubai?",
        answer:
          "November to March. Daytime temperatures sit in the twenties, outdoor dining and beaches are pleasant, and desert safaris are comfortable. June to August is extremely hot and best avoided for a first visit.",
      },
      {
        question: "Do Indians need a visa for Dubai?",
        answer:
          "Most Indian passport holders need a UAE tourist visa arranged before departure, usually processed in three to five working days. Holders of certain valid US, UK or EU documents may qualify for a visa on arrival — this must be checked against the official rules for the exact document held.",
      },
    ],
    faqs: [
      {
        question: "Is a desert safari suitable for elderly travellers?",
        answer:
          "The dune-bashing portion is not, but almost every operator offers a no-dune-drive option that goes straight to the desert camp for dinner and the show. Tell us at booking and we will arrange that version.",
      },
      {
        question: "Is Dubai expensive?",
        answer:
          "Accommodation and attractions are, but food and transport need not be. Metro travel, food-court and cafeteria meals in the older districts, and free attractions like the fountain show and the beach keep daily spending modest.",
      },
      {
        question: "Can I visit Abu Dhabi on the same trip?",
        answer:
          "Yes — it is a standard full-day excursion from Dubai covering the Sheikh Zayed Grand Mosque and usually Louvre Abu Dhabi or Ferrari World. No separate visa is needed; it is the same country.",
      },
    ],
    seo: seo(
      "Dubai Tour Packages from India | Musafir Travels",
      "Dubai holiday packages with Burj Khalifa, desert safari, marina cruise and Abu Dhabi day trips. Flights, hotels, transfers and UAE visa assistance included.",
      "/destinations/dubai",
      ["dubai package from india", "dubai tour package price", "dubai visa for indians"],
    ),
    weight: 90,
  }),

  destination({
    id: "dst-thailand",
    slug: "thailand",
    name: "Thailand",
    country: "Thailand",
    region: "asia",
    domestic: false,
    tagline: "Loud city, quiet islands.",
    intro:
      "Thailand works best as a contrast trip: two or three nights of Bangkok's noise, markets and temples, then a flight south to water that goes pale green over sand. It is the easiest first international holiday for most Indian travellers — short flights, low costs, and a tourism industry that has been getting this right for forty years.",
    hero: scene("island", "Limestone karsts rising out of shallow green water"),
    gallery: [
      scene("city", "Bangkok's river and skyline at night"),
      scene("island", "Longtail boats moored off a Krabi beach"),
    ],
    stats: [
      { label: "Ideal duration", value: "5–8 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Nov – Mar" },
      { label: "From", value: "₹42,000", numeric: 42000, prefix: "₹" },
      { label: "Trip styles", value: "Friends · Couple · Family" },
    ],
    idealDurationDays: [5, 8],
    startingPrice: inr(42000),
    bestMonths: ["nov", "dec", "jan", "feb", "mar"],
    styles: ["friends", "couple", "family", "beach", "honeymoon", "weekend"],
    cities: [
      { name: "Bangkok", slug: "bangkok", point: { x: 46, y: 34 }, nights: 3, blurb: "Grand Palace, river markets and the best street food in Asia." },
      { name: "Phuket", slug: "phuket", point: { x: 34, y: 74 }, nights: 3, blurb: "Island-hopping base for Phi Phi and James Bond Island." },
      { name: "Krabi", slug: "krabi", point: { x: 42, y: 72 }, nights: 3, blurb: "Quieter than Phuket, with the best limestone scenery in the country." },
    ],
    highlights: [
      "Phi Phi Islands by speedboat",
      "The Grand Palace and Wat Pho early in the morning",
      "Damnoen Saduak floating market",
      "Phang Nga Bay and James Bond Island",
      "A Thai cooking class with a market walk",
    ],
    whyPoints: [
      {
        title: "The best value beach holiday within five hours of India",
        body: "Hotel quality per rupee in Phuket and Krabi is still hard to beat anywhere in Asia.",
      },
      {
        title: "City and islands in one week",
        body: "A one-hour domestic flight separates Bangkok from the Andaman coast, so a six-day trip genuinely covers both.",
      },
      {
        title: "It suits first-time international travellers",
        body: "Straightforward visa process, English signage, and package infrastructure that handles transfers and tours end to end.",
      },
    ],
    experiences: ["phi-phi-island-hopping", "phang-nga-bay"],
    travelTips: [
      "Temples enforce a dress code — shoulders and knees covered, including for men.",
      "Agree a tuk-tuk fare before getting in, or use a ride-hailing app.",
      "The Andaman coast (Phuket, Krabi) and the Gulf coast (Samui) have opposite monsoons; pick the coast that matches your month.",
      "Speedboat island trips are rough in swell — take a ferry or a larger catamaran if anyone is prone to seasickness.",
      "Carry cash; many islands and markets are cash-only.",
    ],
    howToReach:
      "Non-stop flights to Bangkok (BKK/DMK) from most major Indian cities in 3.5–4.5 hours, and direct services to Phuket from Delhi and Mumbai. Bangkok to Phuket or Krabi is a 1.5-hour domestic hop.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹42,000 – ₹65,000 per person", note: "6 days, twin sharing, flights, transfers, breakfast and two tours." },
      { label: "Premium / beachfront", range: "₹78,000 – ₹1,20,000 per person" },
      { label: "Daily spending", range: "₹2,000 – ₹3,500 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "visa-free",
      stayDays: 60,
      documents: [
        "Passport valid at least 6 months beyond arrival",
        "Confirmed return ticket",
        "Proof of accommodation",
        "Thailand Digital Arrival Card submitted online before arrival",
      ],
      notes:
        "Indian passport holders currently enter Thailand without a visa for tourism. Entry conditions and permitted stay are set by Thai immigration and have changed several times in recent years — confirm the current rule before you travel.",
      lastVerified: VERIFIED,
      sourceName: "Royal Thai Embassy / Thai Immigration Bureau",
      sourceUrl: "https://www.thaievisa.go.th/",
    },
    answers: [
      {
        question: "How many days do you need in Thailand?",
        answer:
          "Five to eight days. Six is the sweet spot: three nights in Bangkok and three on the Andaman coast at Phuket or Krabi, with one island-hopping day.",
      },
      {
        question: "What does a Thailand trip cost from India?",
        answer:
          "A 6-day Thailand package typically starts around ₹42,000 per person on twin sharing with 4-star hotels, return flights, the internal flight, transfers, breakfast and two tours.",
      },
      {
        question: "When is the best time to visit Thailand?",
        answer:
          "November to March is the dry, cooler season and the best window for the Andaman coast. April and May are very hot, and the Andaman monsoon runs roughly May to October.",
      },
      {
        question: "Do Indians need a visa for Thailand?",
        answer:
          "Indian passport holders currently travel to Thailand visa-free for tourism. Because Thailand has revised this arrangement more than once, verify the rule and the permitted length of stay close to your travel date.",
      },
    ],
    faqs: [
      {
        question: "Phuket or Krabi?",
        answer:
          "Phuket has more hotels, nightlife and direct flights; Krabi is quieter, greener and better looking, with Railay and the limestone bays close by. Families and first-timers usually prefer Phuket; couples often prefer Krabi.",
      },
      {
        question: "Is Thailand good for a family holiday?",
        answer:
          "Yes. Resorts are set up for children, the island day trips have half-day versions, and Bangkok has enough indoor attractions for a hot afternoon. Choose ferries over speedboats with young children.",
      },
    ],
    seo: seo(
      "Thailand Tour Packages from India | Musafir Travels",
      "Thailand holiday packages covering Bangkok, Phuket, Krabi and Phi Phi island hopping. Flights, hotels, transfers and current entry-requirement guidance.",
      "/destinations/thailand",
      ["thailand package from india", "bangkok phuket package", "thailand visa for indians"],
    ),
    weight: 86,
  }),

  destination({
    id: "dst-switzerland",
    slug: "switzerland",
    name: "Switzerland",
    country: "Switzerland",
    region: "europe",
    domestic: false,
    tagline: "The country the train windows were built for.",
    intro:
      "Switzerland is small enough to cross in a morning and dramatic enough that you will not want to. The trip is really about the railway: base yourself in two or three valleys, buy the right pass, and let the scenery arrive at you. Nothing else in Europe delivers this much landscape with this little effort.",
    hero: { ...scene("snow", "Snow peaks above a lake and pine treeline"), src: "/images/swiss-alps.jpg" },
    gallery: [
      scene("snow", "An alpine peak above cloud"),
      scene("mountain", "A valley town beneath high ridges"),
    ],
    stats: [
      { label: "Ideal duration", value: "7–10 days", numeric: 8, suffix: " days" },
      { label: "Best season", value: "May – Sep, Dec – Feb" },
      { label: "From", value: "₹1,65,000", numeric: 165000, prefix: "₹" },
      { label: "Trip styles", value: "Honeymoon · Family · Luxury" },
    ],
    idealDurationDays: [7, 10],
    startingPrice: inr(165000),
    bestMonths: ["may", "jun", "jul", "aug", "sep", "dec", "jan"],
    styles: ["honeymoon", "couple", "family", "luxury", "winter", "senior-friendly"],
    cities: [
      { name: "Zurich", slug: "zurich", point: { x: 62, y: 26 }, nights: 1, blurb: "Arrival city and the main rail hub." },
      { name: "Lucerne", slug: "lucerne", point: { x: 54, y: 38 }, nights: 2, blurb: "Lake, covered bridge, and Mount Titlis an hour away." },
      { name: "Interlaken", slug: "interlaken", point: { x: 42, y: 48 }, nights: 3, blurb: "Between two lakes; the base for Jungfraujoch and Grindelwald." },
      { name: "Zermatt", slug: "zermatt", point: { x: 38, y: 66 }, nights: 2, blurb: "Car-free village under the Matterhorn." },
    ],
    highlights: [
      "Jungfraujoch — Top of Europe by cogwheel railway",
      "Mount Titlis rotating cable car and glacier walk",
      "The Glacier Express between Zermatt and the east",
      "Lake Lucerne cruise",
      "Grindelwald First and the cliff walk",
    ],
    whyPoints: [
      {
        title: "The railway does the sightseeing for you",
        body: "With a Swiss Travel Pass, trains, lake boats and most city transport are covered. You spend the holiday looking out of a window rather than negotiating logistics.",
      },
      {
        title: "It is genuinely easy with parents and grandparents",
        body: "Almost every peak is reached by cable car or cogwheel train rather than on foot, so the views do not require the walk.",
      },
      {
        title: "Two entirely different trips depending on the month",
        body: "Green valleys and lake swims in summer; snow, sledging and Christmas markets in December. Same route, different holiday.",
      },
    ],
    experiences: ["jungfraujoch", "glacier-express"],
    travelTips: [
      "Buy the Swiss Travel Pass before arrival — it covers trains, boats, buses and many museums, and pays for itself in about three travel days.",
      "Reserve Glacier Express seats well ahead; the panoramic carriages sell out in summer.",
      "Peak excursions are weather-dependent. Check the live webcams the evening before and swap days rather than paying for a view of cloud.",
      "Eating out is expensive — supermarket lunches are normal and take a lot of pressure off the budget.",
      "Zermatt is car-free; you park at Täsch and take the shuttle train.",
    ],
    howToReach:
      "One-stop flights from Indian metros to Zurich (ZRH) or Geneva (GVA) via Gulf or European hubs, typically 11–14 hours total. Trains from either airport reach the main valleys in 2–3 hours.",
    budgetGuide: [
      { label: "Comfortable 3/4-star", range: "₹1,65,000 – ₹2,10,000 per person", note: "8 days, twin sharing, flights, Swiss Travel Pass and breakfast." },
      { label: "Premium", range: "₹2,50,000 – ₹3,40,000 per person" },
      { label: "Daily spending", range: "₹6,000 – ₹9,000 per person", note: "Switzerland is genuinely expensive for meals and excursions." },
    ],
    visa: {
      passport: "IN",
      entryType: "sticker-visa",
      stayDays: 90,
      processingTime: "15–45 days; apply as early as the rules allow",
      fee: "varies",
      documents: [
        "Passport valid 3 months beyond intended departure, issued within the last 10 years",
        "Schengen visa application form and photograph",
        "Travel medical insurance with minimum €30,000 cover",
        "Confirmed flights, hotel bookings and day-by-day itinerary",
        "Bank statements for the last 6 months and income tax returns",
        "Employment or business proof",
      ],
      notes:
        "Switzerland is in the Schengen area. Indian passport holders must apply for a Schengen visa in advance through the Swiss visa application centre. Appointment availability is the usual bottleneck in summer — start three months out.",
      lastVerified: VERIFIED,
      sourceName: "State Secretariat for Migration, Switzerland",
      sourceUrl: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html",
    },
    answers: [
      {
        question: "How many days do you need in Switzerland?",
        answer:
          "Seven to ten days. Eight days allows Lucerne, Interlaken and Zermatt with two peak excursions and a scenic rail journey, without changing hotels every night.",
      },
      {
        question: "What does a Switzerland trip cost from India?",
        answer:
          "An 8-day Switzerland package typically starts around ₹1,65,000 per person on twin sharing with 3 or 4-star hotels, return flights, a Swiss Travel Pass and daily breakfast. Meals and peak excursions are the main additional costs.",
      },
      {
        question: "When is the best time to visit Switzerland?",
        answer:
          "May to September for green valleys, lake cruises and open mountain passes. December to February for snow, sledging and Christmas markets. April and November are the least rewarding months.",
      },
      {
        question: "Do Indians need a visa for Switzerland?",
        answer:
          "Yes — a Schengen visa applied for in advance. Processing commonly takes two to six weeks and appointment slots are scarce in the summer season, so begin around three months before departure.",
      },
    ],
    faqs: [
      {
        question: "Is the Swiss Travel Pass worth buying?",
        answer:
          "For a trip built around three or more bases, almost always. It covers trains, lake boats, city transport and a large number of museums, and gives discounts on the private mountain railways that are not fully included.",
      },
      {
        question: "Jungfraujoch or Titlis if I can only do one?",
        answer:
          "Jungfraujoch is the bigger day out — higher, longer, more expensive and with the Aletsch glacier at the top. Titlis is quicker and easier from Lucerne, with a rotating cable car and a cliff bridge. With children or older parents, Titlis is the more comfortable choice.",
      },
    ],
    seo: seo(
      "Switzerland Tour Packages from India | Musafir Travels",
      "Switzerland holiday and honeymoon packages covering Lucerne, Interlaken, Jungfraujoch and Zermatt, with Swiss Travel Pass, scenic rail journeys and Schengen visa assistance.",
      "/destinations/switzerland",
      ["switzerland package from india", "switzerland honeymoon package", "jungfraujoch tour"],
    ),
    weight: 84,
  }),

  destination({
    id: "dst-vietnam",
    slug: "vietnam",
    name: "Vietnam",
    country: "Vietnam",
    region: "asia",
    domestic: false,
    tagline: "A thousand kilometres of green.",
    intro:
      "Vietnam is long and narrow, which makes it a route rather than a base. Most trips run north to south — the limestone bays around Ha Long, the lantern-lit old town of Hoi An, and the energy of Ho Chi Minh City — with short internal flights in between. It is one of the best-value destinations in Asia and still one of the least crowded.",
    hero: scene("island", "Limestone islands rising from calm bay water"),
    gallery: [scene("city", "Old-town lanterns at night"), scene("forest", "Terraced hills in northern Vietnam")],
    stats: [
      { label: "Ideal duration", value: "7–9 days", numeric: 8, suffix: " days" },
      { label: "Best season", value: "Feb – Apr, Oct – Dec" },
      { label: "From", value: "₹52,000", numeric: 52000, prefix: "₹" },
      { label: "Trip styles", value: "Friends · Couple · Culture" },
    ],
    idealDurationDays: [7, 9],
    startingPrice: inr(52000),
    bestMonths: ["feb", "mar", "apr", "oct", "nov", "dec"],
    styles: ["friends", "couple", "cultural", "adventure", "solo"],
    cities: [
      { name: "Hanoi", slug: "hanoi", point: { x: 46, y: 20 }, nights: 2 },
      { name: "Ha Long Bay", slug: "ha-long-bay", point: { x: 56, y: 24 }, nights: 1, blurb: "Overnight cruise among the karsts." },
      { name: "Da Nang & Hoi An", slug: "hoi-an", point: { x: 58, y: 50 }, nights: 3 },
      { name: "Ho Chi Minh City", slug: "ho-chi-minh-city", point: { x: 48, y: 82 }, nights: 2 },
    ],
    highlights: [
      "Overnight cruise in Ha Long or Lan Ha Bay",
      "Hoi An old town after dark",
      "Ba Na Hills and the Golden Bridge",
      "Cu Chi tunnels",
      "A street-food walk in Hanoi's old quarter",
    ],
    whyPoints: [
      {
        title: "Exceptional value",
        body: "Hotel standards well above the price point, and food costs that barely register against the rest of the budget.",
      },
      {
        title: "Three genuinely different regions",
        body: "The north, centre and south have different food, climate and character. A week here covers more ground than a week almost anywhere else.",
      },
    ],
    experiences: ["ha-long-bay-cruise"],
    travelTips: [
      "The country spans several climate zones — the north can be cold and misty in January while the south is hot.",
      "Book the Ha Long cruise as part of the package; quality varies enormously between operators.",
      "Carry small denominations of dong; change for large notes is often unavailable.",
      "Crossing the road in Hanoi works by walking steadily and predictably — traffic flows around you.",
    ],
    howToReach:
      "Direct flights from Delhi, Mumbai and other metros to Hanoi (HAN) and Ho Chi Minh City (SGN), typically 4.5–5.5 hours. Internal flights between the three regions take about 1–2 hours.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹52,000 – ₹75,000 per person" },
      { label: "Daily spending", range: "₹1,800 – ₹3,000 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "e-visa",
      stayDays: 90,
      processingTime: "3–5 working days",
      fee: "varies",
      documents: [
        "Passport valid at least 6 months beyond arrival",
        "Passport data-page scan and a digital photograph",
        "Confirmed entry and exit dates and port of entry",
      ],
      notes:
        "Indian passport holders apply for a Vietnamese e-visa online before travel. The e-visa specifies the port of entry, so the arrival airport must match what you applied with.",
      lastVerified: VERIFIED,
      sourceName: "Vietnam Immigration Department — National e-Visa Portal",
      sourceUrl: "https://evisa.gov.vn/",
    },
    answers: [
      {
        question: "How many days do you need in Vietnam?",
        answer:
          "Seven to nine days to cover the north, centre and south without the trip becoming a series of airports. A five-day trip should stick to one region.",
      },
      {
        question: "What does a Vietnam trip cost from India?",
        answer:
          "An 8-day Vietnam package typically starts around ₹52,000 per person on twin sharing with 4-star hotels, return and internal flights, a Ha Long Bay cruise night, transfers and breakfast.",
      },
      {
        question: "When is the best time to visit Vietnam?",
        answer:
          "February to April and October to December work best across the whole country. Because Vietnam spans several climate zones, a trip covering all three regions will always involve some compromise.",
      },
      {
        question: "Do Indians need a visa for Vietnam?",
        answer:
          "Yes — an e-visa applied for online before travel, usually issued within three to five working days. The port of entry named on the application must match your actual arrival airport.",
      },
    ],
    faqs: [
      {
        question: "Is a Ha Long Bay overnight cruise worth it over a day trip?",
        answer:
          "Yes. The bay empties out in the late afternoon, and sunrise among the karsts is the part people remember. A day trip spends most of its hours on the road from Hanoi.",
      },
    ],
    seo: seo(
      "Vietnam Tour Packages from India | Musafir Travels",
      "Vietnam holiday packages covering Hanoi, Ha Long Bay, Hoi An and Ho Chi Minh City with internal flights, an overnight cruise and e-visa assistance.",
      "/destinations/vietnam",
      ["vietnam package from india", "ha long bay cruise", "vietnam evisa for indians"],
    ),
    weight: 78,
  }),

  destination({
    id: "dst-japan",
    slug: "japan",
    name: "Japan",
    country: "Japan",
    region: "asia",
    domestic: false,
    tagline: "Precision, and then blossom.",
    intro:
      "Japan is the most rewarding country in Asia to travel badly-planned in — and the most rewarding to plan well. The shinkansen makes a Tokyo–Kyoto–Osaka loop effortless, the food is extraordinary at every price point, and the seasons genuinely change the trip. Go in early April for blossom or November for maple, and book far ahead for either.",
    hero: { ...scene("city", "A neon city street under evening rain"), src: "/images/kyoto-temple.jpg" },
    gallery: [scene("mountain", "A volcanic cone above spring blossom"), scene("heritage", "A wooden temple gate in a forest")],
    stats: [
      { label: "Ideal duration", value: "8–12 days", numeric: 10, suffix: " days" },
      { label: "Best season", value: "Mar – May, Oct – Nov" },
      { label: "From", value: "₹1,55,000", numeric: 155000, prefix: "₹" },
      { label: "Trip styles", value: "Couple · Family · Culture" },
    ],
    idealDurationDays: [8, 12],
    startingPrice: inr(155000),
    bestMonths: ["mar", "apr", "may", "oct", "nov"],
    styles: ["couple", "family", "cultural", "luxury", "solo"],
    cities: [
      { name: "Tokyo", slug: "tokyo", point: { x: 66, y: 46 }, nights: 4 },
      { name: "Hakone", slug: "hakone", point: { x: 58, y: 52 }, nights: 1, blurb: "Onsen town with Mount Fuji views on a clear day." },
      { name: "Kyoto", slug: "kyoto", point: { x: 44, y: 58 }, nights: 3 },
      { name: "Osaka", slug: "osaka", point: { x: 40, y: 62 }, nights: 2 },
    ],
    highlights: [
      "Fushimi Inari's torii gates before 7am",
      "Shinkansen from Tokyo to Kyoto",
      "Arashiyama bamboo grove and the Sagano railway",
      "Teamlab digital art museum in Tokyo",
      "Dotonbori street food in Osaka",
    ],
    whyPoints: [
      {
        title: "The rail network makes multi-city effortless",
        body: "Tokyo to Kyoto takes just over two hours door to door. A Japan Rail Pass turns the whole country into one connected itinerary.",
      },
      {
        title: "Season changes the destination completely",
        body: "Cherry blossom in late March and April and autumn maple in November are genuinely different holidays, and both need booking months ahead.",
      },
    ],
    experiences: [],
    travelTips: [
      "Cash still matters — carry yen for smaller restaurants, shrines and rural stations.",
      "An IC card (Suica or Pasmo) covers city trains, buses and convenience stores.",
      "Vegetarian travellers should be explicit: dashi, a fish stock, is in many otherwise vegetable dishes. We brief hotels in advance where required.",
      "Blossom timing shifts by a week or more each year and cannot be guaranteed by any operator.",
      "Luggage forwarding between hotels is cheap and standard — use it rather than dragging bags onto the shinkansen.",
    ],
    howToReach:
      "Direct flights from Delhi and Mumbai to Tokyo (NRT/HND) in around 8 hours, and one-stop options from other metros. Osaka (KIX) is served with one stop from most Indian cities.",
    budgetGuide: [
      { label: "Comfortable 3/4-star", range: "₹1,55,000 – ₹2,05,000 per person" },
      { label: "Daily spending", range: "₹4,500 – ₹7,500 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "e-visa",
      stayDays: 90,
      processingTime: "5–10 working days",
      fee: "varies",
      documents: [
        "Passport valid for the duration of stay",
        "Visa application form and photograph",
        "Day-by-day itinerary and confirmed hotel bookings",
        "Bank statements and income tax returns",
      ],
      notes:
        "Indian passport holders require a Japanese tourist visa in advance. An eVisa route is available for applicants in India through the official portal; the exact channel depends on your jurisdiction.",
      lastVerified: VERIFIED,
      sourceName: "Ministry of Foreign Affairs of Japan",
      sourceUrl: "https://www.mofa.go.jp/j_info/visit/visa/",
    },
    answers: [
      {
        question: "How many days do you need in Japan?",
        answer:
          "Eight to twelve days for a first trip. Ten days comfortably covers Tokyo, Hakone, Kyoto and Osaka using the shinkansen, with time for day trips to Nara or Nikko.",
      },
      {
        question: "What does a Japan trip cost from India?",
        answer:
          "A 10-day Japan package typically starts around ₹1,55,000 per person on twin sharing with 3 or 4-star hotels, return flights, a rail pass and daily breakfast.",
      },
      {
        question: "When is the best time to visit Japan?",
        answer:
          "Late March to early April for cherry blossom and late October to November for autumn colour. Both are peak season — hotels should be booked four to six months ahead.",
      },
      {
        question: "Do Indians need a visa for Japan?",
        answer:
          "Yes, a tourist visa arranged before travel. Applications from India can be made through the official eVisa portal or the visa application centre, typically taking five to ten working days.",
      },
    ],
    faqs: [
      {
        question: "Can you guarantee we will see cherry blossom?",
        answer:
          "No, and no honest operator can. Peak bloom shifts by up to two weeks year to year and lasts about ten days in any one city. We plan blossom trips across multiple cities at different elevations, which materially improves the odds without promising them.",
      },
      {
        question: "Is Japan difficult without speaking Japanese?",
        answer:
          "Less than people expect. Signage on trains and in major cities is bilingual, ticket machines have English modes, and translation apps handle menus well. Rural areas need more patience.",
      },
    ],
    seo: seo(
      "Japan Tour Packages from India | Musafir Travels",
      "Japan holiday packages covering Tokyo, Hakone, Kyoto and Osaka with shinkansen rail passes, cherry blossom and autumn departures, and visa assistance.",
      "/destinations/japan",
      ["japan package from india", "cherry blossom japan trip", "japan visa for indians"],
    ),
    weight: 76,
  }),

  destination({
    id: "dst-mauritius",
    slug: "mauritius",
    name: "Mauritius",
    country: "Mauritius",
    region: "africa",
    domestic: false,
    tagline: "An island that never feels remote.",
    intro:
      "Mauritius gives you a resort island with an actual country behind it — mountains, a botanical garden, tea estates and a busy market town are all inside an hour's drive of the beach. It is a reliable honeymoon choice for travellers who want the water of the Maldives with somewhere to go on the third day.",
    hero: scene("island", "A lagoon and mountain ridge on a tropical island"),
    gallery: [scene("beach", "A calm lagoon beach with casuarina trees")],
    stats: [
      { label: "Ideal duration", value: "5–7 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Apr – Jun, Sep – Dec" },
      { label: "From", value: "₹78,000", numeric: 78000, prefix: "₹" },
      { label: "Trip styles", value: "Honeymoon · Family" },
    ],
    idealDurationDays: [5, 7],
    startingPrice: inr(78000),
    bestMonths: ["apr", "may", "jun", "sep", "oct", "nov", "dec"],
    styles: ["honeymoon", "couple", "family", "beach", "luxury"],
    cities: [
      { name: "North Coast", slug: "north-coast", point: { x: 50, y: 26 }, nights: 3, blurb: "Grand Baie — the liveliest base, closest to restaurants." },
      { name: "West Coast", slug: "west-coast", point: { x: 30, y: 54 }, nights: 2, blurb: "Flic en Flac; the best sunsets and dolphin trips." },
    ],
    highlights: [
      "Catamaran cruise to Île aux Cerfs",
      "Chamarel seven-coloured earths and waterfall",
      "Dolphin watching at Tamarin Bay",
      "Underwater sea walk at Grand Baie",
      "Black River Gorges viewpoint",
    ],
    whyPoints: [
      {
        title: "Beach holiday with a country attached",
        body: "Unlike a one-island resort trip, there is genuinely somewhere to go — gorges, tea estates, a volcanic crater and a market town, all within an hour.",
      },
      {
        title: "Straightforward entry for Indian passports",
        body: "Visa-free entry on arrival for tourism keeps the planning simple when leave is confirmed late.",
      },
    ],
    experiences: [],
    travelTips: [
      "The east coast is windier — better for kitesurfing, less good for calm swimming.",
      "Half board is common and usually good value given how spread out restaurants are.",
      "January to March is cyclone season; travel insurance covering disruption matters more than usual.",
    ],
    howToReach:
      "Direct flights from Mumbai and Delhi to Mauritius (MRU) in around 6–7 hours, with one-stop options from other cities.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹78,000 – ₹1,05,000 per person" },
      { label: "5-star / villa", range: "₹1,30,000 – ₹2,00,000 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "visa-free",
      stayDays: 90,
      documents: [
        "Passport valid at least 6 months beyond arrival",
        "Confirmed return ticket",
        "Proof of accommodation and sufficient funds",
      ],
      notes:
        "Indian passport holders are granted entry for tourism on arrival without a prior visa, subject to immigration checks on accommodation, funds and onward travel.",
      lastVerified: VERIFIED,
      sourceName: "Mauritius Passport and Immigration Office",
      sourceUrl: "https://passport.govmu.org/",
    },
    answers: [
      {
        question: "How many days are enough for Mauritius?",
        answer:
          "Five to seven days. Six nights allows three on the north coast and two or three on the west, with a catamaran day and an inland excursion.",
      },
      {
        question: "What does a Mauritius trip cost from India?",
        answer:
          "A 6-day Mauritius package typically starts around ₹78,000 per person on twin sharing with 4-star hotels, direct return flights, transfers and half board.",
      },
      {
        question: "Do Indians need a visa for Mauritius?",
        answer:
          "No prior visa is required. Indian passport holders are admitted for tourism on arrival, subject to holding a return ticket, confirmed accommodation and sufficient funds.",
      },
      {
        question: "When is the best time to visit Mauritius?",
        answer:
          "April to June and September to December give the most settled weather. January to March is the cyclone season and carries a real risk of disruption.",
      },
    ],
    faqs: [
      {
        question: "Mauritius or Maldives for a honeymoon?",
        answer:
          "Maldives if you want to see nobody and do nothing; Mauritius if you want the same water quality but with excursions, restaurants outside the resort and a lower cost for the equivalent hotel category.",
      },
    ],
    seo: seo(
      "Mauritius Tour Packages from India | Musafir Travels",
      "Mauritius honeymoon and family packages with lagoon resorts, catamaran cruises and island excursions. Direct flights and visa-free entry for Indian passport holders.",
      "/destinations/mauritius",
      ["mauritius package from india", "mauritius honeymoon package"],
    ),
    weight: 72,
  }),

  destination({
    id: "dst-malaysia",
    slug: "malaysia",
    name: "Malaysia",
    country: "Malaysia",
    region: "asia",
    domestic: false,
    tagline: "Three cultures, one short flight.",
    intro:
      "Malaysia is the easy-entry destination that most Indian travellers underrate. Kuala Lumpur is a genuinely good city — food, skyline, caves at the edge of town — and Langkawi gives you an island with duty-free prices an hour's flight away. It works particularly well as a first trip abroad with parents.",
    hero: scene("city", "Twin towers above a tropical city skyline"),
    gallery: [scene("island", "A quiet island beach with jungle behind")],
    stats: [
      { label: "Ideal duration", value: "5–7 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Dec – Mar" },
      { label: "From", value: "₹38,000", numeric: 38000, prefix: "₹" },
      { label: "Trip styles", value: "Family · Friends · Weekend" },
    ],
    idealDurationDays: [5, 7],
    startingPrice: inr(38000),
    bestMonths: ["dec", "jan", "feb", "mar", "jun", "jul"],
    styles: ["family", "friends", "weekend", "senior-friendly", "beach"],
    cities: [
      { name: "Kuala Lumpur", slug: "kuala-lumpur", point: { x: 44, y: 52 }, nights: 3 },
      { name: "Langkawi", slug: "langkawi", point: { x: 28, y: 26 }, nights: 3 },
    ],
    highlights: [
      "Petronas Towers skybridge",
      "Batu Caves",
      "Langkawi SkyCab and the sky bridge",
      "Island hopping to Pulau Dayang Bunting",
      "Jalan Alor night food street",
    ],
    whyPoints: [
      {
        title: "Among the easiest entries from India",
        body: "Visa-free entry for short tourist stays and short non-stop flights make it a straightforward first trip abroad.",
      },
      {
        title: "Excellent for vegetarian travellers",
        body: "A large Indian community means genuinely good vegetarian and South Indian food is easy to find, particularly in Kuala Lumpur.",
      },
    ],
    experiences: [],
    travelTips: [
      "Kuala Lumpur to Langkawi is a one-hour domestic flight — book it with the package.",
      "The east coast monsoon runs November to February; Langkawi on the west coast is largely unaffected.",
      "Grab is the standard ride-hailing app and much cheaper than hotel taxis.",
    ],
    howToReach:
      "Non-stop flights to Kuala Lumpur (KUL) from most Indian metros in 4–5 hours, with a one-hour domestic connection to Langkawi.",
    budgetGuide: [
      { label: "Comfortable 4-star", range: "₹38,000 – ₹58,000 per person" },
      { label: "Daily spending", range: "₹1,800 – ₹3,000 per person" },
    ],
    visa: {
      passport: "IN",
      entryType: "visa-free",
      stayDays: 30,
      documents: [
        "Passport valid at least 6 months beyond arrival",
        "Confirmed return ticket and accommodation",
        "Malaysia Digital Arrival Card submitted before arrival",
      ],
      notes:
        "Indian passport holders currently enter Malaysia visa-free for short tourist stays. This arrangement has a stated end date that has been extended more than once — confirm it is still in force before booking.",
      lastVerified: VERIFIED,
      sourceName: "Immigration Department of Malaysia",
      sourceUrl: "https://www.imi.gov.my/",
    },
    answers: [
      {
        question: "How many days are enough for Malaysia?",
        answer:
          "Five to seven days. Six nights split as three in Kuala Lumpur and three in Langkawi covers the city and an island without rushing.",
      },
      {
        question: "What does a Malaysia trip cost from India?",
        answer:
          "A 6-day Malaysia package typically starts around ₹38,000 per person on twin sharing with 4-star hotels, return and domestic flights, transfers and breakfast.",
      },
      {
        question: "Do Indians need a visa for Malaysia?",
        answer:
          "Indian passport holders currently travel to Malaysia visa-free for short tourist stays, with a digital arrival card submitted online beforehand. The arrangement is time-limited and has been extended repeatedly, so confirm it before booking.",
      },
      {
        question: "When is the best time to visit Malaysia?",
        answer:
          "December to March for the west coast and Langkawi. Kuala Lumpur is warm and humid year-round with short afternoon downpours in most months.",
      },
    ],
    faqs: [
      {
        question: "Is Malaysia a good first trip abroad with parents?",
        answer:
          "It is one of the best. Short flight, no visa queue, familiar food, English widely spoken, and attractions that are reached by cable car or lift rather than long walks.",
      },
    ],
    seo: seo(
      "Malaysia Tour Packages from India | Musafir Travels",
      "Malaysia holiday packages covering Kuala Lumpur and Langkawi with flights, transfers, city tours and island hopping. Visa-free entry guidance for Indian passport holders.",
      "/destinations/malaysia",
      ["malaysia package from india", "kuala lumpur langkawi package"],
    ),
    weight: 70,
  }),
];
