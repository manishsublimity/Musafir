import type { Metadata } from "next";
import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { getGuides } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Travel Guides | Musafir Travels",
  description:
    "Planning notes from the trips we design — seasons, timings, realistic budgets, visa timelines and the things that commonly go wrong.",
  canonical: "/travel-guides",
});

export default function TravelGuidesPage() {
  const guides = getGuides();

  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Travel guides", href: "/travel-guides" }]} />
        <h1 className="mt-8 max-w-3xl text-h1">Written to be useful, not to rank.</h1>
        <p className="mt-5 max-w-xl text-lede text-muted">
          Every guide here comes out of trips we have actually planned, and gets updated when the
          facts change.
        </p>
      </div>

      <Section theme="day" padded={false} className="py-[clamp(3rem,6vw,5rem)]">
        <div className="container-editorial">
          <Reveal variant="rise" stagger as="ul" className="grid gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/travel-guides/${guide.slug}`}
                  className="group/g flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,transform] duration-[--duration-base] ease-[--ease-expo] hover:-translate-y-1 hover:border-border-strong"
                >
                  <span className="relative block aspect-[16/9] overflow-hidden">
                    <Scene
                      scene={guide.hero.scene ?? "island"}
                      palette={guide.hero.palette}
                      seed={`guidelist-${guide.slug}`}
                      className="size-full transition-transform duration-[900ms] ease-[--ease-expo] group-hover/g:scale-[1.06]"
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-7">
                    <span className="text-caption uppercase tracking-[0.12em] text-muted">
                      {formatDate(guide.updatedAt ?? guide.publishedAt)} · {guide.readingMinutes} min
                      read
                    </span>
                    <span className="mt-3 text-h3 leading-tight transition-colors group-hover/g:text-primary">
                      {guide.title}
                    </span>
                    <span className="mt-3 text-body text-muted">{guide.excerpt}</span>
                    <span className="mt-auto pt-6 text-label font-semibold text-primary">
                      {guide.author.name}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
