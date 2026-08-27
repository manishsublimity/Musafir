import type { MetadataRoute } from "next";
import {
  getDestinations,
  getExperiences,
  getGuides,
  getPackages,
  getPackagesForDestination,
} from "@/lib/cms";
import { BASE_URL } from "@/lib/seo";

/**
 * The sitemap is generated from the same CMS functions the pages render from,
 * so a new destination or package appears here automatically. Pages that are
 * `noindex` (the customiser, the enquiry form) are deliberately absent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // `as const` on the array keeps `changeFrequency` narrowed to the union
  // Next expects — a plain object literal widens it to `string`.
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/destinations`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/packages`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/experiences`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/honeymoon`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/domestic-holidays`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/international-holidays`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/visa`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/travel-guides`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/why-musafir`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/plan-my-trip`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cancellation-policy`, changeFrequency: "yearly", priority: 0.3 },
  ] as const).map((entry) => ({ ...entry, lastModified: now }));

  const destinations = getDestinations().flatMap((destination) => {
    const entries: MetadataRoute.Sitemap = [
      {
        url: `${BASE_URL}/destinations/${destination.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];

    if (getPackagesForDestination(destination.slug).length) {
      entries.push({
        url: `${BASE_URL}/packages/${destination.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    if (destination.visa) {
      entries.push({
        url: `${BASE_URL}/visa/${destination.slug}`,
        // Visa records change more often than anything else on the site.
        lastModified: new Date(destination.visa.lastVerified),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    return entries;
  });

  const packages = getPackages().map((pkg) => ({
    url: `${BASE_URL}/packages/${pkg.destinationSlug}/${pkg.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const experiences = getExperiences().map((experience) => ({
    url: `${BASE_URL}/experiences/${experience.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guides = getGuides().map((guide) => ({
    url: `${BASE_URL}/travel-guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt ?? guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...destinations, ...packages, ...experiences, ...guides];
}
