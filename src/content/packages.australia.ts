import type { Package } from "@/lib/types";
import { scene, seo } from "./_builder";
import { inr, pkg, pricing } from "./_package-builder";

/**
 * The flagship itinerary. Every motion pattern on the package detail page —
 * the day timeline, the route map, the sticky progress rail, the customiser —
 * is exercised by this record, so it is the one to check after any change to
 * the itinerary rendering.
 */
export const australiaPackages: Package[] = [
  pkg({
    id: "pkg-au-grand",
    slug: "melbourne-sydney-gold-coast-cairns",
    title: "Melbourne, Sydney, Gold Coast & Cairns",
    destinationSlug: "australia",
    destinationName: "Australia",
    nights: 12,
    days: 13,
    hero: scene("reef", "Reef water off the Queensland coast"),
    gallery: [
      scene("city", "Sydney harbour at dusk"),
      scene("beach", "The Great Ocean Road coastline"),
      scene("reef", "Shallow reef flats near Cairns"),
    ],
    summary:
      "The complete Australian east coast in one loop — a coffee city, a harbour city, a beach stretch and the reef. Four internal flights keep the driving down, and the pace is built so that no day is spent purely in transit.",
    cities: [
      { name: "Melbourne", slug: "melbourne", point: { x: 46, y: 82 }, nights: 4 },
      { name: "Sydney", slug: "sydney", point: { x: 62, y: 71 }, nights: 3 },
      { name: "Gold Coast", slug: "gold-coast", point: { x: 68, y: 56 }, nights: 2 },
      { name: "Cairns", slug: "cairns", point: { x: 60, y: 26 }, nights: 3 },
    ],
    styles: ["family", "couple", "adventure", "friends"],
    hotelCategory: "4-star",
    startingPrice: inr(184500),
    pricing: pricing({
      basePerAdult: 184500,
      baseHotelCategory: "4-star",
      addOns: [
        {
          id: "au-reef-pontoon",
          label: "Outer reef pontoon upgrade",
          description:
            "Full-day outer-reef pontoon with a semi-submersible, guided snorkel and buffet lunch, in place of the standard inner-reef boat.",
          price: inr(9800),
          group: "activity",
        },
        {
          id: "au-bridge-climb",
          label: "Sydney Harbour BridgeClimb",
          description: "Summit climb with a guide. Minimum age and health conditions apply.",
          price: inr(16500),
          group: "activity",
        },
        {
          id: "au-heli-reef",
          label: "Reef scenic helicopter (10 min)",
          description: "Low-level flight over the outer reef from the pontoon.",
          price: inr(14200),
          group: "activity",
        },
        {
          id: "au-private-transfers",
          label: "Private airport transfers throughout",
          description: "Replaces shared coach transfers on all eight airport legs.",
          price: inr(11400),
          group: "transfer",
        },
        {
          id: "au-premium-econ",
          label: "Premium economy on international sectors",
          description: "Subject to availability at the time of ticketing.",
          price: inr(58000),
          group: "flight",
        },
        {
          id: "au-harbour-view",
          label: "Harbour-view room in Sydney",
          description: "Upgrade for all three Sydney nights.",
          price: inr(13800),
          group: "room",
        },
      ],
    }),
    highlights: [
      "Great Ocean Road and the Twelve Apostles",
      "Great Barrier Reef by boat from Cairns",
      "Sydney Harbour cruise at golden hour",
      "Blue Mountains and the Three Sisters",
      "Kuranda Scenic Railway and Skyrail",
      "Dreamworld or Movie World on the Gold Coast",
    ],
    inclusions: [
      "Return international flights from your chosen Indian city",
      "Four internal flights: Melbourne–Sydney, Sydney–Gold Coast, Gold Coast–Cairns, Cairns–departure",
      "12 nights in 4-star hotels on twin sharing",
      "Daily breakfast; 3 lunches and 1 dinner as itemised in the itinerary",
      "All airport and inter-city transfers",
      "Great Ocean Road full-day tour with guide",
      "Great Barrier Reef day cruise with snorkelling equipment",
      "Sydney Harbour cruise and Blue Mountains day tour",
      "Kuranda Scenic Railway one way and Skyrail return",
      "One Gold Coast theme park entry",
      "Australian visa (subclass 600) application support and documentation review",
      "24/7 on-trip support contact",
    ],
    exclusions: [
      "Australian visa fee, payable directly to the Department of Home Affairs",
      "Travel insurance (mandatory; we can arrange it)",
      "Meals not listed in the inclusions",
      "Optional activities and add-ons selected during customisation",
      "Personal expenses, tips and anything not explicitly listed as included",
      "Costs arising from flight delays, weather cancellations or events outside our control",
    ],
    bestMonths: ["mar", "apr", "may", "sep", "oct", "nov"],
    visaStatus: "e-visa",
    featured: true,
    itinerary: [
      {
        day: 1,
        title: "India to Melbourne",
        city: "In transit",
        leg: { from: "Mumbai", to: "Melbourne", mode: "flight", durationMins: 900, note: "One stop, usually Singapore or Kuala Lumpur" },
        summary:
          "An overnight departure from India with a single stop. You lose most of a calendar day to the time difference — the itinerary is built assuming you arrive tired.",
        media: scene("city", "An aircraft wing above cloud at dawn"),
        activities: [
          { slot: "evening", title: "Departure from your home city", description: "Airport assistance and check-in guidance provided." },
        ],
        meals: ["none"],
      },
      {
        day: 2,
        title: "Arrive Melbourne",
        city: "Melbourne",
        leg: { from: "Melbourne Airport", to: "Melbourne CBD", mode: "transfer", durationMins: 35 },
        summary:
          "Land, transfer, and do nothing demanding. An easy walk through the laneways and an early night sets up the rest of the trip.",
        media: scene("city", "Melbourne laneway with street art and cafés"),
        activities: [
          { slot: "morning", title: "Arrival and airport transfer", location: "Melbourne Airport", durationMins: 35 },
          { slot: "afternoon", title: "Hotel check-in and rest", location: "Melbourne CBD" },
          {
            slot: "evening",
            title: "Laneway walk — Degraves Street and Hosier Lane",
            location: "Melbourne CBD",
            durationMins: 120,
            description: "A short orientation walk through the arcades and street-art lanes, ending with dinner nearby.",
          },
        ],
        hotel: { name: "4-star hotel, Melbourne CBD", category: "4-star", nights: 4 },
        meals: ["none"],
      },
      {
        day: 3,
        title: "Melbourne city and the bay",
        city: "Melbourne",
        summary:
          "A full day in the city — markets in the morning, the river and the gardens in the afternoon, and the option of a penguin sunset at Phillip Island.",
        media: scene("city", "Melbourne's river and skyline in the afternoon"),
        activities: [
          { slot: "morning", title: "Queen Victoria Market", location: "Melbourne", durationMins: 120, description: "Produce halls, deli and the coffee that Melbourne is actually famous for." },
          { slot: "afternoon", title: "Royal Botanic Gardens and Southbank", location: "Melbourne", durationMins: 180 },
          { slot: "evening", title: "Evening at leisure", location: "Melbourne", description: "Optional: Phillip Island penguin parade, a long afternoon-to-night excursion." },
        ],
        hotel: { name: "4-star hotel, Melbourne CBD", category: "4-star", nights: 4 },
        meals: ["breakfast"],
      },
      {
        day: 4,
        title: "Great Ocean Road",
        city: "Melbourne",
        leg: { from: "Melbourne", to: "Twelve Apostles", mode: "coach", durationMins: 240, note: "Full-day return excursion" },
        summary:
          "The best day of the Melbourne leg and a genuinely long one. Coastal road, rainforest walk, and the limestone stacks in late-afternoon light on the way back.",
        media: scene("beach", "Limestone stacks in the sea below coastal cliffs"),
        activities: [
          { slot: "morning", title: "Depart for the Great Ocean Road", location: "Melbourne", durationMins: 150, description: "Early start — the coast road is slow by design.", experienceSlug: "great-ocean-road" },
          { slot: "afternoon", title: "Otway rainforest walk and Apollo Bay lunch", location: "Great Otway National Park", durationMins: 150 },
          { slot: "evening", title: "Twelve Apostles and Loch Ard Gorge", location: "Port Campbell", durationMins: 90, description: "Late light is the best light here. Return to Melbourne after dark." },
        ],
        hotel: { name: "4-star hotel, Melbourne CBD", category: "4-star", nights: 4 },
        meals: ["breakfast", "lunch"],
      },
      {
        day: 5,
        title: "Melbourne at your own pace",
        city: "Melbourne",
        summary:
          "A deliberately unstructured day. Most travellers use it for the National Gallery, a Yarra Valley wine trip, or simply the coffee-and-bookshop version of Melbourne.",
        media: scene("city", "A quiet Melbourne street on a bright morning"),
        activities: [
          { slot: "morning", title: "Free morning", location: "Melbourne", description: "Optional: NGV International or the Melbourne Museum." },
          { slot: "afternoon", title: "Optional Yarra Valley wine tour", location: "Yarra Valley", durationMins: 300, addOnId: "au-yarra-valley" },
          { slot: "evening", title: "Dinner in Fitzroy or Carlton", location: "Melbourne" },
        ],
        hotel: { name: "4-star hotel, Melbourne CBD", category: "4-star", nights: 4 },
        meals: ["breakfast"],
      },
      {
        day: 6,
        title: "Melbourne to Sydney",
        city: "Sydney",
        leg: { from: "Melbourne", to: "Sydney", mode: "flight", durationMins: 95 },
        summary:
          "A short morning flight, then straight into the reason people come to Sydney — the harbour, seen from the water in the late afternoon.",
        media: scene("city", "Sydney harbour with ferries crossing at golden hour"),
        activities: [
          { slot: "morning", title: "Transfer and flight to Sydney", durationMins: 95 },
          { slot: "afternoon", title: "Hotel check-in, Circular Quay walk", location: "Sydney", durationMins: 120 },
          { slot: "evening", title: "Sydney Harbour sunset cruise", location: "Circular Quay", durationMins: 120, experienceSlug: "sydney-harbour-cruise" },
        ],
        hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 3 },
        meals: ["breakfast"],
      },
      {
        day: 7,
        title: "Sydney — city and coast",
        city: "Sydney",
        summary:
          "The Opera House up close in the morning, then the Bondi-to-Coogee cliff walk, which is the single best free thing to do in the city.",
        media: scene("beach", "A curving city beach seen from a coastal path"),
        activities: [
          { slot: "morning", title: "Sydney Opera House guided tour", location: "Bennelong Point", durationMins: 60 },
          { slot: "afternoon", title: "Bondi to Coogee coastal walk", location: "Eastern Beaches", durationMins: 180, description: "Six kilometres of clifftop path past four beaches. Shorten it at Bronte if you prefer." },
          { slot: "evening", title: "Darling Harbour at leisure", location: "Sydney" },
        ],
        hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 3 },
        meals: ["breakfast"],
      },
      {
        day: 8,
        title: "Blue Mountains",
        city: "Sydney",
        leg: { from: "Sydney", to: "Katoomba", mode: "train", durationMins: 120, note: "Scenic rail on the outbound leg" },
        summary:
          "Two hours inland, the city stops entirely. Eucalyptus valleys, the Three Sisters, and the steepest passenger railway in the world.",
        media: scene("forest", "A wide forested valley below sandstone cliffs"),
        activities: [
          { slot: "morning", title: "Rail to Katoomba", durationMins: 120, experienceSlug: "blue-mountains" },
          { slot: "afternoon", title: "Echo Point, Three Sisters and Scenic World", location: "Katoomba", durationMins: 210 },
          { slot: "evening", title: "Return to Sydney", durationMins: 120 },
        ],
        hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 3 },
        meals: ["breakfast", "lunch"],
      },
      {
        day: 9,
        title: "Sydney to the Gold Coast",
        city: "Gold Coast",
        leg: { from: "Sydney", to: "Gold Coast", mode: "flight", durationMins: 85 },
        summary:
          "The pace drops. A short flight north, a beachfront hotel, and an afternoon that asks nothing of you beyond walking to the sand.",
        media: scene("beach", "A long surf beach with high-rises behind it"),
        activities: [
          { slot: "morning", title: "Flight to the Gold Coast", durationMins: 85 },
          { slot: "afternoon", title: "Check-in and Surfers Paradise beach", location: "Gold Coast", durationMins: 150 },
          { slot: "evening", title: "Evening at leisure", location: "Gold Coast" },
        ],
        hotel: { name: "4-star beachfront hotel, Gold Coast", category: "4-star", nights: 2 },
        meals: ["breakfast"],
      },
      {
        day: 10,
        title: "Theme park day",
        city: "Gold Coast",
        summary:
          "One full-day theme park entry is included — Dreamworld, Movie World or Sea World. Choose during customisation; families with under-tens usually do best at Sea World.",
        media: scene("city", "A theme park skyline against a bright sky"),
        activities: [
          { slot: "morning", title: "Theme park entry (choice of one)", location: "Gold Coast", durationMins: 480 },
          { slot: "evening", title: "Dinner at Broadbeach", location: "Gold Coast" },
        ],
        hotel: { name: "4-star beachfront hotel, Gold Coast", category: "4-star", nights: 2 },
        meals: ["breakfast"],
      },
      {
        day: 11,
        title: "Gold Coast to Cairns",
        city: "Cairns",
        leg: { from: "Gold Coast", to: "Cairns", mode: "flight", durationMins: 140 },
        summary:
          "North into the tropics. Cairns is small and walkable; the esplanade lagoon in the evening is where the whole town ends up.",
        media: scene("reef", "A tropical coastline with reef flats offshore"),
        activities: [
          { slot: "morning", title: "Flight to Cairns", durationMins: 140 },
          { slot: "afternoon", title: "Check-in and Cairns Esplanade", location: "Cairns", durationMins: 120 },
          { slot: "evening", title: "Night markets and dinner", location: "Cairns" },
        ],
        hotel: { name: "4-star hotel, Cairns", category: "4-star", nights: 3 },
        meals: ["breakfast"],
      },
      {
        day: 12,
        title: "Great Barrier Reef",
        city: "Cairns",
        leg: { from: "Cairns Marina", to: "Outer Reef", mode: "cruise", durationMins: 90 },
        summary:
          "The day the trip is built around. A catamaran to the outer reef, several hours in the water or on a semi-submersible, and back by late afternoon.",
        media: scene("reef", "Coral bommies visible through clear shallow water"),
        activities: [
          { slot: "morning", title: "Catamaran to the outer reef", location: "Cairns Marina", durationMins: 90, experienceSlug: "great-barrier-reef" },
          { slot: "afternoon", title: "Snorkelling, semi-submersible and marine biologist talk", location: "Great Barrier Reef", durationMins: 300, addOnId: "au-reef-pontoon", description: "Guided snorkel lines and flotation vests are available — you do not need to be a strong swimmer." },
          { slot: "evening", title: "Return to Cairns", durationMins: 90 },
        ],
        hotel: { name: "4-star hotel, Cairns", category: "4-star", nights: 3 },
        meals: ["breakfast", "lunch"],
      },
      {
        day: 13,
        title: "Kuranda, then departure",
        city: "Cairns",
        leg: { from: "Cairns", to: "India", mode: "flight", durationMins: 900, note: "Evening departure, one stop" },
        summary:
          "Rainforest by rail in the morning, cableway back over the canopy, then the airport. A good last day rather than a wasted one.",
        media: scene("forest", "A railway curving through dense rainforest"),
        activities: [
          { slot: "morning", title: "Kuranda Scenic Railway", location: "Kuranda", durationMins: 105 },
          { slot: "afternoon", title: "Skyrail Rainforest Cableway return", location: "Barron Gorge", durationMins: 120 },
          { slot: "evening", title: "Airport transfer and departure", location: "Cairns Airport" },
        ],
        meals: ["breakfast"],
      },
    ],
    answers: [
      {
        question: "How long is this Australia itinerary?",
        answer:
          "Thirteen days and twelve nights, covering Melbourne (4 nights), Sydney (3), the Gold Coast (2) and Cairns (3), with four internal flights between them.",
      },
      {
        question: "What does this Australia package cost?",
        answer:
          "It starts at ₹1,84,500 per person on twin sharing with 4-star hotels, including return international flights, all four internal flights, transfers, daily breakfast and the listed tours.",
        detail: "The Australian visa fee, travel insurance and optional activities are additional.",
      },
      {
        question: "Is this itinerary suitable for families with children?",
        answer:
          "Yes. The Gold Coast theme park day, the reef pontoon and Sydney's harbour ferries all work well for children aged five and up, and no day involves a long walk that cannot be shortened.",
      },
    ],
    faqs: [
      {
        question: "What happens if the reef trip is cancelled for weather?",
        answer:
          "Operators cancel outright rather than sail in unsafe conditions, and refund or reschedule. Because there are three nights in Cairns, there is a spare day to move it to — this is exactly why the itinerary is built with three nights there rather than two.",
      },
      {
        question: "Can we start from a different Indian city?",
        answer:
          "Yes. The package is quoted from your departure city — Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad and Pune are all routine. Fares vary by city, so the final quote will differ from the indicative starting price.",
      },
      {
        question: "Can the itinerary be shortened?",
        answer:
          "It can. The most common shortened version drops the Gold Coast and runs 10 days across Melbourne, Sydney and Cairns. Use 'Customise this trip' and we will re-quote.",
      },
      {
        question: "When should we apply for the visa?",
        answer:
          "At least six weeks before departure, and earlier in peak season. We review your documents before submission, but the decision and its timing rest entirely with the Department of Home Affairs, so we never book non-refundable travel before a grant.",
      },
    ],
    seo: seo(
      "13-Day Australia Itinerary: Melbourne, Sydney, Gold Coast & Cairns | Musafir Travels",
      "A 13-day Australia package covering Melbourne, Sydney, the Gold Coast and Cairns with the Great Ocean Road, Great Barrier Reef, Blue Mountains and Kuranda. Flights, hotels and visa support included.",
      "/packages/australia/melbourne-sydney-gold-coast-cairns",
      ["australia 13 day itinerary", "melbourne sydney cairns package", "australia package from india"],
    ),
  }),

  pkg({
    id: "pkg-au-east-coast-short",
    slug: "sydney-cairns-highlights",
    title: "Sydney & Cairns Highlights",
    destinationSlug: "australia",
    destinationName: "Australia",
    nights: 7,
    days: 8,
    hero: scene("city", "Sydney harbour seen from a headland"),
    summary:
      "The shortest Australia trip we think is worth taking: the harbour city and the reef, with nothing in between to dilute either.",
    cities: [
      { name: "Sydney", slug: "sydney", point: { x: 62, y: 71 }, nights: 4 },
      { name: "Cairns", slug: "cairns", point: { x: 60, y: 26 }, nights: 3 },
    ],
    styles: ["couple", "friends", "adventure"],
    hotelCategory: "4-star",
    startingPrice: inr(139000),
    pricing: pricing({ basePerAdult: 139000, baseHotelCategory: "4-star" }),
    highlights: [
      "Sydney Harbour cruise",
      "Blue Mountains day trip",
      "Great Barrier Reef outer-reef day",
      "Kuranda Scenic Railway and Skyrail",
    ],
    inclusions: [
      "Return international flights",
      "One internal flight: Sydney–Cairns",
      "7 nights in 4-star hotels on twin sharing",
      "Daily breakfast and 2 lunches",
      "All airport transfers",
      "Sydney Harbour cruise, Blue Mountains tour and Great Barrier Reef day cruise",
      "Australian visa application support",
    ],
    exclusions: [
      "Australian visa fee",
      "Travel insurance",
      "Meals not listed",
      "Optional activities",
      "Personal expenses and tips",
    ],
    bestMonths: ["mar", "apr", "may", "sep", "oct", "nov"],
    visaStatus: "e-visa",
    itinerary: [
      { day: 1, title: "India to Sydney", city: "In transit", leg: { from: "Delhi", to: "Sydney", mode: "flight", durationMins: 960 }, summary: "Overnight departure with one stop.", activities: [{ slot: "evening", title: "Departure" }], meals: ["none"] },
      { day: 2, title: "Arrive Sydney", city: "Sydney", leg: { from: "Sydney Airport", to: "Sydney CBD", mode: "transfer", durationMins: 30 }, summary: "Arrive, settle, and walk to Circular Quay for a first look at the harbour.", activities: [{ slot: "afternoon", title: "Check-in and Circular Quay walk", durationMins: 120 }], hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 4 }, meals: ["none"] },
      { day: 3, title: "Sydney harbour and Opera House", city: "Sydney", summary: "The Opera House in the morning and the harbour from the water at sunset.", activities: [{ slot: "morning", title: "Opera House guided tour", durationMins: 60 }, { slot: "evening", title: "Harbour sunset cruise", durationMins: 120, experienceSlug: "sydney-harbour-cruise" }], hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 4 }, meals: ["breakfast"] },
      { day: 4, title: "Blue Mountains", city: "Sydney", leg: { from: "Sydney", to: "Katoomba", mode: "train", durationMins: 120 }, summary: "A full day inland at Echo Point and Scenic World.", activities: [{ slot: "morning", title: "Rail to Katoomba", durationMins: 120, experienceSlug: "blue-mountains" }, { slot: "afternoon", title: "Three Sisters and Scenic World", durationMins: 210 }], hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 4 }, meals: ["breakfast", "lunch"] },
      { day: 5, title: "Sydney beaches at leisure", city: "Sydney", summary: "The Bondi-to-Coogee walk, or a ferry to Manly and back.", activities: [{ slot: "morning", title: "Bondi to Coogee coastal walk", durationMins: 180 }, { slot: "evening", title: "At leisure" }], hotel: { name: "4-star hotel, Sydney CBD", category: "4-star", nights: 4 }, meals: ["breakfast"] },
      { day: 6, title: "Sydney to Cairns", city: "Cairns", leg: { from: "Sydney", to: "Cairns", mode: "flight", durationMins: 180 }, summary: "North to the tropics, with the afternoon on the esplanade.", activities: [{ slot: "morning", title: "Flight to Cairns", durationMins: 180 }, { slot: "afternoon", title: "Cairns Esplanade and lagoon", durationMins: 120 }], hotel: { name: "4-star hotel, Cairns", category: "4-star", nights: 3 }, meals: ["breakfast"] },
      { day: 7, title: "Great Barrier Reef", city: "Cairns", leg: { from: "Cairns Marina", to: "Outer Reef", mode: "cruise", durationMins: 90 }, summary: "A full day at the outer reef with snorkelling and a semi-submersible.", activities: [{ slot: "morning", title: "Catamaran to the outer reef", durationMins: 90, experienceSlug: "great-barrier-reef" }, { slot: "afternoon", title: "Snorkelling and reef talk", durationMins: 300 }], hotel: { name: "4-star hotel, Cairns", category: "4-star", nights: 3 }, meals: ["breakfast", "lunch"] },
      { day: 8, title: "Kuranda and departure", city: "Cairns", leg: { from: "Cairns", to: "India", mode: "flight", durationMins: 960 }, summary: "Rainforest railway, cableway back, then the airport.", activities: [{ slot: "morning", title: "Kuranda Scenic Railway", durationMins: 105 }, { slot: "afternoon", title: "Skyrail return", durationMins: 120 }, { slot: "evening", title: "Departure" }], meals: ["breakfast"] },
    ],
    faqs: [
      {
        question: "Is eight days long enough for Australia?",
        answer:
          "For two cities, yes. It is not long enough for Melbourne as well — adding a third city to eight days means two of your days become airport days. If you have less than ten days, we would keep it to Sydney and Cairns.",
      },
    ],
    seo: seo(
      "8-Day Sydney & Cairns Package | Great Barrier Reef | Musafir Travels",
      "An 8-day Australia package covering Sydney and Cairns with a harbour cruise, the Blue Mountains, the Great Barrier Reef and Kuranda. Flights, hotels and visa support included.",
      "/packages/australia/sydney-cairns-highlights",
    ),
  }),
];
