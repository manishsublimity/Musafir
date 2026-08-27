import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Destination, Faq, Package, SeoMeta, TravelGuide } from "./types";

export const BASE_URL = site.url;

export function absolute(path: string): string {
  return new URL(path, BASE_URL).toString();
}

/** Builds Next.js metadata from a content record's own `SeoMeta`. */
export function metadataFrom(seo: SeoMeta, opts?: { type?: "website" | "article" }): Metadata {
  const url = absolute(seo.canonical);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: opts?.type ?? "website",
      url,
      title: seo.title,
      description: seo.description,
      siteName: site.name,
      locale: "en_IN",
      images: seo.ogImage ? [{ url: absolute(seo.ogImage) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [absolute(seo.ogImage)] : undefined,
    },
  };
}

/* ---------------------------------------------------------------------------
 * STRUCTURED DATA
 *
 * Every emitter below is constrained to facts the site can actually evidence.
 * Notably absent: `aggregateRating` and `review`, which are the two properties
 * travel sites most often fabricate. They are emitted only when there are
 * verified, consented reviews to base them on — see `reviewSchema`.
 * ------------------------------------------------------------------------- */

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${BASE_URL}/#organization`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: BASE_URL,
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    areaServed: "IN",
    ...(site.founder
      ? { founder: { "@type": "Person", name: site.founder.name, jobTitle: site.founder.role } }
      : {}),
    ...(site.address
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: site.address.locality,
            addressRegion: site.address.region,
            addressCountry: site.address.country,
          },
        }
      : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "customer service",
      availableLanguage: ["en", "hi"],
    },
    sameAs: site.social.map((s) => s.url),
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: site.name,
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.href),
    })),
  };
}

export function faqSchema(faqs: Faq[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function destinationSchema(destination: Destination): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.intro,
    url: absolute(`/destinations/${destination.slug}`),
    address: {
      "@type": "PostalAddress",
      addressCountry: destination.domestic ? "IN" : destination.country,
    },
    touristType: destination.styles.map((s) => s.replace("-", " ")),
    includesAttraction: destination.cities.map((c) => ({
      "@type": "TouristAttraction",
      name: c.name,
      ...(c.blurb ? { description: c.blurb } : {}),
    })),
  };
}

/**
 * `Product` + `Offer` for a package. The offer describes a real, bookable
 * starting price with a stated currency and availability, which is what the
 * spec requires — no rating is attached, because there is no verified rating
 * data behind it.
 */
export function packageSchema(pkg: Package): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.title,
    description: pkg.summary,
    url: absolute(`/packages/${pkg.destinationSlug}/${pkg.slug}`),
    brand: { "@type": "Brand", name: site.name },
    category: `Tour package — ${pkg.destinationName}`,
    offers: {
      "@type": "Offer",
      priceCurrency: pkg.startingPrice.currency,
      price: pkg.startingPrice.amount,
      availability: "https://schema.org/InStock",
      url: absolute(`/packages/${pkg.destinationSlug}/${pkg.slug}`),
      seller: { "@id": `${BASE_URL}/#organization` },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: pkg.startingPrice.amount,
        priceCurrency: pkg.startingPrice.currency,
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "person" },
      },
    },
  };
}

/** A `TouristTrip` describes the itinerary itself, which `Product` cannot. */
export function tripSchema(pkg: Package): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.summary,
    url: absolute(`/packages/${pkg.destinationSlug}/${pkg.slug}`),
    provider: { "@id": `${BASE_URL}/#organization` },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.day,
        item: {
          "@type": "TouristAttraction",
          name: `Day ${day.day}: ${day.title}`,
          description: day.summary,
        },
      })),
    },
  };
}

export function articleSchema(guide: TravelGuide): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    url: absolute(`/travel-guides/${guide.slug}`),
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    author: { "@type": "Person", name: guide.author.name, jobTitle: guide.author.role },
    publisher: { "@id": `${BASE_URL}/#organization` },
    wordCount: guide.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0),
  };
}

/**
 * Emitted only when there are verified, consented reviews. Returns null
 * otherwise — an aggregateRating with no reviews behind it is a structured-data
 * violation, not a marketing shortcut.
 */
export function reviewSchema(
  reviews: { travellerName: string; quote: string; rating?: number; travelDate: string }[],
): Json | null {
  const rated = reviews.filter((r) => typeof r.rating === "number");
  if (!reviews.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${BASE_URL}/#organization`,
    ...(rated.length >= 1
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length).toFixed(1),
            reviewCount: rated.length,
            bestRating: 5,
          },
        }
      : {}),
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.travellerName },
      datePublished: r.travelDate,
      reviewBody: r.quote,
      ...(r.rating
        ? { reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 } }
        : {}),
    })),
  };
}
