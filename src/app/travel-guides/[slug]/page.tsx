import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBackdrop } from "@/components/media/Frame";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs, JsonLd, Section } from "@/components/ui/Primitives";
import { FaqList } from "@/components/content/ContentBlocks";
import { getGuide, getGuides } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { articleSchema, faqSchema, metadataFrom } from "@/lib/seo";

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return metadataFrom(guide.seo, { type: "article" });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd data={articleSchema(guide)} />
      <JsonLd data={faqSchema(guide.faqs)} />

      <section
        aria-label={guide.title}
        className="theme-sand relative flex min-h-[62svh] flex-col justify-end overflow-hidden bg-background pb-14 pt-32 text-text"
      >
        <HeroBackdrop media={guide.hero} seed={`guide-hero-${guide.slug}`} scrim="bottom" />

        <div className="container-editorial relative z-[2]">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Travel guides", href: "/travel-guides" },
              { name: guide.title, href: `/travel-guides/${guide.slug}` },
            ]}
            className="text-muted"
          />

          <SplitText
            as="h1"
            immediate
            lines={[guide.title]}
            className="mt-8 max-w-4xl text-h1 text-text-strong"
          />

          <p className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-label text-muted">
            <span className="font-semibold text-text-strong">{guide.author.name}</span>
            <span>{guide.author.role}</span>
            <span aria-hidden="true">·</span>
            <span>
              Updated {formatDate(guide.updatedAt ?? guide.publishedAt)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{guide.readingMinutes} min read</span>
          </p>
        </div>
      </section>

      <Section theme="day" ariaLabel="Guide content">
        <article className="container-prose">
          <p className="text-lede text-muted">{guide.excerpt}</p>

          {guide.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="text-h2">{section.heading}</h2>
              <p className="mt-5 text-body text-muted">{section.body}</p>
            </section>
          ))}

          {guide.faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-h2">Questions</h2>
              <div className="mt-8">
                <FaqList faqs={guide.faqs} />
              </div>
            </section>
          )}

          <footer className="mt-16 rounded-lg border border-border bg-surface p-8 text-center">
            <p className="text-h3">Want this turned into an actual itinerary?</p>
            <p className="mx-auto mt-3 max-w-md text-body text-muted">
              Tell us your dates and we will apply everything above to a real plan.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/plan-my-trip" arrow>
                Plan my trip
              </ButtonLink>
              {guide.destinationSlug && (
                <ButtonLink href={`/destinations/${guide.destinationSlug}`} variant="secondary">
                  Explore the destination
                </ButtonLink>
              )}
            </div>
          </footer>
        </article>
      </Section>
    </>
  );
}
