import type { Experience } from "@/lib/types";
import { inr, scene, seo } from "./_builder";

/**
 * `filmWords` drives the horizontal "Adventures worth chasing" film section on
 * the homepage — three words that appear one per viewport as the reel scrolls.
 * Only experiences that carry them appear in that rail.
 */
export const experiences: Experience[] = [
  {
    id: "exp-gbr",
    slug: "great-barrier-reef",
    name: "Great Barrier Reef",
    destinationSlug: "australia",
    destinationName: "Australia",
    filmWords: ["CHASE", "THE", "UNKNOWN"],
    hero: scene("reef", "Coral bommies under clear shallow water"),
    summary:
      "The largest reef system on earth, reached in about ninety minutes by catamaran from Cairns. Outer-reef sites have better coral and far fewer boats than the inner reef.",
    body: "Day boats leave Cairns Marina between 8 and 8.30am and reach the outer reef by mid-morning. Most operators anchor at two sites and give you four to five hours in the water. If you are not a confident swimmer, choose a pontoon operator: they run semi-submersibles and glass-bottom boats, provide flotation vests as standard, and have a shallow enclosed lagoon. Stinger suits are provided from November to May and should be worn. Trips are cancelled outright in poor conditions rather than run in swell — which is why we build three nights in Cairns rather than two.",
    durationLabel: "Full day, 8–9 hours",
    bestMonths: ["may", "jun", "jul", "aug", "sep", "oct"],
    startingPrice: inr(9800),
    styles: ["adventure", "family", "couple"],
    faqs: [
      {
        question: "Can non-swimmers visit the reef?",
        answer:
          "Yes. Pontoon operators run semi-submersible and glass-bottom tours, provide flotation vests, and have guided snorkel lines held by an instructor. Tell us at booking and we will place you with an operator that runs all three.",
      },
      {
        question: "When is visibility best?",
        answer:
          "May to October, outside the wet season. Visibility drops noticeably after heavy summer rain runs off the coast.",
      },
    ],
    seo: seo(
      "Great Barrier Reef Day Trips from Cairns | Musafir Travels",
      "Outer-reef day trips from Cairns with snorkelling, semi-submersible tours and options for non-swimmers. Included in our Australia packages.",
      "/experiences/great-barrier-reef",
    ),
  },
  {
    id: "exp-gor",
    slug: "great-ocean-road",
    name: "Great Ocean Road",
    destinationSlug: "australia",
    destinationName: "Australia",
    filmWords: ["DRIVE", "THE", "EDGE"],
    hero: scene("beach", "Limestone stacks in the sea below cliffs"),
    summary:
      "A 240-kilometre coast road west of Melbourne ending at the Twelve Apostles. It is a full day, not a half day, and the light in the last two hours is the reason to go.",
    body: "Leave Melbourne by 7am. The road runs through Torquay and Lorne, cuts inland through the Otway rainforest for a short walk among tree ferns, and rejoins the coast at Apollo Bay for lunch. The limestone formations — the Twelve Apostles, Loch Ard Gorge, London Arch — come in the last stretch, which is why an anticlockwise itinerary that arrives there late is worth more than one that races to them by noon. You return to Melbourne after dark.",
    durationLabel: "Full day, 12 hours",
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar"],
    styles: ["adventure", "couple", "family"],
    faqs: [],
    seo: seo(
      "Great Ocean Road Day Tour from Melbourne | Musafir Travels",
      "A full-day Great Ocean Road tour from Melbourne covering the Otway rainforest, Apollo Bay and the Twelve Apostles in late-afternoon light.",
      "/experiences/great-ocean-road",
    ),
  },
  {
    id: "exp-northern-lights",
    slug: "northern-lights",
    name: "Northern Lights",
    destinationSlug: "switzerland",
    destinationName: "Scandinavia",
    filmWords: ["WAIT", "FOR", "GREEN"],
    hero: scene("aurora", "Green aurora over a dark ridge line"),
    summary:
      "An aurora trip is a probability, not a booking. Three clear nights above the Arctic Circle between September and March gives you a genuinely good chance — and no honest operator will promise more than that.",
    body: "The aurora needs three things at once: solar activity, darkness and a clear sky. You control only the last two, by going far enough north between late September and late March and by staying at least three nights. Chase tours drive to wherever the cloud has broken, which materially improves the odds over sitting at a fixed hotel. Anyone selling you a guaranteed sighting is selling you something they cannot deliver.",
    durationLabel: "3–4 nights minimum",
    bestMonths: ["sep", "oct", "nov", "dec", "jan", "feb", "mar"],
    styles: ["adventure", "couple", "winter"],
    faqs: [
      {
        question: "Can you guarantee we will see the aurora?",
        answer:
          "No, and we will not pretend otherwise. What we can do is put you in the right latitude for enough consecutive nights, on chase tours that move to clear sky, which is the only thing that actually changes the odds.",
      },
    ],
    seo: seo(
      "Northern Lights Trips | Musafir Travels",
      "Aurora trips planned for the highest realistic chance of a sighting — right latitude, right season, enough consecutive nights and chase tours that follow clear sky.",
      "/experiences/northern-lights",
    ),
  },
  {
    id: "exp-desert-safari-dubai",
    slug: "desert-safari-dubai",
    name: "Dubai Desert Safari",
    destinationSlug: "dubai",
    destinationName: "Dubai",
    filmWords: ["INTO", "THE", "DUNES"],
    hero: scene("desert", "Dune ridges at sunset with vehicle tracks"),
    summary:
      "An afternoon in the dunes ending with dinner and a show under the sky. The dune-driving segment is optional — say so at booking and you go straight to camp.",
    body: "Pick-up is between 3 and 3.30pm. The convoy deflates tyres at the edge of the reserve, runs about twenty minutes of dune driving, stops for sunset photographs, then continues to a camp for a barbecue dinner with tanoura and belly-dance performances. Camel rides, sandboarding and henna are usually included. The dune-driving portion is genuinely rough and is not suitable for elderly travellers, pregnant travellers, anyone with back or neck problems, or anyone prone to motion sickness — all of whom can be transferred directly to camp at no extra cost.",
    durationLabel: "6 hours, afternoon to late evening",
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar", "apr"],
    startingPrice: inr(2800),
    styles: ["family", "friends", "adventure"],
    faqs: [
      {
        question: "Can we skip the dune bashing?",
        answer:
          "Yes, at no additional cost. Tell us at booking and you are transferred directly to the desert camp for the sunset, dinner and performances.",
      },
    ],
    seo: seo(
      "Dubai Desert Safari with Dinner | Musafir Travels",
      "An evening desert safari from Dubai with dune driving, sunset in the dunes, a barbecue dinner and live performances. No-dune-bashing option available.",
      "/experiences/desert-safari-dubai",
    ),
  },
  {
    id: "exp-alleppey-houseboat",
    slug: "alleppey-houseboat",
    name: "Alleppey Houseboat",
    destinationSlug: "kerala",
    destinationName: "Kerala",
    filmWords: ["DRIFT", "GOING", "NOWHERE"],
    hero: scene("backwater", "A houseboat moving through narrow green channels"),
    summary:
      "A converted rice barge with a cook aboard, cruising the Vembanad backwaters from early afternoon until it moors at dusk. One night is enough; two is mostly the same night twice.",
    body: "Board at Alleppey between noon and 1pm. The boat cruises the wide lake and the narrower village channels through the afternoon, with lunch served on board. Houseboats are not permitted to move after dark, so it moors near a village for the night, and starts again after breakfast. A private one-bedroom boat costs slightly more than a shared cabin and is a completely different experience — you get the deck to yourselves, which is most of the point. Every boat we use is government-classified with a working generator, mosquito screens and an on-board cook.",
    durationLabel: "Overnight, board 12pm, disembark 9am",
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar"],
    startingPrice: inr(6800),
    styles: ["honeymoon", "couple", "family", "senior-friendly"],
    faqs: [
      {
        question: "Do houseboats cruise at night?",
        answer:
          "No. They are required to moor by sunset for safety. The cruising happens between early afternoon and dusk, which is why boarding on time matters more than most people expect.",
      },
    ],
    seo: seo(
      "Alleppey Houseboat Stay | Kerala Backwaters | Musafir Travels",
      "Overnight private houseboat stays on the Alleppey backwaters with an on-board cook, all meals and government-classified boats.",
      "/experiences/alleppey-houseboat",
    ),
  },
  {
    id: "exp-pangong",
    slug: "pangong-tso",
    name: "Pangong Tso",
    destinationSlug: "ladakh",
    destinationName: "Ladakh",
    filmWords: ["FOUR", "SHADES", "BLUE"],
    hero: scene("mountain", "A long high-altitude lake between bare ridges"),
    summary:
      "A 130-kilometre lake at 4,350 metres that changes colour through the day. Reachable only after proper acclimatisation, and considerably better with a night on its shore.",
    body: "Pangong sits above 4,300 metres, and getting there means crossing Chang La at 5,360. Neither is safe on day two of a Ladakh trip. With two acclimatisation days behind you, the lake is straightforward — a long drive on rough road, then a shore that shifts from grey to turquoise to deep indigo as the sun moves. Camps on the shore are basic by design; the reason to stay is that sunrise here is quieter and better than anything the day-trippers see.",
    durationLabel: "Overnight from Leh or Nubra",
    bestMonths: ["may", "jun", "jul", "aug", "sep"],
    styles: ["adventure", "friends", "solo"],
    faqs: [],
    seo: seo(
      "Pangong Tso | Ladakh | Musafir Travels",
      "Pangong Tso overnight stays with properly paced acclimatisation, inner line permits and oxygen support, as part of our Ladakh itineraries.",
      "/experiences/pangong-tso",
    ),
  },
  {
    id: "exp-phi-phi",
    slug: "phi-phi-island-hopping",
    name: "Phi Phi Island Hopping",
    destinationSlug: "thailand",
    destinationName: "Thailand",
    filmWords: ["FIND", "THE", "LAGOON"],
    hero: scene("island", "Limestone cliffs above a shallow lagoon"),
    summary:
      "A full day among the Phi Phi islands — Maya Bay, Pileh Lagoon, Viking Cave and two snorkelling stops. Take the catamaran rather than the speedboat if anyone gets seasick.",
    body: "Boats leave Phuket around 8am and return by 5pm. Maya Bay has visitor caps and timed entry, so operators run a fixed sequence; the lagoons and snorkelling stops in between are the better part of the day anyway. National park entry fees are collected separately at the pier and are not included by any operator. Speedboats bounce badly in swell — the large catamaran costs slightly more and is a different day entirely in rough water.",
    durationLabel: "Full day, 9 hours",
    bestMonths: ["nov", "dec", "jan", "feb", "mar", "apr"],
    startingPrice: inr(3400),
    styles: ["friends", "couple", "family", "beach"],
    faqs: [],
    seo: seo(
      "Phi Phi Islands Day Trip from Phuket | Musafir Travels",
      "A full-day Phi Phi Islands trip from Phuket covering Maya Bay, Pileh Lagoon and snorkelling stops, with catamaran and speedboat options.",
      "/experiences/phi-phi-island-hopping",
    ),
  },
  {
    id: "exp-jungfraujoch",
    slug: "jungfraujoch",
    name: "Jungfraujoch — Top of Europe",
    destinationSlug: "switzerland",
    destinationName: "Switzerland",
    filmWords: ["ABOVE", "THE", "CLOUD"],
    hero: scene("snow", "A snow saddle between high peaks above cloud"),
    summary:
      "A cogwheel railway to 3,454 metres, most of it inside the mountain. The most expensive single excursion in Switzerland and, on a clear day, the one worth it.",
    body: "From Interlaken the journey runs via Grindelwald or Lauterbrunnen to Kleine Scheidegg, where the Jungfrau Railway climbs a tunnel bored through the Eiger and the Mönch. At the top there is an observation terrace, an ice palace cut into the glacier, and a plateau you can walk out onto. Allow a full day. Check the summit webcam the evening before: in cloud you are paying a great deal to stand in a white room, and moving the excursion by a day costs nothing if you have the flexibility built in.",
    durationLabel: "Full day, 8–9 hours",
    bestMonths: ["may", "jun", "jul", "aug", "sep", "dec", "jan"],
    startingPrice: inr(19500),
    styles: ["family", "couple", "luxury", "winter"],
    faqs: [],
    seo: seo(
      "Jungfraujoch Top of Europe Excursion | Musafir Travels",
      "The Jungfraujoch cogwheel railway excursion from Interlaken — Sphinx observatory, the Ice Palace and the Aletsch glacier at 3,454 metres.",
      "/experiences/jungfraujoch",
    ),
  },
  {
    id: "exp-living-root-bridge",
    slug: "living-root-bridge-trek",
    name: "Nongriat Living Root Bridge",
    destinationSlug: "meghalaya",
    destinationName: "Meghalaya",
    filmWords: ["THREE", "THOUSAND", "STEPS"],
    hero: scene("forest", "A root bridge spanning a clear river in dense forest"),
    summary:
      "A double-decker bridge grown from ficus roots over generations, at the bottom of roughly 3,000 steps. Genuinely difficult, and genuinely unlike anything else.",
    body: "The trail from Tyrna descends about 2,400 steps to the river, crosses two steel suspension bridges, then climbs to Nongriat village and the double-decker root bridge. Five to six hours round trip for most people, and the climb back out is sustained. There are no shortcuts and no vehicle access. If knees are a concern, the single-decker bridge at Mawlynnong is a fifteen-minute walk on level ground and shows you the same thing — we will suggest it rather than let you find out halfway down.",
    durationLabel: "5–6 hours, strenuous",
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar"],
    startingPrice: inr(2600),
    styles: ["adventure", "solo", "friends"],
    faqs: [
      {
        question: "How difficult is it really?",
        answer:
          "Hard. Around 3,000 uneven steps down and the same back up, with no vehicle access and no way to bail out midway. Reasonably fit walkers manage it comfortably; anyone with knee or heart problems should not attempt it.",
      },
    ],
    seo: seo(
      "Living Root Bridge Trek, Nongriat | Meghalaya | Musafir Travels",
      "The Nongriat double-decker living root bridge trek in Meghalaya — route, difficulty and an easier alternative at Mawlynnong.",
      "/experiences/living-root-bridge-trek",
    ),
  },
  {
    id: "exp-uluwatu",
    slug: "uluwatu-kecak-sunset",
    name: "Uluwatu Temple & Kecak at Sunset",
    destinationSlug: "bali",
    destinationName: "Bali",
    hero: scene("beach", "A cliff temple silhouetted against a setting sun"),
    summary:
      "A sea temple on a seventy-metre cliff, and a fire dance performed in an open amphitheatre as the sun goes down behind it. Book the 6pm slot.",
    body: "Arrive by 5pm to walk the clifftop path before the performance. The Kecak is chanted by around seventy men with no instruments at all, staged so the sun sets directly behind the performers. Sarongs are provided at the entrance. The macaques here are practised thieves — sunglasses, phones and loose jewellery should be put away before you enter, not after.",
    durationLabel: "3 hours, late afternoon",
    bestMonths: ["apr", "may", "jun", "jul", "aug", "sep", "oct"],
    startingPrice: inr(1900),
    styles: ["honeymoon", "couple", "cultural"],
    faqs: [],
    seo: seo(
      "Uluwatu Temple & Kecak Dance at Sunset | Bali | Musafir Travels",
      "The Uluwatu clifftop sea temple and the Kecak fire dance at sunset, included in our Bali honeymoon itineraries.",
      "/experiences/uluwatu-kecak-sunset",
    ),
  },
  {
    id: "exp-dal-lake",
    slug: "dal-lake-shikara",
    name: "Dal Lake at First Light",
    destinationSlug: "kashmir",
    destinationName: "Kashmir",
    filmWords: ["WAKE", "ON", "WATER"],
    hero: scene("mountain", "Wooden boats on still water in early mist"),
    summary:
      "The floating vegetable market at Dal Lake trades before sunrise and is finished by seven. It is the reason to spend a night on a houseboat rather than in a hotel.",
    body: "A shikara collects you from the houseboat around 5am. The market itself is a loose gathering of shikaras trading produce grown on the lake's floating gardens, and it is genuinely a working market rather than a performance. Afterwards the boatman usually loops through the lotus gardens, which flower from July into August. Take a blanket — even in June, the water at that hour is cold.",
    durationLabel: "2 hours, pre-dawn",
    bestMonths: ["apr", "may", "jun", "jul", "aug", "sep"],
    styles: ["couple", "family", "cultural"],
    faqs: [],
    seo: seo(
      "Dal Lake Shikara & Floating Market | Srinagar | Musafir Travels",
      "The pre-dawn shikara ride to Dal Lake's floating vegetable market in Srinagar, included with houseboat stays in our Kashmir itineraries.",
      "/experiences/dal-lake-shikara",
    ),
  },
  {
    id: "exp-radhanagar",
    slug: "radhanagar-beach",
    name: "Radhanagar Beach",
    destinationSlug: "andaman",
    destinationName: "Andaman Islands",
    filmWords: ["SAND", "GOES", "WHITE"],
    hero: scene("beach", "A wide white beach curving into turquoise shallows"),
    summary:
      "Two kilometres of white sand on the west side of Havelock, backed by forest and facing the sunset. Consistently ranked among Asia's best beaches, and for once the ranking is right.",
    body: "Radhanagar is a fifteen-minute drive across Havelock from the jetty. The sand is genuinely white and the shelf is shallow a long way out, which makes it good for wading and poor for snorkelling — go to Elephant Beach for coral. Lifeguards operate until dusk and swimming is restricted after that. There is a single food stall and no resorts on the beach itself, which is precisely why it still looks the way it does.",
    durationLabel: "Half day",
    bestMonths: ["nov", "dec", "jan", "feb", "mar", "apr"],
    styles: ["honeymoon", "couple", "family", "beach"],
    faqs: [],
    seo: seo(
      "Radhanagar Beach, Havelock | Andaman Islands | Musafir Travels",
      "Radhanagar Beach on Havelock Island — what to expect, when to go and how it fits into our Andaman itineraries.",
      "/experiences/radhanagar-beach",
    ),
  },
];
