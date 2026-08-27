import type { Destination } from "@/lib/types";
import { destination, inr, scene, seo } from "./_builder";

/**
 * Domestic records carry no visa block — the UI keys off `domestic` to skip the
 * visa module entirely rather than rendering an empty one.
 */
export const domesticDestinations: Destination[] = [
  destination({
    id: "dst-kashmir",
    slug: "kashmir",
    name: "Kashmir",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "The valley does not need editing.",
    intro:
      "Kashmir is the rare Indian destination that delivers exactly the image you arrive with — chinar trees, a lake with wooden houseboats on it, and meadows that run up into snow. The valley is compact, so a week covers Srinagar, Gulmarg, Pahalgam and Sonmarg comfortably, with the Mughal gardens as an easy first afternoon.",
    hero: scene("mountain", "A still lake beneath snow-lined mountains"),
    gallery: [
      scene("mountain", "Meadows running up to a snow line"),
      scene("snow", "A gondola rising over snow-covered pine"),
    ],
    stats: [
      { label: "Ideal duration", value: "5–7 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Mar – Oct, Dec – Feb for snow" },
      { label: "From", value: "₹24,500", numeric: 24500, prefix: "₹" },
      { label: "Trip styles", value: "Family · Honeymoon · Winter" },
    ],
    idealDurationDays: [5, 7],
    startingPrice: inr(24500),
    bestMonths: ["mar", "apr", "may", "jun", "sep", "oct", "dec", "jan"],
    styles: ["family", "honeymoon", "couple", "winter", "senior-friendly", "adventure"],
    cities: [
      { name: "Srinagar", slug: "srinagar", point: { x: 44, y: 42 }, nights: 3, blurb: "Dal Lake, the Mughal gardens and a night on a houseboat." },
      { name: "Gulmarg", slug: "gulmarg", point: { x: 30, y: 36 }, nights: 1, blurb: "The gondola, and snow well into spring." },
      { name: "Pahalgam", slug: "pahalgam", point: { x: 62, y: 58 }, nights: 2, blurb: "Betaab Valley, Aru and the Lidder river." },
      { name: "Sonmarg", slug: "sonmarg", point: { x: 66, y: 26 }, nights: 0, blurb: "Thajiwas glacier — usually visited as a day trip." },
    ],
    highlights: [
      "A night on a Dal Lake houseboat",
      "Gulmarg Gondola to Apharwat",
      "Betaab and Aru valleys near Pahalgam",
      "The Mughal gardens — Nishat, Shalimar and Chashme Shahi",
      "Shikara ride at first light",
    ],
    whyPoints: [
      {
        title: "The most scenery per kilometre in India",
        body: "Four completely different landscapes sit within two hours of Srinagar. No internal flights, no long transfers.",
      },
      {
        title: "It works in every season",
        body: "Tulips in April, meadows through summer, chinar colour in October and reliable snow from late December. The same route gives four different holidays.",
      },
      {
        title: "Easy on older travellers",
        body: "Most viewpoints are reached by road or gondola, and Srinagar sits at a modest altitude, unlike Ladakh.",
      },
    ],
    experiences: ["dal-lake-shikara", "gulmarg-gondola"],
    travelTips: [
      "Book the Gulmarg Gondola phase tickets in advance in peak season; on-the-day queues can take hours.",
      "Carry layers even in summer — evenings in Pahalgam and Gulmarg drop sharply.",
      "Local taxi unions operate fixed-rate stands at each town; your package driver may not be permitted to run the local sightseeing legs.",
      "Mobile connectivity is patchy outside Srinagar — download offline maps beforehand.",
      "Check the current advisory position before finalising travel dates.",
    ],
    howToReach:
      "Direct flights to Srinagar (SXR) from Delhi in about 1.5 hours, with one-stop connections from other metros. Everything in the valley is a 1.5–3 hour road transfer from Srinagar.",
    budgetGuide: [
      { label: "Comfortable 3/4-star", range: "₹24,500 – ₹38,000 per person", note: "6 days, twin sharing, hotels, houseboat night, transfers and breakfast." },
      { label: "Premium / luxury houseboat", range: "₹45,000 – ₹70,000 per person" },
    ],
    answers: [
      {
        question: "How many days do you need in Kashmir?",
        answer:
          "Five to seven days. Six days covers Srinagar, Gulmarg, Pahalgam and a Sonmarg day trip at a comfortable pace, including a houseboat night on Dal Lake.",
      },
      {
        question: "What does a Kashmir trip cost?",
        answer:
          "A 6-day Kashmir package typically starts around ₹24,500 per person on twin sharing with 3 or 4-star hotels, a houseboat night, all transfers and daily breakfast. Flights are additional unless included.",
      },
      {
        question: "When is the best time to visit Kashmir?",
        answer:
          "March to October for gardens, meadows and open passes — with the tulip garden in April and chinar colour in October. Late December to February for snow in Gulmarg.",
      },
      {
        question: "Is Kashmir suitable for elderly parents?",
        answer:
          "Yes. Srinagar is at a moderate altitude, transfers are short, and the main viewpoints are reached by road or gondola rather than on foot — unlike Ladakh, which needs acclimatisation.",
      },
    ],
    faqs: [
      {
        question: "Will we definitely see snow?",
        answer:
          "In Gulmarg from late December through February, snow is reliable at the upper gondola phase. Outside those months it depends entirely on the year, and we will not promise it.",
      },
      {
        question: "Is a houseboat stay worth it?",
        answer:
          "For one night, yes — it is the thing people remember. For a whole trip, less so; the rooms are atmospheric but the facilities are more limited than a hotel, so we usually split the nights.",
      },
    ],
    seo: seo(
      "Kashmir Tour Packages | Srinagar, Gulmarg & Pahalgam | Musafir Travels",
      "Kashmir holiday packages covering Srinagar, Gulmarg, Pahalgam and Sonmarg with Dal Lake houseboat stays, gondola tickets and all transfers.",
      "/destinations/kashmir",
      ["kashmir tour package", "srinagar gulmarg pahalgam package", "kashmir trip cost"],
    ),
    weight: 94,
  }),

  destination({
    id: "dst-kerala",
    slug: "kerala",
    name: "Kerala",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "Slow, on purpose.",
    intro:
      "Kerala is best travelled as a descent — tea hills at Munnar, then the wildlife at Thekkady, then down to the backwaters at Alleppey and finally the sea. Each stop is two or three hours from the last, the roads are good, and the pace is the point. It remains the most reliable domestic honeymoon in the country.",
    hero: scene("backwater", "Palm-lined backwater channels at golden hour"),
    gallery: [
      scene("forest", "Tea terraces in the Western Ghats"),
      scene("backwater", "A houseboat on a still backwater"),
    ],
    stats: [
      { label: "Ideal duration", value: "5–8 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Oct – Mar" },
      { label: "From", value: "₹21,000", numeric: 21000, prefix: "₹" },
      { label: "Trip styles", value: "Honeymoon · Family · Senior-friendly" },
    ],
    idealDurationDays: [5, 8],
    startingPrice: inr(21000),
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar"],
    styles: ["honeymoon", "couple", "family", "senior-friendly", "wildlife", "cultural"],
    cities: [
      { name: "Munnar", slug: "munnar", point: { x: 52, y: 34 }, nights: 2, blurb: "Tea estates, Eravikulam and cool nights." },
      { name: "Thekkady", slug: "thekkady", point: { x: 62, y: 50 }, nights: 1, blurb: "Periyar reserve and spice plantations." },
      { name: "Alleppey", slug: "alleppey", point: { x: 34, y: 62 }, nights: 1, blurb: "Overnight houseboat through the backwaters." },
      { name: "Kochi", slug: "kochi", point: { x: 30, y: 40 }, nights: 2, blurb: "Fort Kochi, Chinese fishing nets and Kathakali." },
    ],
    highlights: [
      "An overnight houseboat from Alleppey",
      "Tea estate walk and museum at Munnar",
      "Periyar boat safari at dawn",
      "Fort Kochi on foot at sunset",
      "A Kathakali performance with the make-up session beforehand",
    ],
    whyPoints: [
      {
        title: "Four landscapes in five days without a flight",
        body: "Hills, forest, backwater and coast are all within a few hours of each other on good roads.",
      },
      {
        title: "The gentlest itinerary we sell",
        body: "Short drives, no altitude, no walking-heavy days. It is our most common recommendation for travellers with parents.",
      },
      {
        title: "Ayurveda that is actually regulated",
        body: "Kerala's classified Ayurveda centres are a genuine draw, not a spa add-on. We book only government-classified properties.",
      },
    ],
    experiences: ["alleppey-houseboat", "periyar-boat-safari"],
    travelTips: [
      "The overnight houseboat moors at dusk — the cruising happens in daylight, so board by early afternoon.",
      "Munnar's Eravikulam National Park closes for calving season, usually around February to March.",
      "Roads are winding rather than long; anyone prone to motion sickness should sit at the front.",
      "Monsoon, June to September, is beautiful but limits boat trips and hill visibility.",
    ],
    howToReach:
      "Fly into Kochi (COK) for the northern loop or Thiruvananthapuram (TRV) for the south. Munnar is a 4-hour drive from Kochi; the rest of the circuit is 2–3 hours between stops.",
    budgetGuide: [
      { label: "Comfortable 3/4-star", range: "₹21,000 – ₹34,000 per person", note: "6 days, twin sharing, hotels, houseboat, car with driver and breakfast." },
      { label: "Premium / heritage", range: "₹45,000 – ₹75,000 per person" },
    ],
    answers: [
      {
        question: "How many days do you need in Kerala?",
        answer:
          "Five to eight days. Six days covers Munnar, Thekkady, an Alleppey houseboat night and Kochi, with drives of two to four hours between stops.",
      },
      {
        question: "What does a Kerala trip cost?",
        answer:
          "A 6-day Kerala package typically starts around ₹21,000 per person on twin sharing with 3 or 4-star hotels, one houseboat night, a private car with driver and daily breakfast.",
      },
      {
        question: "When is the best time to visit Kerala?",
        answer:
          "October to March, when the humidity drops and the backwaters and hill stations are both comfortable. June to September is the monsoon — atmospheric, but boat trips and hill views are unreliable.",
      },
      {
        question: "Is Kerala good for a honeymoon?",
        answer:
          "It is the most-booked domestic honeymoon we design. A private houseboat night, a tea-estate stay and a beach finish at Kovalam or Marari make a complete week without a single flight between stops.",
      },
    ],
    faqs: [
      {
        question: "Private houseboat or shared?",
        answer:
          "Private, for a honeymoon. Shared boats are cheaper but you lose the deck to strangers, which is most of the appeal. A one-bedroom private boat is usually a small step up in price.",
      },
      {
        question: "Is one night on a houseboat enough?",
        answer:
          "Yes. The boat moors at sunset and cannot cruise after dark, so a second night adds cost without adding much experience.",
      },
    ],
    seo: seo(
      "Kerala Tour Packages | Munnar, Thekkady & Alleppey | Musafir Travels",
      "Kerala holiday and honeymoon packages covering Munnar tea estates, Periyar, an Alleppey houseboat night and Fort Kochi, with a private car and driver throughout.",
      "/destinations/kerala",
      ["kerala tour package", "kerala honeymoon package", "alleppey houseboat package"],
    ),
    weight: 91,
  }),

  destination({
    id: "dst-ladakh",
    slug: "ladakh",
    name: "Ladakh",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "Thin air, enormous country.",
    intro:
      "Ladakh is the most demanding domestic destination we sell and the one people talk about longest afterwards. High-altitude desert, monasteries on cliffs, and lakes at 4,500 metres that change colour through the day. The itinerary has to be built around acclimatisation, not around sights — which is precisely where most trips go wrong.",
    hero: scene("mountain", "A high-altitude lake between bare mountain ridges"),
    gallery: [scene("desert", "Barren high-altitude ridges under deep blue sky")],
    stats: [
      { label: "Ideal duration", value: "6–9 days", numeric: 7, suffix: " days" },
      { label: "Best season", value: "May – Sep" },
      { label: "From", value: "₹32,000", numeric: 32000, prefix: "₹" },
      { label: "Trip styles", value: "Adventure · Friends · Solo" },
    ],
    idealDurationDays: [6, 9],
    startingPrice: inr(32000),
    bestMonths: ["may", "jun", "jul", "aug", "sep"],
    styles: ["adventure", "friends", "solo", "couple"],
    cities: [
      { name: "Leh", slug: "leh", point: { x: 40, y: 40 }, nights: 3, blurb: "Base for acclimatisation, Shanti Stupa and the old town." },
      { name: "Nubra Valley", slug: "nubra-valley", point: { x: 46, y: 20 }, nights: 1, blurb: "Sand dunes at altitude via Khardung La." },
      { name: "Pangong Tso", slug: "pangong-tso", point: { x: 72, y: 46 }, nights: 1, blurb: "The lake, best seen with an overnight stay." },
    ],
    highlights: [
      "Pangong Tso at sunrise",
      "Khardung La and the descent into Nubra",
      "Thiksey and Hemis monasteries",
      "Magnetic Hill and the Indus–Zanskar confluence",
      "Leh old town and Shanti Stupa at sunset",
    ],
    whyPoints: [
      {
        title: "Landscape you cannot see anywhere else in India",
        body: "High-altitude cold desert with 6,000-metre ridges on both sides of the road. Photographs consistently undersell it.",
      },
      {
        title: "Acclimatisation is the itinerary",
        body: "We build in two full days in Leh before any high pass. Trips that skip this are the ones that end early in a hospital.",
      },
    ],
    experiences: ["pangong-tso", "khardung-la"],
    travelTips: [
      "Spend the first 48 hours in Leh with no exertion. This is not optional; altitude sickness at 3,500 metres is common and can be serious.",
      "Inner Line Permits are required for Nubra, Pangong and Tso Moriri. We arrange these, but they need your ID in advance.",
      "Fly in rather than drive if you have less than eight days; the Manali and Srinagar road approaches each need two days.",
      "Anyone with a heart or respiratory condition should get medical clearance before booking.",
      "Cash matters — ATMs in Leh run dry and there is none beyond it.",
    ],
    howToReach:
      "Direct flights to Leh (IXL) from Delhi in about 1.5 hours, all morning departures. Road access via Manali or Srinagar opens roughly May to October depending on snow clearance.",
    budgetGuide: [
      { label: "Comfortable 3-star", range: "₹32,000 – ₹48,000 per person", note: "7 days, twin sharing, hotels and camps, permits, and a private vehicle." },
      { label: "Premium camps", range: "₹58,000 – ₹85,000 per person" },
    ],
    answers: [
      {
        question: "How many days do you need in Ladakh?",
        answer:
          "Six to nine days, of which the first two must be spent acclimatising in Leh without climbing higher. Seven days is the practical minimum for Leh, Nubra and Pangong.",
      },
      {
        question: "What does a Ladakh trip cost?",
        answer:
          "A 7-day Ladakh package typically starts around ₹32,000 per person on twin sharing with hotels in Leh, camps in Nubra and Pangong, inner line permits, oxygen support and a private vehicle.",
      },
      {
        question: "When is the best time to visit Ladakh?",
        answer:
          "May to September. The passes to Nubra and Pangong are typically open through this window, and road access from Manali and Srinagar is possible. Winter travel is for frozen-river treks only and needs specialist support.",
      },
      {
        question: "Is Ladakh safe at altitude?",
        answer:
          "It is safe with a properly paced itinerary. Leh sits at about 3,500 metres and Khardung La is above 5,300, so the first two days must be spent acclimatising. Travellers with heart or respiratory conditions should get medical clearance first.",
      },
    ],
    faqs: [
      {
        question: "Can we do Ladakh with young children or elderly parents?",
        answer:
          "We generally advise against it. Altitude affects both groups disproportionately, and medical facilities beyond Leh are minimal. Kashmir or Sikkim delivers comparable mountain scenery at a fraction of the altitude.",
      },
      {
        question: "Is one night at Pangong worth it over a day trip?",
        answer:
          "Yes, if your acclimatisation is going well. The lake changes colour through the day and the day-trip version means five hours of driving for ninety minutes at the shore.",
      },
    ],
    seo: seo(
      "Ladakh Tour Packages | Leh, Nubra & Pangong | Musafir Travels",
      "Ladakh holiday packages with properly paced acclimatisation, Leh, Nubra Valley and Pangong Tso, inner line permits, oxygen support and a private vehicle throughout.",
      "/destinations/ladakh",
      ["ladakh tour package", "leh ladakh trip cost", "pangong tso package"],
    ),
    weight: 82,
  }),

  destination({
    id: "dst-rajasthan",
    slug: "rajasthan",
    name: "Rajasthan",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "Every wall has a date on it.",
    intro:
      "Rajasthan is a route between forts, and the pleasure is in the driving as much as the arriving. Jaipur, Jodhpur, Udaipur and Jaisalmer each look and feel different, and heritage hotels here are genuinely heritage — palaces and havelis still run by the families who built them. Winter is the only sensible season.",
    hero: scene("heritage", "A sandstone fort wall above a desert town"),
    gallery: [scene("desert", "Dunes at sunset with camel silhouettes")],
    stats: [
      { label: "Ideal duration", value: "7–10 days", numeric: 8, suffix: " days" },
      { label: "Best season", value: "Oct – Mar" },
      { label: "From", value: "₹26,000", numeric: 26000, prefix: "₹" },
      { label: "Trip styles", value: "Culture · Family · Luxury" },
    ],
    idealDurationDays: [7, 10],
    startingPrice: inr(26000),
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar"],
    styles: ["cultural", "family", "luxury", "couple", "honeymoon"],
    cities: [
      { name: "Jaipur", slug: "jaipur", point: { x: 62, y: 46 }, nights: 2 },
      { name: "Jodhpur", slug: "jodhpur", point: { x: 34, y: 52 }, nights: 2 },
      { name: "Jaisalmer", slug: "jaisalmer", point: { x: 16, y: 42 }, nights: 2 },
      { name: "Udaipur", slug: "udaipur", point: { x: 40, y: 74 }, nights: 2 },
    ],
    highlights: [
      "Amber Fort at opening time",
      "Mehrangarh, the best-presented fort in India",
      "A night in the Thar dunes near Jaisalmer",
      "Lake Pichola at sunset",
      "The stepwell at Abhaneri en route to Jaipur",
    ],
    whyPoints: [
      {
        title: "Heritage hotels that are actually heritage",
        body: "Palaces and havelis still owned by the families who built them. Staying in one is the trip, not an upgrade to it.",
      },
      {
        title: "Four cities that look nothing like each other",
        body: "Pink, blue, gold and white — the colour scheme of each city is genuinely distinct, and so is the food.",
      },
    ],
    experiences: ["thar-desert-camp", "mehrangarh-fort"],
    travelTips: [
      "April to June is punishing — daytime temperatures regularly exceed 45°C.",
      "Drives between cities are 4–6 hours; break them with a stop rather than pushing through.",
      "Fort visits are best at opening or in the last hour before closing, both for light and for crowds.",
      "Buy from government emporiums or established shops; commission-driven detours are the standard hazard on this circuit.",
    ],
    howToReach:
      "Fly into Jaipur (JAI) or Udaipur (UDR) and travel by road between cities, or take the overnight train between Jaipur and Jaisalmer to save a driving day.",
    budgetGuide: [
      { label: "Comfortable 3/4-star", range: "₹26,000 – ₹42,000 per person" },
      { label: "Heritage & palace hotels", range: "₹65,000 – ₹1,60,000 per person" },
    ],
    answers: [
      {
        question: "How many days do you need in Rajasthan?",
        answer:
          "Seven to ten days for the classic Jaipur–Jodhpur–Jaisalmer–Udaipur circuit. A five-day trip should cover two cities, not four.",
      },
      {
        question: "What does a Rajasthan trip cost?",
        answer:
          "An 8-day Rajasthan package typically starts around ₹26,000 per person on twin sharing with 3 or 4-star hotels, a private car with driver and daily breakfast. Heritage and palace stays start closer to ₹65,000 per person.",
      },
      {
        question: "When is the best time to visit Rajasthan?",
        answer:
          "October to March. November to February is the most comfortable window, with cool days and cold desert nights. Avoid April to June, when temperatures regularly exceed 45°C.",
      },
    ],
    faqs: [
      {
        question: "Is a desert night in Jaisalmer worth it?",
        answer:
          "In a proper camp at Sam or Khuri, yes — the sky at night is the reason to go. Avoid the cheapest camps, which are large, loud and close to the road.",
      },
    ],
    seo: seo(
      "Rajasthan Tour Packages | Jaipur, Jodhpur, Jaisalmer & Udaipur | Musafir Travels",
      "Rajasthan holiday packages covering Jaipur, Jodhpur, Jaisalmer and Udaipur with heritage hotel options, a desert camp night and a private car and driver.",
      "/destinations/rajasthan",
      ["rajasthan tour package", "jaipur jodhpur udaipur package", "rajasthan heritage hotels"],
    ),
    weight: 80,
  }),

  destination({
    id: "dst-meghalaya",
    slug: "meghalaya",
    name: "Meghalaya",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "Water, everywhere, going down.",
    intro:
      "Meghalaya is India's most underrated landscape — living root bridges grown over generations, canyons that fill with cloud by mid-morning, and river water so clear the boats look suspended. It rewards travellers willing to walk; the best of it is at the bottom of a lot of steps.",
    hero: scene("forest", "A forested canyon with waterfalls falling into cloud"),
    gallery: [scene("forest", "A living root bridge over a clear river")],
    stats: [
      { label: "Ideal duration", value: "5–7 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Oct – Apr" },
      { label: "From", value: "₹23,000", numeric: 23000, prefix: "₹" },
      { label: "Trip styles", value: "Adventure · Friends · Nature" },
    ],
    idealDurationDays: [5, 7],
    startingPrice: inr(23000),
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar", "apr"],
    styles: ["adventure", "friends", "solo", "couple", "wildlife"],
    cities: [
      { name: "Shillong", slug: "shillong", point: { x: 44, y: 44 }, nights: 2 },
      { name: "Cherrapunji", slug: "cherrapunji", point: { x: 40, y: 62 }, nights: 2 },
      { name: "Dawki & Mawlynnong", slug: "dawki", point: { x: 58, y: 70 }, nights: 1 },
    ],
    highlights: [
      "Double-decker living root bridge at Nongriat",
      "Boating on the Umngot river at Dawki",
      "Nohkalikai and Seven Sisters falls",
      "Mawsmai and Arwah caves",
      "Mawlynnong village",
    ],
    whyPoints: [
      {
        title: "Nothing else in India looks like it",
        body: "Root bridges, canyons and clear rivers in a landscape that stays green through the winter.",
      },
      {
        title: "Best in the months everyone ignores",
        body: "October to April is dry, clear and comfortable — the opposite of the monsoon reputation the state carries.",
      },
    ],
    experiences: ["living-root-bridge-trek", "dawki-river"],
    travelTips: [
      "The Nongriat root bridge is roughly 3,000 steps down and the same back up. It is a genuinely hard half day.",
      "Cloud arrives by late morning at the Cherrapunji viewpoints — go early for a view.",
      "Dawki's water is clearest between November and February.",
      "Roads are winding and slow; assume 40 km/h averages when planning days.",
    ],
    howToReach:
      "Fly into Guwahati (GAU), then a 3-hour road transfer to Shillong. Everything else is a 1.5–3 hour drive from there.",
    budgetGuide: [{ label: "Comfortable 3-star", range: "₹23,000 – ₹36,000 per person" }],
    answers: [
      {
        question: "How many days do you need in Meghalaya?",
        answer:
          "Five to seven days. Six days covers Shillong, Cherrapunji, the Nongriat root bridge trek and Dawki without cramming the long drives.",
      },
      {
        question: "When is the best time to visit Meghalaya?",
        answer:
          "October to April. The state receives extraordinary rainfall from May to September, which makes treks unsafe and viewpoints permanently clouded.",
      },
      {
        question: "What does a Meghalaya trip cost?",
        answer:
          "A 6-day Meghalaya package typically starts around ₹23,000 per person on twin sharing with 3-star hotels, a private vehicle from Guwahati and daily breakfast.",
      },
    ],
    faqs: [
      {
        question: "How hard is the living root bridge trek?",
        answer:
          "Hard. Around 3,000 uneven steps down to Nongriat and the same climb back, typically five to six hours in total. It is not suitable for anyone with knee problems, and we will say so rather than sell it.",
      },
    ],
    seo: seo(
      "Meghalaya Tour Packages | Shillong, Cherrapunji & Dawki | Musafir Travels",
      "Meghalaya holiday packages covering Shillong, Cherrapunji, the Nongriat living root bridge and the Umngot river at Dawki, with private transport from Guwahati.",
      "/destinations/meghalaya",
      ["meghalaya tour package", "living root bridge trek", "dawki river boating"],
    ),
    weight: 74,
  }),

  destination({
    id: "dst-andaman",
    slug: "andaman",
    name: "Andaman Islands",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "India's clearest water.",
    intro:
      "The Andamans give you Southeast Asian water without leaving the country — white sand at Radhanagar, live coral at Elephant Beach, and a colonial history at Port Blair that is worth the afternoon. Ferries between islands are the constraint that shapes every itinerary here.",
    hero: scene("beach", "White sand curving into pale turquoise shallows"),
    gallery: [scene("reef", "Coral and fish in shallow clear water")],
    stats: [
      { label: "Ideal duration", value: "5–7 days", numeric: 6, suffix: " days" },
      { label: "Best season", value: "Oct – May" },
      { label: "From", value: "₹28,000", numeric: 28000, prefix: "₹" },
      { label: "Trip styles", value: "Honeymoon · Family · Beach" },
    ],
    idealDurationDays: [5, 7],
    startingPrice: inr(28000),
    bestMonths: ["oct", "nov", "dec", "jan", "feb", "mar", "apr", "may"],
    styles: ["honeymoon", "couple", "family", "beach", "adventure"],
    cities: [
      { name: "Port Blair", slug: "port-blair", point: { x: 50, y: 66 }, nights: 2 },
      { name: "Havelock", slug: "havelock", point: { x: 58, y: 46 }, nights: 3, blurb: "Radhanagar Beach and the best diving in the islands." },
      { name: "Neil Island", slug: "neil-island", point: { x: 54, y: 56 }, nights: 1 },
    ],
    highlights: [
      "Radhanagar Beach at sunset",
      "Snorkelling or a first dive at Elephant Beach",
      "Cellular Jail light and sound show",
      "Natural bridge at Neil Island at low tide",
      "Glass-bottom boat at North Bay",
    ],
    whyPoints: [
      {
        title: "No passport, no visa, no currency exchange",
        body: "The clearest water accessible to Indian travellers, with none of the friction of an international beach trip.",
      },
      {
        title: "Genuinely good first-time diving",
        body: "Havelock's dive schools run well-regulated discover-scuba dives in calm, shallow water with good visibility.",
      },
    ],
    experiences: ["elephant-beach-snorkel", "radhanagar-beach"],
    travelTips: [
      "Inter-island ferries sell out weeks ahead in season and are the single biggest planning constraint — book with the package.",
      "Mobile data is slow and patchy outside Port Blair. Assume you will be offline on Havelock.",
      "Carry cash; card acceptance on the islands is inconsistent.",
      "The monsoon, roughly June to September, brings ferry cancellations rather than just rain.",
    ],
    howToReach:
      "Direct flights to Port Blair (IXZ) from Chennai, Kolkata, Delhi and Bengaluru, typically 2–5 hours. Ferries connect Port Blair, Havelock and Neil in 1–2.5 hours.",
    budgetGuide: [
      { label: "Comfortable 3/4-star", range: "₹28,000 – ₹44,000 per person" },
      { label: "Beachfront resorts", range: "₹60,000 – ₹1,10,000 per person" },
    ],
    answers: [
      {
        question: "How many days do you need in the Andamans?",
        answer:
          "Five to seven days. Six nights split as two in Port Blair, three on Havelock and one on Neil works well, allowing for the ferry timings between them.",
      },
      {
        question: "What does an Andaman trip cost?",
        answer:
          "A 6-day Andaman package typically starts around ₹28,000 per person on twin sharing with 3 or 4-star hotels, all inter-island ferries, transfers and daily breakfast. Flights are additional unless included.",
      },
      {
        question: "When is the best time to visit the Andamans?",
        answer:
          "October to May. The monsoon from June to September causes frequent ferry cancellations, which matters more than the rain itself since the whole itinerary depends on crossings.",
      },
    ],
    faqs: [
      {
        question: "Can non-swimmers snorkel at Elephant Beach?",
        answer:
          "Yes. Operators provide life jackets and guided lines in shallow water, and there is a sea-walk option that keeps your head dry entirely.",
      },
    ],
    seo: seo(
      "Andaman Tour Packages | Havelock, Neil & Port Blair | Musafir Travels",
      "Andaman holiday and honeymoon packages covering Port Blair, Havelock and Neil Island with confirmed ferries, snorkelling and beachfront stays.",
      "/destinations/andaman",
      ["andaman tour package", "havelock island package", "andaman honeymoon package"],
    ),
    weight: 79,
  }),

  destination({
    id: "dst-goa",
    slug: "goa",
    name: "Goa",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "Two states pretending to be one.",
    intro:
      "North Goa and South Goa are separate holidays that happen to share an airport. North is markets, beach shacks and noise; south is long quiet sand and old Portuguese houses. Deciding which one you actually want is most of the planning.",
    hero: scene("beach", "A palm-lined beach at low sun"),
    gallery: [scene("heritage", "A whitewashed Portuguese church facade")],
    stats: [
      { label: "Ideal duration", value: "3–5 days", numeric: 4, suffix: " days" },
      { label: "Best season", value: "Nov – Feb" },
      { label: "From", value: "₹14,500", numeric: 14500, prefix: "₹" },
      { label: "Trip styles", value: "Friends · Weekend · Couple" },
    ],
    idealDurationDays: [3, 5],
    startingPrice: inr(14500),
    bestMonths: ["nov", "dec", "jan", "feb", "mar"],
    styles: ["friends", "weekend", "couple", "beach", "family"],
    cities: [
      { name: "North Goa", slug: "north-goa", point: { x: 46, y: 30 }, nights: 2 },
      { name: "South Goa", slug: "south-goa", point: { x: 52, y: 68 }, nights: 2 },
    ],
    highlights: [
      "Old Goa churches and the Basilica of Bom Jesus",
      "A Mandovi river sunset cruise",
      "Dudhsagar falls in the right season",
      "Anjuna and Mapusa markets",
      "Palolem and Agonda in the south",
    ],
    whyPoints: [
      {
        title: "The shortest holiday that still feels like one",
        body: "Three nights genuinely works, which makes it the best long-weekend option in the country.",
      },
    ],
    experiences: [],
    travelTips: [
      "North to south is a 90-minute drive — pick one base per stretch rather than commuting daily.",
      "Beach shacks are seasonal and largely close during the monsoon.",
      "Rent scooters only with a valid licence and a helmet; enforcement is real and accidents are common.",
    ],
    howToReach:
      "Direct flights to Goa's Mopa (GOX) and Dabolim (GOI) airports from all metros, typically 1–2.5 hours. Mopa is closer to north Goa, Dabolim to the south.",
    budgetGuide: [{ label: "Comfortable 3/4-star", range: "₹14,500 – ₹28,000 per person" }],
    answers: [
      {
        question: "How many days are enough for Goa?",
        answer:
          "Three to five days. Four nights allows two in the north and two in the south, which is the only way to see both without commuting for ninety minutes each day.",
      },
      {
        question: "When is the best time to visit Goa?",
        answer:
          "November to February for dry weather and full beach-shack season. The monsoon from June to September is green and cheap but most shacks and water sports shut down.",
      },
      {
        question: "North Goa or South Goa?",
        answer:
          "North for markets, nightlife and busy beaches; south for long quiet sand, better resorts and Portuguese heritage. Groups of friends usually prefer the north, couples and families the south.",
      },
    ],
    faqs: [],
    seo: seo(
      "Goa Tour Packages | North & South Goa | Musafir Travels",
      "Goa holiday packages covering north and south Goa with beach stays, Old Goa heritage, river cruises and airport transfers.",
      "/destinations/goa",
      ["goa tour package", "north goa south goa itinerary"],
    ),
    weight: 68,
  }),

  destination({
    id: "dst-sikkim",
    slug: "sikkim",
    name: "Sikkim & Darjeeling",
    country: "India",
    region: "india",
    domestic: true,
    tagline: "Kanchenjunga, when the cloud allows.",
    intro:
      "Sikkim and Darjeeling pair naturally — tea gardens and a toy train on one side, monasteries and high lakes on the other, with the third-highest mountain on earth visible from both on a clear morning. Weather governs everything here, so build slack into the itinerary.",
    hero: scene("mountain", "A snow massif above a ridge of tea gardens"),
    gallery: [scene("forest", "Tea garden terraces in morning mist")],
    stats: [
      { label: "Ideal duration", value: "6–8 days", numeric: 7, suffix: " days" },
      { label: "Best season", value: "Mar – May, Oct – Dec" },
      { label: "From", value: "₹22,500", numeric: 22500, prefix: "₹" },
      { label: "Trip styles", value: "Family · Couple · Nature" },
    ],
    idealDurationDays: [6, 8],
    startingPrice: inr(22500),
    bestMonths: ["mar", "apr", "may", "oct", "nov", "dec"],
    styles: ["family", "couple", "cultural", "adventure", "honeymoon"],
    cities: [
      { name: "Gangtok", slug: "gangtok", point: { x: 54, y: 36 }, nights: 3 },
      { name: "Pelling", slug: "pelling", point: { x: 34, y: 46 }, nights: 2 },
      { name: "Darjeeling", slug: "darjeeling", point: { x: 40, y: 66 }, nights: 2 },
    ],
    highlights: [
      "Tiger Hill at sunrise for Kanchenjunga",
      "Tsomgo Lake and Baba Mandir",
      "Darjeeling Himalayan Railway joy ride",
      "Rumtek and Pemayangtse monasteries",
      "A tea estate tour and tasting",
    ],
    whyPoints: [
      {
        title: "Two very different hill cultures in one trip",
        body: "Buddhist Sikkim and colonial-era Darjeeling sit a few hours apart and feel nothing alike.",
      },
    ],
    experiences: [],
    travelTips: [
      "Tsomgo Lake and Nathu La need permits arranged a day in advance, and Nathu La is closed on some days of the week.",
      "Tiger Hill sunrise means a 3:30am start and a real chance of cloud — treat the view as a bonus.",
      "Roads are landslide-prone in the monsoon; June to September is best avoided.",
    ],
    howToReach:
      "Fly to Bagdogra (IXB), then road transfers of 4 hours to Gangtok or 3 hours to Darjeeling. Helicopter transfers to Gangtok operate in fair weather.",
    budgetGuide: [{ label: "Comfortable 3-star", range: "₹22,500 – ₹36,000 per person" }],
    answers: [
      {
        question: "How many days do you need for Sikkim and Darjeeling?",
        answer:
          "Six to eight days. Seven days covers Gangtok, Pelling and Darjeeling with a Tsomgo Lake excursion and a Tiger Hill sunrise attempt.",
      },
      {
        question: "When is the best time to visit Sikkim and Darjeeling?",
        answer:
          "March to May for rhododendrons and clear mornings, and October to December for the best Kanchenjunga visibility. Avoid the June-to-September monsoon, when landslides regularly close roads.",
      },
    ],
    faqs: [],
    seo: seo(
      "Sikkim & Darjeeling Tour Packages | Musafir Travels",
      "Sikkim and Darjeeling holiday packages covering Gangtok, Pelling, Tsomgo Lake and the Darjeeling toy train, with permits and transfers arranged.",
      "/destinations/sikkim",
      ["sikkim darjeeling package", "gangtok tour package"],
    ),
    weight: 71,
  }),
];
